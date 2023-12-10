import { WGRBufferValue } from "../../render/buffer/WGRBufferValue";
import { WGRTexLayoutParam } from "../../render/uniform/IWGRUniformContext";
import { findShaderEntryPoint, WGRShderSrcType } from "../../render/pipeline/WGRPipelineCtxParams";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { getCodeLine, codeLineCommentTest } from "../shader/utils";
import { IWGMaterial } from "../IWGMaterial";
import { WGRPrimitiveImpl } from "../../render/WGRPrimitiveImpl";
import { checkBufferData } from "../../render/buffer/WGRBufferValue";
import { createNewWRGBufferViewUid } from "../../render/buffer/WGRBufferView";
import { IRenderableEntity } from "../../render/IRenderableEntity";
import { IWGRPassNodeBuilder } from "../../render/IWGRPassNodeBuilder";
import { MtPlNodePool } from "./MtPlNodePool";
import { VSMPipeNode } from "./VSMPipeNode";
import { WGTextureDataDescriptor } from "../WGMaterial";
import { WGTextureWrapper } from "../../texture/WGTextureWrapper";
import { FogPipeNode } from "./FogPipeNode";

const bufValue = new WGRBufferValue({ shdVarName: 'mpl-bufValue' });

/**
 * material pipeline
 */
class MtBuilder {
    private mInit = true;
    private mPool: MtPlNodePool;
    uvalues: WGRBufferData[];
    utexes: WGRTexLayoutParam[];

    entity?: IRenderableEntity;
    builder?: IWGRPassNodeBuilder;
    enabled = false;
    constructor(pool: MtPlNodePool) {
        this.mPool = pool;
    }
    initialize(): void {
        if (this.mInit) {
            this.mInit = false;

        }
    }
    checkShader(material: IWGMaterial): void {
        const builder = this.builder;
        if (!builder.hasMaterial(material)) {
            if (!material.getRCtx()) {
                if (!material.shaderSrc) {
                    let pm = (material as IWGMaterial);
                    if (pm.__$build) {
                        let time = Date.now();
                        pm.__$build();
                        time = Date.now() - time;
                        console.log("building material shader loss time: ", time);
                    }
                }
                this.checkShaderSrc(material.shaderSrc);
            }
        }
    }
    checkUniforms(material: IWGMaterial): void {

        let uvalues: WGRBufferData[] = [];
        let utexes: WGRTexLayoutParam[] = [];

        const entity = this.entity;
        const builder = this.builder;
        const cam = builder.camera;
        let exclueukeys = material.exclueukeys ? material.exclueukeys : [];
        // 检测这些关键对象是否会被真正的执行和调用
        if (entity.transform && exclueukeys.indexOf('objMat') < 0) {
            uvalues.push(entity.transform.uniformv);
        }
        if (entity.cameraViewing) {

            if (exclueukeys.indexOf('viewMat') < 0)
                uvalues.push(cam.viewUniformV);

            if (exclueukeys.indexOf('projMat') < 0)
                uvalues.push(cam.projUniformV);
        }
        let ls = material.uniformValues;
        if (ls) {
            for (let i = 0; i < ls.length; i++) {
                uvalues.push(ls[i]);
            }
        }
        if (this.enabled) {
            let ppt = material.property;
            if (ppt) {
                let type = '';
                let pool = this.mPool;

                if (ppt.lighting === true) {
                    type = 'lighting';
                    let light = pool.getNodeByType(type);
                    light.merge(uvalues);
                }
                if (ppt.shadowReceived === true) {
                    type = 'vsmShadow';
                    let vsm = pool.getNodeByType(type) as VSMPipeNode;
                    vsm.merge(uvalues);
                    utexes.push(this.getTexParam(vsm.texture));
                }
                if (ppt.fogging === true) {
                    type = 'fogging';
                    let fog = pool.getNodeByType(type) as FogPipeNode;
                    fog.merge(uvalues);
                }
            }
        }
        if (uvalues && uvalues.length > 0) {
            for (let i = 0; i < uvalues.length; ++i) {
                uvalues[i] = checkBufferData(uvalues[i]);
                if (uvalues[i].uid == undefined || uvalues[i].uid < 0) {
                    uvalues[i].uid = createNewWRGBufferViewUid();
                }
            }
        }
        this.checkTextures(material, utexes);
        this.uvalues = uvalues;
        this.utexes = utexes;
    }
    private getTexParam(texWrapper: WGTextureWrapper): WGRTexLayoutParam {
        const tex = texWrapper.texture;
        let dimension = tex.viewDimension;
        // console.log("getTexParam(), texWrapper: ", texWrapper);
        // console.log("getTexParam(), tex.texture: ", tex.texture);
        if (!tex.view) {
            tex.view = tex.texture.createView({ dimension });
            tex.view.dimension = dimension;
        }
        return {
            texView: tex.view,
            viewDimension: tex.viewDimension,
            shdVarName: tex.shdVarName,
            multisampled: tex.data.multisampled
        }
    }
    // private getTexParamA(texWrapper: WGTextureWrapper): WGRTexLayoutParam {
    //     const tex = texWrapper.texture;
    //     let dimension = tex.viewDimension;
    //     if (!tex.view) {
    //         tex.view = tex.texture.createView({ dimension });
    //         tex.view.dimension = dimension;
    //     }
    //     return {
    //         texView: tex.view,
    //         viewDimension: tex.viewDimension,
    //         shdVarName: tex.shdVarName,
    //         multisampled: tex.data.multisampled
    //     }
    // }
    private checkTextures(material: IWGMaterial, utexes: WGRTexLayoutParam[]): void {
        let texList = material.textures;
        if (texList && texList.length > 0) {
            for (let i = 0; i < texList.length; i++) {
                utexes.push(this.getTexParam(texList[i]));
                // const tex = texList[i].texture;
                // let dimension = tex.viewDimension;
                // if (!tex.view) {
                //     tex.view = tex.texture.createView({ dimension });
                //     tex.view.dimension = dimension;
                // }
                // utexes.push(
                //     {
                //         texView: tex.view,
                //         viewDimension: tex.viewDimension,
                //         shdVarName: tex.shdVarName,
                //         multisampled: tex.data.multisampled
                //     }
                // );
            }
        }
    }
    buildMaterial(material: IWGMaterial, primitive: WGRPrimitiveImpl): void {
        const builder = this.builder;
        if (!builder.hasMaterial(material)) {
            const uvalues = this.uvalues;
            const utexes = this.utexes;
            builder.setMaterial(material);
            if (!material.getRCtx()) {
                material.shaderSrc = this.shaderBuild(material.shaderSrc, uvalues, utexes);

                if (!material.pipelineVtxParam) {
                    if (primitive) {
                        material.pipelineVtxParam = { vertex: { attributeIndicesArray: [] } };
                        const ls = [];
                        for (let i = 0; i < primitive.vbufs.length; ++i) {
                            ls.push([0]);
                        }
                        material.pipelineVtxParam.vertex.attributeIndicesArray = ls;
                    }
                }
            }
            this.checkMaterialParam(material, primitive);
            const node = builder.getPassNodeWithMaterial(material);
            // console.log('WGRObjBuilder::createRPass(), node.uid: ', node.uid, ", node: ", node);
            let pctx = node.createRenderPipelineCtxWithMaterial(material);
            material.initialize(pctx);
        }
    }
    checkMaterialParam(material: IWGMaterial, primitive: WGRPrimitiveImpl): void {
        if (!material.shaderSrc.compShaderSrc) {
            const vtxParam = material.pipelineVtxParam;
            if (primitive && vtxParam) {
                const vert = vtxParam.vertex;
                vert.buffers = primitive.vbufs;
                vert.drawMode = primitive.drawMode;
            }
            const pipeDef = material.pipelineDefParam;
            if (material.doubleFace !== undefined) {
                pipeDef.faceCullMode = material.doubleFace === true ? 'none' : pipeDef.faceCullMode;
            }
        }
    }
    checkShaderSrc(shdSrc: WGRShderSrcType): void {
        if (shdSrc) {
            if (shdSrc.code !== undefined && !shdSrc.shaderSrc) {
                const obj = { code: shdSrc.code, uuid: shdSrc.uuid };
                if (findShaderEntryPoint('@compute', shdSrc.code) != '') {
                    // console.log(">>>>>>>>>>> find comp shader >>>>>>>>>>>>>>>>>>>>>");
                    shdSrc.compShaderSrc = shdSrc.compShaderSrc ? shdSrc.compShaderSrc : obj;
                } else {
                    // console.log(">>>>>>>>>>> find curr shader >>>>>>>>>>>>>>>>>>>>>");
                    shdSrc.shaderSrc = shdSrc.shaderSrc ? shdSrc.shaderSrc : obj;
                }
            }
            if (shdSrc.vert) {
                shdSrc.vertShaderSrc = shdSrc.vert;
            }
            if (shdSrc.frag) {
                shdSrc.fragShaderSrc = shdSrc.frag;
            }
            if (shdSrc.comp) {
                shdSrc.compShaderSrc = shdSrc.comp;
            }
        }
    }
    shaderBuild(shdSrc: WGRShderSrcType, uvalues: WGRBufferData[], utexes: WGRTexLayoutParam[]): WGRShderSrcType {
        let shd = shdSrc.shaderSrc;
        if (shd) {

            let code = shd.code;
            let bi = code.indexOf('@binding(');
            for (let i = 0; i < 30; ++i) {
                if (bi >= 0) {
                    let codeLine = getCodeLine(code, bi);
                    if (!codeLineCommentTest(codeLine)) {
                        break;
                    }
                } else {
                    break;
                }
            }
            if (bi >= 0) {
                let begin = code.indexOf('@group(');
                let end = code.lastIndexOf(' @binding(');
                end = code.indexOf(';', end + 1);
                code = code.slice(0, begin) + code.slice(end + 1);
                // console.log('oooooooooo begin, end: ', begin, end);
            }
            // console.log('oooooooooo code: ', code);
            // console.log(`code.indexOf('@binding(') < 0: `, code.indexOf('@binding(') < 0);
            if (bi < 0) {
                let codeStr = '';
                let index = 0;
                if (uvalues && uvalues.length > 0) {
                    // @group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
                    for (let i = 0; i < uvalues.length; ++i) {
                        bufValue.usage = uvalues[i].usage;
                        let varType = bufValue.isStorage() ? 'storage' : 'uniform';
                        let str = `@group(0) @binding(${index++}) var<${varType}> ${uvalues[i].shdVarName} : ${uvalues[i].shdVarFormat};\n`;
                        codeStr += str;
                    }
                }
                if (utexes && utexes.length > 0) {
                    // console.log('utexes: ', utexes);
                    for (let i = 0; i < utexes.length; ++i) {
                        let tex = utexes[i];
                        let varType = 'texture_2d';
                        switch (tex.viewDimension) {
                            case 'cube':
                                varType = 'texture_cube';
                                break;
                            default:
                                break;
                        }
                        let str = `@group(0) @binding(${index++}) var ${tex.shdVarName}Sampler: sampler;\n`;
                        str += `@group(0) @binding(${index++}) var ${tex.shdVarName}Texture: ${varType}<f32>;\n`;
                        codeStr += str;
                    }
                }
                // console.log("shaderBuild(), codeStr:");
                // console.log(codeStr);
                if (codeStr !== '') {
                    codeStr = codeStr + code;
                    let shaderSrc = {
                        // shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
                        shaderSrc: { code: codeStr, uuid: shd.uuid },
                        // shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
                    };
                    // console.log("shaderBuild() VVVVVVVVVVVVVVVVVVVVVVVV, codeStr: ");
                    // console.log( codeStr );
                    return shaderSrc;
                }
            }
        }
        return shdSrc;
    }
}
export { MtBuilder };
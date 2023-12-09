import { WGRBufferValue } from "../../render/buffer/WGRBufferValue";
import { WGRTexLayoutParam } from "../../render/uniform/IWGRUniformContext";
import { findShaderEntryPoint, WGRShderSrcType } from "../../render/pipeline/WGRPipelineCtxParams";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { getCodeLine, codeLineCommentTest } from "../shader/utils";
import { IWGMaterial } from "../IWGMaterial";
import { WGRPrimitiveImpl } from "../../render/WGRPrimitiveImpl";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { LightPipeNode } from "./LightPipeNode";
import { VSMPipeNode } from "./VSMPipeNode";
import { checkBufferData } from "../../render/buffer/WGRBufferValue";
import { createNewWRGBufferViewUid } from "../../render/buffer/WGRBufferView";
import { IRenderableEntity } from "../../render/IRenderableEntity";
import { IWGRPassNodeBuilder } from "../../render/IWGRPassNodeBuilder";

const bufValue = new WGRBufferValue({ shdVarName: 'mpl-bufValue' });
class PipeNodePool {
    pool: Map<string, MtPlNodeImpl> = new Map();
    addNode(node: MtPlNodeImpl): void {
        if (node) {
            this.pool.set(node.type, node);
        }
    }
    hasNodeByType(type: string): boolean {
        return this.pool.has(type);
    }
    getNodeByType(type: string): MtPlNodeImpl {
        return this.pool.get(type);
    }
    initialize(): void {
        let lightNode = new LightPipeNode();
        this.addNode(lightNode);

        let vsmNode = new VSMPipeNode();
        this.addNode(vsmNode);
    }
}
/**
 * material pipeline
 */
class MtlPipeline {
    private mInit = true;
    private pool = new PipeNodePool();

    light: LightPipeNode;
    vsm: VSMPipeNode;

    entity?: IRenderableEntity;
    builder?: IWGRPassNodeBuilder;

    constructor() { }
    initialize(): void {
        if (this.mInit) {
            this.mInit = false;

            let pool = this.pool;
            pool.initialize();

            let type = 'lighting';
            this.light = pool.getNodeByType(type) as LightPipeNode;

            type = 'vsmShadow';
            this.vsm = pool.getNodeByType(type) as VSMPipeNode;
        }
    }
    checkUniforms(material: IWGMaterial, uvalues: WGRBufferData[]): void {

        const entity = this.entity;
        if (entity.transform) {
			uvalues.push(entity.transform.uniformv);
		}
        const builder = this.builder;
        const cam = builder.camera;
		if (entity.cameraViewing) {
			uvalues.push(cam.viewUniformV);
			uvalues.push(cam.projUniformV);
		}
        let ls = material.uniformValues;
        if (ls) {
            for (let i = 0; i < ls.length; i++) {
                uvalues.push(ls[i]);
            }
        }
        let ppt = material.property;
        if (ppt) {
            let type = '';
            let pool = this.pool;
            if (ppt.lighting === true) {
                type = 'lighting';
                let light = pool.getNodeByType(type);
                light.merge(uvalues);
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
    }

    checkTextures(material: IWGMaterial, utexes: WGRTexLayoutParam[]): void {
        let texList = material.textures;
        if (texList && texList.length > 0) {
            for (let i = 0; i < texList.length; i++) {
                const tex = texList[i].texture;
                let dimension = tex.viewDimension;
                if (!tex.view) {
                    tex.view = tex.texture.createView({ dimension });
                    tex.view.dimension = dimension;
                }
                utexes.push(
                    {
                        texView: tex.view,
                        viewDimension: tex.viewDimension,
                        shdVarName: tex.shdVarName,
                        multisampled: tex.data.multisampled
                    }
                );
            }
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
export { MtlPipeline };
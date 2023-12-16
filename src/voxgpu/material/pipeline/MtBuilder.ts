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
import { WGTextureWrapper } from "../../texture/WGTextureWrapper";
import { FogPipeNode } from "./FogPipeNode";
import { LightPipeNode } from "./LightPipeNode";

const bufValue = new WGRBufferValue({ shdVarName: 'mpl-bufValue' });

/**
 * material pipeline
 */
class MtBuilder {
    private mInit = true;
    private mPool: MtPlNodePool;
    private mPreDef = '';
    private mUniqueKey = '';
    uvalues: WGRBufferData[];
    utexes: WGRTexLayoutParam[];

    entity?: IRenderableEntity;
    builder?: IWGRPassNodeBuilder;
    enabled = false;
    constructor(pool: MtPlNodePool) {
        this.mPool = pool;
    }
    reset(material: IWGMaterial): void {

        this.mPreDef = '';
        this.mUniqueKey = material.shadinguuid;
        const ppt = material.property;
        if(ppt) {
            if(ppt.getUniqueKey) {
                this.mUniqueKey += ppt.getUniqueKey();
            }
        }
        let pdp = material.pipelineDefParam;
		if (pdp) {
			this.mUniqueKey += pdp.faceCullMode + pdp.blendModes;
			// console.log("pdp.faceCullMode: ", pdp.faceCullMode);
		}
        if(this.enabled) {
            this.buildKey( material );
            this.buildPreDef( material );
        }

    }
    initialize(): void {
        if (this.mInit) {
            this.mInit = false;
        }
    }
    private buildKey(material: IWGMaterial): void {
        let ts = material.textures;
		let ppt = material.property;
        let uk = this.mUniqueKey;
        if (ppt.fogging) {
			uk += '-FOG';
		}
		if (ppt.shadowReceived) {
			uk += '-VSM_SHADOW';
		}
		if (ppt.lighting) {
			uk += '-LIGHT';
		}
        if (ts) {
			for (let i = 0; i < ts.length; ++i) {
				// console.log('ts[i].texture.shdVarName: ', ts[i].texture.shdVarName);
				switch (ts[i].texture.shdVarName) {
					case 'normal':
						uk += '-NORMAL_MAP';
						break;
					case 'albedo':
						uk += '-ALBEDO';
						break;
					case 'ao':
						uk += '-AO';
						break;
					case 'roughness':
						uk += '-ROUGHNESS';
						break;
					case 'metallic':
						uk += '-METALLIC';
						break;
					case 'specularEnv':
						uk += '-SPECULAR_ENV';
						break;
					case 'arm':
						uk += '-ARM_MAP';
						break;
					case 'emissive':
						uk += '-EMISSIVE_MAP';
						break;
					case 'opacity':
						uk += '-OPACITY_MAP';
						break;
					default:
						break;
				}
			}
		}

        this.mUniqueKey = uk;
    }
    
    private buildPreDef(material: IWGMaterial): void {
        let ts = material.textures;
		let ppt = material.property;
		let preCode = ppt.getPreDef();
		if (ppt.fogging) {
			preCode += '#define USE_FOG\n';
		}
		if (ppt.shadowReceived) {
			preCode += '#define USE_VSM_SHADOW\n';
		}
		if (ppt.lighting) {
			preCode += '#define USE_LIGHT\n';
		}
        let type = '';
        let pool = this.mPool;
        if (ppt.lighting === true) {
            type = 'lighting';
            let light = pool.getNodeByType(type) as LightPipeNode;
            let param = light.lightParam;
            if (param.pointLightsNum > 0) {
                preCode += `#define USE_POINT_LIGHTS_TOTAL ${param.pointLightsNum}\n`;
            }
            if (param.directionLightsNum > 0) {
                preCode += `#define USE_DIRECTION_LIGHTS_TOTAL ${param.directionLightsNum}\n`;
            }
            if (param.spotLightsNum > 0) {
                preCode += `#define USE_SPOT_LIGHTS_TOTAL ${param.spotLightsNum}\n`;
            }
        }
		if (ts) {
			for (let i = 0; i < ts.length; ++i) {
				// console.log('ts[i].texture.shdVarName: ', ts[i].texture.shdVarName);
				switch (ts[i].texture.shdVarName) {
					case 'normal':
						preCode += '#define USE_NORMAL_MAP\n';
						break;
					case 'albedo':
						preCode += '#define USE_ALBEDO\n';
						break;
					case 'ao':
						preCode += '#define USE_AO\n';
						break;
					case 'roughness':
						preCode += '#define USE_ROUGHNESS\n';
						break;
					case 'metallic':
						preCode += '#define USE_METALLIC\n';
						break;
					case 'specularEnv':
						preCode += '#define USE_SPECULAR_ENV\n';
						break;
					case 'arm':
						preCode += '#define USE_ARM_MAP\n';
						break;
					case 'emissive':
						preCode += '#define USE_EMISSIVE_MAP\n';
						break;
					case 'opacity':
						preCode += '#define USE_OPACITY_MAP\n';
						break;
					default:
						break;
				}
			}
		}
        this.mPreDef = preCode;
    }
    private createShdCode(material: IWGMaterial): void {
        if (!material.shaderSrc) {
            let pm = (material as IWGMaterial);
            if (pm.__$build) {
                let time = Date.now();
                pm.__$build(this.mPreDef, this.mUniqueKey);
                time = Date.now() - time;
                console.log("building material shader loss time: ", time);
                console.log("this.mUniqueKey: ");
                console.log(this.mUniqueKey);
            }
        }
        this.checkShaderSrc(material.shaderSrc);
    }
    checkShader(material: IWGMaterial): void {
        const builder = this.builder;
        if (!builder.hasMaterial(material, this.mUniqueKey)) {
            if (!material.getRCtx()) {
                if(this.enabled) {
                    const node = builder.getPassNodeWithMaterial(material);
                    if(!node.hasRenderPipelineCtxWithUniqueKey(this.mUniqueKey)) {
                        this.createShdCode(material);
                    }else {
                        console.log(`don't need build the shader code, this.mUniqueKey: `, this.mUniqueKey);
                    }
                }else {
                    this.createShdCode(material);
                }
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
                    let light = pool.getNodeByType(type) as LightPipeNode;
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
    private checkTextures(material: IWGMaterial, utexes: WGRTexLayoutParam[]): void {
        let texList = material.textures;
        if (texList && texList.length > 0) {
            for (let i = 0; i < texList.length; i++) {
                utexes.push(this.getTexParam(texList[i]));
            }
        }
    }
    buildMaterial(material: IWGMaterial, primitive: WGRPrimitiveImpl): void {
        const builder = this.builder;
        let uk = this.enabled ? this.mUniqueKey : material.shadinguuid;
        if (!builder.hasMaterial(material, uk)) {
            const uvalues = this.uvalues;
            const utexes = this.utexes;
            builder.setMaterial(material, uk);
            const node = builder.getPassNodeWithMaterial(material);
            if (!material.getRCtx()) {
                // console.log("XXXXXXXXXXXXXX this.mUniqueKey: ", uk);
                if(!node.hasRenderPipelineCtxWithUniqueKey( uk )) {
                    material.shaderSrc = this.shaderCodeCorrect(material.shaderSrc, uvalues, utexes);
                }
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
            // console.log('WGRObjBuilder::createRPass(), node.uid: ', node.uid, ", node: ", node);
            let pctx = node.createRenderPipelineCtxWithMaterial(material, uk);
            material.initialize(pctx);
        }
    }
    checkMaterialParam(material: IWGMaterial, primitive: WGRPrimitiveImpl): void {
		let isComputing = material.computing === true;
        if (!isComputing) {
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
    private shaderCodeCorrect(shdSrc: WGRShderSrcType, uvalues: WGRBufferData[], utexes: WGRTexLayoutParam[]): WGRShderSrcType {
        let shd = shdSrc.shaderSrc;
        if (shd) {
            shd.uvalues = uvalues;
            shd.utexes = utexes;
            /*
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
                // console.log("shaderCodeCorrect(), codeStr:");
                // console.log(codeStr);
                if (codeStr !== '') {
                    codeStr = codeStr + code;
                    let shaderSrc = {
                        // shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
                        shaderSrc: { code: codeStr, uuid: shd.uuid },
                        // shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
                    };
                    // console.log("shaderCodeCorrect() VVVVVVVVVVVVVVVVVVVVVVVV, codeStr: ");
                    // console.log( codeStr );
                    return shaderSrc;
                }
            }
            //*/
        }
        return shdSrc;
    }
}
export { MtBuilder };
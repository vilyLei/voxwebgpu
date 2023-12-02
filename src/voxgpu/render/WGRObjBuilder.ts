import { Entity3D } from "../entity/Entity3D";
import { WGRPrimitive } from "./WGRPrimitive";
import { IWGRUnit } from "./IWGRUnit";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";

import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { GPUTextureView } from "../gpu/GPUTextureView";
import { WGRCompUnit } from "./WGRCompUnit";
import { IRenderableObject } from "./IRenderableObject";
import { WGCompMaterial } from "../material/WGCompMaterial";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { findShaderEntryPoint, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { WGREntityNode } from "./WGREntityNode";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { IWGMaterial } from "../material/IWGMaterial";
import { WGRPrimitiveDict, WGGeometry } from "../geometry/WGGeometry";
import { WGRDrawMode } from "./Define";
import { checkBufferData, WGRBufferValue } from "./buffer/WGRBufferValue";
import { createNewWRGBufferViewUid } from "./buffer/WGRBufferView";

type GeomType = { indexBuffer?: GPUBuffer, vertexBuffers: GPUBuffer[], indexCount?: number, vertexCount?: number, drawMode?: WGRDrawMode };
const bufValue = new WGRBufferValue({ shdVarName: 'bufValue' });
class WGRObjBuilder {

	wgctx: WebGPUContext;

	constructor() { }
	createPrimitive(geomParam?: GeomType): WGRPrimitive {
		// console.log('XXXXXX createPrimitive() ...');
		const g = new WGRPrimitive();
		g.ibuf = geomParam.indexBuffer;
		g.vbufs = geomParam.vertexBuffers;
		if (geomParam.indexCount !== undefined) {
			g.indexCount = geomParam.indexCount;
		}
		if (geomParam.vertexCount !== undefined) {
			g.vertexCount = geomParam.vertexCount;
		}
		if (geomParam.drawMode !== undefined) {
			g.drawMode = geomParam.drawMode;
		}
		return g;
	}
	private checkShaderSrc(shdSrc: WGRShderSrcType): void {
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
	private checkUniforms(shdSrc: WGRShderSrcType, uvalues: WGRBufferData[], utexes: { texView: GPUTextureView, viewDimension: string, shdVarName: string }[]): WGRShderSrcType {
		let shd = shdSrc.shaderSrc;
		if (shd) {

			let code = shd.code;
			if (code.indexOf('@binding(') >= 0) {
				let begin = code.indexOf('@group(');
				let end = code.lastIndexOf(' @binding(');
				end = code.indexOf(';', end + 1);
				code = code.slice(0, begin) + code.slice(end + 1);
				// console.log('oooooooooo begin, end: ', begin, end);
			}
			// console.log('oooooooooo code: ', code);
			// console.log(`code.indexOf('@binding(') < 0: `, code.indexOf('@binding(') < 0);
			if (code.indexOf('@binding(') < 0) {
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
				// console.log("checkUniforms(), codeStr:");
				// console.log(codeStr);
				if (codeStr !== '') {
					codeStr = codeStr + code;
					let shaderSrc = {
						// shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
						shaderSrc: { code: codeStr, uuid: shd.uuid },
						// shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
					};
					// console.log("checkUniforms() VVVVVVVVVVVVVVVVVVVVVVVV, codeStr: ");
					// console.log( codeStr );
					return shaderSrc;
				}
			}
		}
		return shdSrc;
	}
	private checkMaterial(material: IWGMaterial, primitive: WGRPrimitive): void {
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

	createRPass(entity: Entity3D, builder: IWGRPassNodeBuilder, geometry: WGGeometry, materialIndex = 0, blockUid = 0): IWGRUnit {

		const material = entity.materials[materialIndex];
		// console.log("XXXXXXX material: ", material);
		let primitive: WGRPrimitive;
		let pctx = material.getRCtx();
		if (geometry) {
			const wgctx = builder.getWGCtx();
			const dict = geometry.primitive;
			const vertexBuffers = geometry.gpuvbufs;
			const vertexCount = vertexBuffers[0].vectorCount;
			const gibuf = geometry.indexBuffer;
			if (material.wireframe === true) {
				primitive = dict.wireframe;
				if (!primitive) {
					gibuf.toWirframe();
					const indexBuffer = gibuf ? (gibuf.gpuwibuf ? gibuf.gpuwibuf : wgctx.buffer.createIndexBuffer(gibuf.wireframeData)) : null;
					if (indexBuffer) gibuf.gpuwibuf = indexBuffer;

					const indexCount = indexBuffer ? indexBuffer.elementCount : 0;
					primitive = this.createPrimitive({ vertexBuffers, indexBuffer, indexCount, vertexCount, drawMode: WGRDrawMode.LINES });
					dict.wireframe = primitive;
					// console.log("wireframe primitive.drawMode: ", primitive.drawMode, primitive);
				}
			} else {
				primitive = dict.default;
				if (!primitive) {
					const indexBuffer = gibuf ? (gibuf.gpuibuf ? gibuf.gpuibuf : wgctx.buffer.createIndexBuffer(gibuf.data)) : null;
					if (indexBuffer) gibuf.gpuibuf = indexBuffer;

					const indexCount = indexBuffer ? indexBuffer.elementCount : 0;
					primitive = this.createPrimitive({ vertexBuffers, indexBuffer, indexCount, vertexCount, drawMode: geometry.drawMode });
					dict.default = primitive;
					// console.log("default primitive.drawMode: ", primitive.drawMode, primitive);
				}
			}
		}
		if (!builder.hasMaterial(material)) {
			if (!pctx) {
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

		let groupIndex = 0;
		// console.log("createRUnit(), utexes: ", utexes);
		const isComputing = material.shaderSrc.compShaderSrc !== undefined;

		let uvalues: WGRBufferData[] = [];
		const cam = builder.camera;
		if (!isComputing) {
			if (entity.transform) {
				uvalues.push(entity.transform.uniformv);
			}
			if (entity.cameraViewing) {
				uvalues.push(cam.viewUniformV);
				uvalues.push(cam.projUniformV);
			}
		}

		if (material.uniformValues) {
			uvalues = uvalues.concat(material.uniformValues);
		}
		// transform 与 其他材质uniform数据构造和使用应该分开,
		// 哪些uniform是依据material变化的，哪些是共享的，哪些是transform等变换的数据

		let texList = material.textures;
		let utexes: { texView: GPUTextureView, viewDimension: string, shdVarName: string }[];
		// console.log("createRUnit(), texList: ", texList);
		if (!isComputing) {
			if (texList && texList.length > 0) {
				utexes = new Array(texList.length);
				for (let i = 0; i < texList.length; i++) {
					const tex = texList[i].texture;
					let dimension = tex.viewDimension;
					if (!tex.view) {
						tex.view = tex.texture.createView({ dimension });
					}
					tex.view.dimension = dimension;
					utexes[i] = { texView: tex.view, viewDimension: tex.viewDimension, shdVarName: tex.shdVarName };
				}
			}
		}
		let uniformFlag = (uvalues && uvalues.length > 0) || (utexes && utexes.length > 0);
		if (uvalues && uvalues.length > 0) {
			for (let i = 0; i < uvalues.length; ++i) {
				uvalues[i] = checkBufferData(uvalues[i]);
				if (uvalues[i].uid == undefined || uvalues[i].uid < 0) {
					uvalues[i].uid = createNewWRGBufferViewUid();
				}
			}
		}
		/*
		let v = values[i];
				v = checkBufferData(v);
				if(v.uid == undefined || v.uid < 0) {
					v.uid = createNewWRGBufferViewUid();
				}
		*/

		if (!builder.hasMaterial(material)) {
			builder.setMaterial(material);
			if (!pctx) {
				// this.checkShaderSrc(material.shaderSrc);
				material.shaderSrc = this.checkUniforms(material.shaderSrc, uvalues, utexes);

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
			this.checkMaterial(material, primitive);
			const node = builder.getPassNodeWithMaterial(material);
			// console.log('WGRObjBuilder::createRPass(), node.uid: ', node.uid, ", node: ", node);
			pctx = node.createRenderPipelineCtxWithMaterial(material);
			material.initialize(pctx);
		}

		let ru: IWGRUnit;

		if (isComputing) {
			let et = (entity as IRenderableObject);
			let rcompunit = new WGRCompUnit();
			let compMat = material as WGCompMaterial;
			if (et.workcounts) {
				rcompunit.workcounts = et.workcounts;
			}
			if (compMat && compMat.workcounts) {
				rcompunit.workcounts = compMat.workcounts;
			}
			if (!rcompunit.workcounts) {
				rcompunit.workcounts = new Uint16Array([1, 1, 0, 0]);
			}
			rcompunit.rp = pctx.rpass;
			ru = rcompunit;
		} else {
			let runit = new WGRUnit();
			runit.geometry = primitive;
			runit.rp = pctx.rpass;
			ru = runit;
		}

		ru.pipelinectx = pctx;
		const uniformCtx = pctx.uniformCtx;

		if (uniformFlag) {
			ru.uniforms = uniformCtx.createUniformsWithValues([
				{
					layoutName: material.shadinguuid,
					groupIndex: groupIndex,
					values: uvalues,
					texParams: utexes
				}
			], material.uniformAppend);
		}
		ru.material = material;
		ru.etuuid = entity.uuid + '-[block(' + blockUid + '), material(' + material.shadinguuid + ')]';
		return ru;
	}
	createRUnit(entity: Entity3D, builder: IWGRPassNodeBuilder, node: WGREntityNode, blockUid = 0): IWGRUnit {

		const wgctx = builder.getWGCtx();

		const geometry = entity.geometry;
		let primitiveDict: WGRPrimitiveDict;
		if (entity.geometry) {
			primitiveDict = geometry.primitive;
			// console.log('>>> primitiveDict: ', primitiveDict);
			if (!primitiveDict) {

				const gts = geometry.attributes;
				const gvbufs = geometry.gpuvbufs;
				const vertexBuffers: GPUBuffer[] = gvbufs ? gvbufs : new Array(gts.length);
				if (!gvbufs) {
					for (let i = 0; i < gts.length; ++i) {
						const gt = gts[i];
						vertexBuffers[i] = wgctx.buffer.createVertexBuffer(gt.data, gt.bufferOffset, gt.strides);
					}
					geometry.gpuvbufs = vertexBuffers;
				}
				primitiveDict = {};
				geometry.primitive = primitiveDict;
			}
		}

		let ru: IWGRUnit;
		const mts = entity.materials;
		if (mts.length > 1) {
			const passes: IWGRUnit[] = new Array(mts.length);
			for (let i = 0; i < mts.length; ++i) {
				passes[i] = this.createRPass(entity, builder, geometry, i, blockUid);
				// passes[i].etuuid = entity.uuid + '-[block(' + blockUid+')]';
			}
			ru = new WGRUnit();
			// console.log("xxxxxxxxx passes: ", passes);
			ru.passes = passes;
		} else {
			ru = this.createRPass(entity, builder, geometry);
		}
		ru.bounds = entity.globalBounds;
		ru.st = entity.rstate;
		ru.st.__$rendering = true;

		ru.pst = node.rstate;
		ru.__$rever = ru.pst.__$rever;
		// ru.etuuid = entity.uuid;
		return ru;
	}
}
export { WGRObjBuilder };

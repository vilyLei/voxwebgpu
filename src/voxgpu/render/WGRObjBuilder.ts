import { Entity3D } from "../entity/Entity3D";
import { WGRPrimitive } from "./WGRPrimitive";
import { IWGRUnit } from "./IWGRUnit";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { GPUTextureView } from "../gpu/GPUTextureView";
import { WGRCompUnit } from "./WGRCompUnit";
import { IRenderableObject } from "./IRenderableObject";
import { WGCompMaterial } from "../material/WGCompMaterial";

type GeomType = { indexBuffer?: GPUBuffer; vertexBuffers: GPUBuffer[]; indexCount?: number; vertexCount?: number };

class WGRObjBuilder {
	constructor() { }
	createPrimitive(geomParam?: GeomType): WGRPrimitive {
		const g = new WGRPrimitive();
		g.ibuf = geomParam.indexBuffer;
		g.vbufs = geomParam.vertexBuffers;
		if (geomParam.indexCount !== undefined) {
			g.indexCount = geomParam.indexCount;
		}
		if (geomParam.vertexCount !== undefined) {
			g.vertexCount = geomParam.vertexCount;
		}
		return g;
	}
	createRPass(entity: Entity3D, block: WGRenderPassBlock, primitive: WGRPrimitive, materialIndex = 0): IWGRUnit {

		const material = entity.materials[materialIndex];

		let pctx = material.getRCtx();
		if (!pctx) {
			if (material.pipelineVtxParam) {
				material.pipelineVtxParam.vertex.buffers = primitive.vbufs;
			} else {
				if (primitive) {
					material.pipelineVtxParam = { vertex: { buffers: primitive.vbufs, attributeIndicesArray: [] } };
					const ls = material.pipelineVtxParam.vertex.attributeIndicesArray;
					for (let i = 0; i < primitive.vbufs.length; ++i) {
						ls.push([0]);
					}
				}
			}
			const rpparam = block.createRenderPipelineCtxWithMaterial(material);
			pctx = rpparam.ctx;
			material.initialize(rpparam.ctx);
		}

		// console.log("createRUnit(), utexes: ", utexes);
		const isComputing = material.shaderCodeSrc.compShaderSrc;

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
		let uvalues: WGRUniformValue[] = [];

		const cam = block.camera;
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

		let groupIndex = 0;
		let texList = material.textures;
		let utexes: { texView: GPUTextureView }[];
		// console.log("createRUnit(), texList: ", texList);
		if (!isComputing) {
			if (texList && texList.length > 0) {
				utexes = new Array(texList.length);
				for (let i = 0; i < texList.length; i++) {
					const tex = texList[i].texture;
					if (!tex.view) {
						tex.view = tex.texture.createView({ dimension: tex.dimension });
					}
					tex.view.dimension = tex.dimension
					utexes[i] = { texView: tex.view };
				}
			}
		}
		if ((uvalues && uvalues.length > 0) || (utexes && utexes.length > 0)) {
			ru.uniforms = uniformCtx.createUniformsWithValues([
				{
					layoutName: material.shadinguuid,
					groupIndex: groupIndex,
					values: uvalues,
					texParams: utexes
				}
			]);
		}
		// ru.unfsuuid = material.shadinguuid + material.name;
		ru.material = material;
		return ru;
	}
	createRUnit(entity: Entity3D, block: WGRenderPassBlock): IWGRUnit {

		const wgctx = block.getWGCtx();

		let primitive: WGRPrimitive;
		if (entity.geometry) {

			const geometry = entity.geometry;
			const gts = geometry.attributes;

			// console.log("########## geometry.gpuvbufs: ", geometry.gpuvbufs);
			// console.log("########## geometry.gpuibuf: ", geometry.indexBuffer.gpuibuf);

			const gvbufs = geometry.gpuvbufs;

			const vertexBuffers: GPUBuffer[] = gvbufs ? gvbufs : new Array(gts.length);
			if (!gvbufs) {
				for (let i = 0; i < gts.length; ++i) {
					const gt = gts[i];
					vertexBuffers[i] = wgctx.buffer.createVertexBuffer(gt.data, gt.bufferOffset, gt.strides);
				}
				geometry.gpuvbufs = vertexBuffers;
			}

			const gibuf = geometry.indexBuffer;
			const indexBuffer = gibuf ? (gibuf.gpuibuf ? gibuf.gpuibuf : wgctx.buffer.createIndexBuffer(gibuf.data)) : null;
			if (indexBuffer) gibuf.gpuibuf = indexBuffer;

			const indexCount = indexBuffer ? indexBuffer.elementCount : 0;
			const vertexCount = vertexBuffers[0].vectorCount;
			primitive = this.createPrimitive({ vertexBuffers, indexBuffer, indexCount, vertexCount });
		}

		let ru: IWGRUnit;
		const mts = entity.materials;
		if (mts.length > 1) {
			const passes: IWGRUnit[] = new Array(mts.length);
			for (let i = 0; i < mts.length; ++i) {
				passes[i] = this.createRPass(entity, block, primitive, i);
			}
			ru = new WGRUnit();
			console.log("xxxxxxxxx passes: ", passes);
			ru.passes = passes;
		} else {
			ru = this.createRPass(entity, block, primitive);
		}
		ru.bounds = entity.getGlobalBounds();
		ru.st = entity.rstate;
		ru.st.__$rendering = true;
		ru.__$rever = ru.st.__$rever;

		ru.etuuid = entity.uuid;
		block.addRUnit(ru);
		return ru;
	}
}
export { WGRObjBuilder };

import { Entity3D } from "../entity/Entity3D";
import { WGRPrimitive } from "./WGRPrimitive";
import { IWGRUnit } from "./IWGRUnit";
import { WGRUnit } from "./WGRUnit";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGREntityParam } from "./WGREntityParam";

import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { WGRCompUnit } from "./WGRCompUnit";
import { IRenderableObject } from "./IRenderableObject";
import { WGCompMaterial } from "../material/WGCompMaterial";
import { WGREntityNode } from "./WGREntityNode";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { IWGMaterial } from "../material/IWGMaterial";
import { WGRPrimitiveDict, WGGeometry } from "../geometry/WGGeometry";
import { WGRDrawMode } from "./Define";
import { WGMaterial } from "../material/WGMaterial";
import { MtPipeline } from "../material/pipeline/MtPipeline";

type GeomType = { indexBuffer?: GPUBuffer, vertexBuffers: GPUBuffer[], indexCount?: number, vertexCount?: number, drawMode?: WGRDrawMode };

class WGRObjBuilder {

	wgctx: WebGPUContext;
	mtpl = new MtPipeline();
	constructor() {
		this.mtpl.initialize();
	}
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

	createRPass(entity: Entity3D, builder: IWGRPassNodeBuilder, geometry: WGGeometry, material: IWGMaterial, blockUid = 0): IWGRUnit {

		// console.log("XXXXXXX material: ", material);
		
		let mtpl = this.mtpl;
		let mtb = mtpl.builder;
		mtb.builder = builder;
		mtb.entity = entity;

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
		mtb.checkShader( material );

		let groupIndex = 0;
		// console.log("createRUnit(), utexes: ", utexes);


		mtb.checkUniforms(material);
		
		let uvalues = mtb.uvalues;
		let utexes = mtb.utexes;

		let uniformFlag = uvalues.length > 0 || utexes.length > 0;

		mtb.buildMaterial(material, primitive);
		pctx = material.getRCtx();
		

		let ru: IWGRUnit;

		const isComputing = material.shaderSrc.compShaderSrc !== undefined;
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
	createRUnit(entity: Entity3D, builder: IWGRPassNodeBuilder, node: WGREntityNode, blockUid = 0, param?: WGREntityParam): IWGRUnit {

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
		const mts = param && param.materials && param.materials.length > 0 ? param.materials : entity.materials;
		if (mts.length > 1) {
			const passes: IWGRUnit[] = new Array(mts.length);
			for (let i = 0; i < mts.length; ++i) {
				passes[i] = this.createRPass(entity, builder, geometry, mts[i], blockUid);
				// passes[i].etuuid = entity.uuid + '-[block(' + blockUid+')]';
			}
			ru = new WGRUnit();
			// console.log("xxxxxxxxx passes: ", passes);
			ru.passes = passes;
		} else {
			ru = this.createRPass(entity, builder, geometry, mts[0]);
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

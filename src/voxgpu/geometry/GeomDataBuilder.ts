import Vector3 from "../math/Vector3";

import { GPUBuffer } from "../gpu/GPUBuffer";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRPrimitive } from "../render/WGRPrimitive";

import BoxGeometry from "./primitive/BoxGeometry";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import AABB from "../cgeom/AABB";

type GeomRDataType = {
	vs?: Float32Array, uvs?: Float32Array, nvs?: Float32Array, ivs?: Uint16Array | Uint32Array,
	vbufs: GPUBuffer[], ibuf: GPUBuffer, vtxDescParam: VtxPipelinDescParam, rgeom?: WGRPrimitive,
	bounds?: AABB
};
class GeomDataBuilder {
	private mWGCtx: WebGPUContext;
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
	}

	createCubeWithSize(size: number): GeomRDataType {
		size *= 0.5;
		let minV = new Vector3(-size, -size, -size);
		let maxV = minV.clone().scaleBy(-1);
		return this.createBoxRData(minV, maxV);
	}
	createBoxRData(minV: Vector3, maxV: Vector3): GeomRDataType {
		let mesh = new BoxGeometry();
		mesh.setBufSortFormat(0xfffffff);
		mesh.initialize(minV, maxV);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = mesh.getVS();
		let uvs = mesh.getUVS();
		let nvs = mesh.getNVS();
		let ivs = mesh.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]) : null;
		let uvsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]) : null;
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx ? this.mWGCtx.buffer.createIndexBuffer(ivs) : null;

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: mesh.bounds};
	}
}
export { GeomRDataType, GeomDataBuilder }

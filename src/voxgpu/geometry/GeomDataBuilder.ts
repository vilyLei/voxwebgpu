import Vector3 from "../math/Vector3";

import { GPUBuffer } from "../gpu/GPUBuffer";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRPrimitive } from "../render/WGRPrimitive";

import BoxGeometry from "./primitive/BoxGeometry";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import AABB from "../cgeom/AABB";
import RectPlaneGeometry from "./primitive/RectPlaneGeometry";
import SphereGeometry from "./primitive/SphereGeometry";
import CylinderGeometry from "./primitive/CylinderGeometry";
import TorusGeometry from "./primitive/TorusGeometry";

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

	createTorus(ringRadius: number, axisRadius = 20, longitudeNumSegments = 20, latitudeNumSegments = 20): GeomRDataType {
		let geom = new TorusGeometry();
		geom.setBufSortFormat(0xfffffff);
		geom.initialize(ringRadius, axisRadius, longitudeNumSegments, latitudeNumSegments);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = geom.getVS();
		let uvs = geom.getUVS();
		let nvs = geom.getNVS();
		let ivs = geom.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]) : null;
		let uvsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]) : null;
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } } as VtxPipelinDescParam;
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: geom.bounds};
	}
	createCylinder(radius: number, height = 200, longitudeNumSegments = 20, latitudeNumSegments = 20): GeomRDataType {
		let geom = new CylinderGeometry();
		geom.setBufSortFormat(0xfffffff);
		geom.initialize(radius, height, longitudeNumSegments, latitudeNumSegments);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = geom.getVS();
		let uvs = geom.getUVS();
		let nvs = geom.getNVS();
		let ivs = geom.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]);
		let uvsBuf = this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]);
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx.buffer.createIndexBuffer(ivs);

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: geom.bounds};
	}
	createSphere(radius: number, longitudeNumSegments = 20, latitudeNumSegments = 20): GeomRDataType {
		let geom = new SphereGeometry();
		geom.setBufSortFormat(0xfffffff);
		geom.initialize(radius, longitudeNumSegments, latitudeNumSegments, false);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = geom.getVS();
		let uvs = geom.getUVS();
		let nvs = geom.getNVS();
		let ivs = geom.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]) : null;
		let uvsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]) : null;
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx ? this.mWGCtx.buffer.createIndexBuffer(ivs) : null;

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: geom.bounds};
	}
	createCubeWithSize(size: number): GeomRDataType {
		size *= 0.5;
		let minV = new Vector3(-size, -size, -size);
		let maxV = minV.clone().scaleBy(-1);
		return this.createBox(minV, maxV);
	}
	createBox(minV: Vector3, maxV: Vector3): GeomRDataType {
		let geom = new BoxGeometry();
		geom.setBufSortFormat(0xfffffff);
		geom.initialize(minV, maxV);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = geom.getVS();
		let uvs = geom.getUVS();
		let nvs = geom.getNVS();
		let ivs = geom.getIVS();

		let vtTotal = vs.length / 3;
		let vsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]) : null;
		let uvsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [uvs.length / vtTotal]) : null;
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx ? this.mWGCtx.buffer.createIndexBuffer(ivs) : null;

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: geom.bounds};
	}
	createSquare(size: number, axisFlag = 0): GeomRDataType {
		return this.createRect(-0.5 * size, -0.5 * size, size, size, axisFlag);
	}
	createRect(px: number, py: number, pw: number, ph: number, axisFlag = 0): GeomRDataType {

		let geom = new RectPlaneGeometry();
		geom.axisFlag = axisFlag
		geom.setBufSortFormat(0xfffffff);
		geom.initialize(px, py, pw, ph);

		let vbufs: GPUBuffer[];
		let ibuf: GPUBuffer;
		let vs = geom.getVS();
		let uvs = geom.getUVS();
		let nvs = geom.getNVS();
		let ivs = geom.getIVS();
		// console.log("vs: ", vs);
		// console.log("uvs: ", uvs);
		// console.log("ivs: ", ivs);

		let vsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(vs, 0, [3]) : null;
		let uvsBuf = this.mWGCtx ? this.mWGCtx.buffer.createVertexBuffer(uvs, 0, [2]) : null;
		vbufs = [vsBuf, uvsBuf];

		ibuf = this.mWGCtx ? this.mWGCtx.buffer.createIndexBuffer(ivs) : null;

		const vtxDescParam = { vertex: { buffers: vbufs, attributeIndicesArray: [[0], [0]] } };
		return {ivs, vs, uvs, nvs, vbufs: vbufs, ibuf: ibuf, vtxDescParam: vtxDescParam, bounds: geom.bounds};
	}
}
export { GeomRDataType, GeomDataBuilder }

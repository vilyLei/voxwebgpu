import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRDrawMode } from "./Define";
import { WGRAttribData } from "./buffer/WGRAttribData";
import { WGRPrimitiveImpl } from "./WGRPrimitiveImpl";

class WGRPrimitive implements WGRPrimitiveImpl {

	wgctx: WebGPUContext;
	dynamic = false;
	vbufs: GPUBuffer[];
	ibuf: GPUBuffer;
	vdatas: WGRAttribData[];
	vbvers: number[];
	indexCount = 0;

	layoutUid = 0;
	instanceCount = 1;
	vertexCount = 0;

	drawMode = WGRDrawMode.TRIANGLES;

	run(rc: GPURenderPassEncoder): void {
		const bs = this.vbufs;
		if(bs) {
			let vvs = this.vbvers;
			let vds = this.vdatas;
			let wgctx = this.wgctx;
			for (let i = 0, ln = bs.length; i < ln; ++i) {
				if(vvs[i] != vds[i].dataVer) {
					console.log("WGRPrimitive::run(), >>> >>>");
					vvs[i] = vds[i].dataVer;
					wgctx.buffer.updateBuffer(bs[i], vds[i].data);
				}
				rc.setVertexBuffer(i, bs[i]);
			}
		}
	}
	update(): void {
		this.vbvers = new Array(this.vdatas.length);
		let vs = this.vbvers;
		for(let i = 0, len = vs.length; i < len; ++i) {
			vs[i] = this.vdatas[i].dataVer;
		}
		if(this.ibuf) {
			this.indexCount = this.indexCount > 0 ? this.indexCount : this.ibuf.elementCount;
		}else {
			this.vertexCount = this.vertexCount > 0 ? this.vertexCount : this.vbufs[0].vectorCount;
		}
	}
	destroy(): void {
		this.wgctx = null;
		this.vbufs = null;
		this.vdatas = null;
		this.dynamic = false;
	}
}
export { WGRPrimitive }

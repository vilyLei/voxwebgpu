import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { WGRDrawMode } from "./Define";
import { WGRAttribData } from "./buffer/WGRAttribData";
import { WGRPrimitiveImpl } from "./WGRPrimitiveImpl";

class WGRPrimitive implements WGRPrimitiveImpl {

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
		const vs = this.vbufs;
		if(vs) {
			for (let j = 0, ln = vs.length; j < ln; ++j) {
				rc.setVertexBuffer(j, vs[j]);
			}
		}
	}
	update(): void {
		this.vbvers = new Array(this.vdatas.length);
		if(this.ibuf) {
			this.indexCount = this.indexCount > 0 ? this.indexCount : this.ibuf.elementCount;
		}else {
			this.vertexCount = this.vertexCount > 0 ? this.vertexCount : this.vbufs[0].vectorCount;
		}
	}
	destroy(): void {
		this.vbufs = null;
		this.vdatas = null;
		this.dynamic = false;
	}
}
export { WGRPrimitive }

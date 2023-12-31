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
	// clone(): WGRPrimitive {
	// 	const g = new WGRPrimitive();
	// 	g.layoutUid = this.layoutUid;
	// 	g.vbufs = this.vbufs;
	// 	g.ibuf = this.ibuf;
	// 	g.indexCount = this.indexCount;
	// 	g.instanceCount = this.instanceCount;
	// 	g.vertexCount = this.vertexCount;
	// 	return g;
	// }
}
export { WGRPrimitive }

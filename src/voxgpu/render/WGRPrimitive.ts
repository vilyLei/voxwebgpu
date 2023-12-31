import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { WGRDrawMode } from "./Define";
import { WGRPrimitiveImpl } from "./WGRPrimitiveImpl";
// dynamic or static for materials?
// shared or private for materials?
class WGRPrimitive implements WGRPrimitiveImpl {

	vbufs: GPUBuffer[];
	ibuf: GPUBuffer;
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
	clone(): WGRPrimitive {
		const g = new WGRPrimitive();
		g.layoutUid = this.layoutUid;
		g.vbufs = this.vbufs;
		g.ibuf = this.ibuf;
		g.indexCount = this.indexCount;
		g.instanceCount = this.instanceCount;
		g.vertexCount = this.vertexCount;
		return g;
	}
}
export { WGRPrimitive }

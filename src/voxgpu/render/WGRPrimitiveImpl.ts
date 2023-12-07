import { GPUBuffer } from "../gpu/GPUBuffer";
// import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";

interface WGRPrimitiveImpl {

	vbufs: GPUBuffer[];
	ibuf: GPUBuffer;
	indexCount: number;

	layoutUid: number;
	instanceCount: number;
	vertexCount: number;

	drawMode: number;

	// run(rc: GPURenderPassEncoder): void;
	// update(): void;
}
export { WGRPrimitiveImpl }

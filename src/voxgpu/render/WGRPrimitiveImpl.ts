import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRAttribData } from "./buffer/WGRAttribData";
// import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";

interface WGRPrimitiveImpl {

	dynamic: boolean;
	vdatas: WGRAttribData[];
	vbufs: GPUBuffer[];
	vbvers: number[];
	ibuf: GPUBuffer;
	indexCount: number;

	layoutUid: number;
	instanceCount: number;
	vertexCount: number;

	drawMode: number;

}
export { WGRPrimitiveImpl }

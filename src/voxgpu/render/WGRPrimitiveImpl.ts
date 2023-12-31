import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRAttribData } from "./buffer/WGRAttribData";
import { WebGPUContext } from "../gpu/WebGPUContext";

interface WGRPrimitiveImpl {

	wgctx: WebGPUContext;
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

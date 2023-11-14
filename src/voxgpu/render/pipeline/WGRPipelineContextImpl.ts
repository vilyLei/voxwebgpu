import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { IWGRUniformContext } from "../uniform/IWGRUniformContext";
import { WGRendererPassImpl } from "./WGRendererPassImpl";
import { WGRBufferVisibility } from "../buffer/WGRBufferVisibility";
import { WGRBufferData } from "../buffer/WGRBufferData";
import { WGRBindGroupContext } from "./WGRBindGroupContext";
import { WGRDrawMode } from "../../render/Define";

interface BufDataParamType {
	size: number;
	usage: number;
	defaultData?: NumberArrayDataType;
	shared: boolean;
	vuid?: number;
	arrayStride?: number;
	visibility?: WGRBufferVisibility,
	ufvalue?: WGRBufferData
};
type VtxDescParam = { vertex: { arrayStride: number, params: { offset: number, format: string }[] } };
type BindGroupDataParamType = { index: number, buffer: GPUBuffer, bufferSize: number, shared: boolean};
type VtxPipelinDescParam = { vertex: { buffers?: GPUBuffer[], attributeIndicesArray: number[][], drawMode?: WGRDrawMode  } };
type UniformBufferParam = { sizes: number[], usage: number, arrayStride?:number };

interface WGRPipelineContextImpl {
	bindGroupCtx: WGRBindGroupContext;
	rpass: WGRendererPassImpl;
	pipeline?: GPURenderPipeline;
	comppipeline?: GPUComputePipeline;
	readonly uniformCtx: IWGRUniformContext;

	destroy(): void;
	getWGCtx(): WebGPUContext;

}
export { BindGroupDataParamType, VtxDescParam, VtxPipelinDescParam, BufDataParamType, UniformBufferParam, WGRPipelineContextImpl };

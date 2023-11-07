import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { IWGRUniformContext } from "../uniform/IWGRUniformContext";
import { IWGRendererPass } from "./IWGRendererPass";
import { WGRShaderVisibility } from "../uniform/WGRShaderVisibility";
import { WGRUniformValue } from "../uniform/WGRUniformValue";
import { WGRBindGroupContext } from "./WGRBindGroupContext";

interface BufDataParamType {
	size: number;
	usage: number;
	defaultData?: NumberArrayDataType;
	shared: boolean;
	vuid?: number;
	usageType?: number;
	arrayStride?: number;
	visibility?: WGRShaderVisibility,
	ufvalue?: WGRUniformValue
};
type VtxDescParam = { vertex: { arrayStride: number, params: { offset: number, format: string }[] } };
type BindGroupDataParamType = { index: number, buffer: GPUBuffer, bufferSize: number, shared: boolean, usageType?: number };
type VtxPipelinDescParam = { vertex: { buffers?: GPUBuffer[], attributeIndicesArray: number[][] } };
type UniformBufferParam = { sizes: number[], usage: number, arrayStride?:number };

interface IWGRPipelineContext {
	bindGroupCtx: WGRBindGroupContext;
	rpass: IWGRendererPass;
	pipeline?: GPURenderPipeline;
	comppipeline?: GPUComputePipeline;
	readonly uniformCtx: IWGRUniformContext;

	destroy(): void;
	getWGCtx(): WebGPUContext;

}
export { BindGroupDataParamType, VtxDescParam, VtxPipelinDescParam, BufDataParamType, UniformBufferParam, IWGRPipelineContext };

import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { IWGRUniformContext } from "../uniform/IWGRUniformContext";
import { IWGRendererPass } from "./IWGRendererPass";

type BufDataParamType = { size: number; usage: number; defaultData?: Float32Array | Int32Array | Uint32Array | Uint16Array | Int16Array };
type VtxDescParam = { vertex: { arrayStride: number; params: { offset: number; format: string }[] } };
type VtxPipelinDescParam = { vertex: { buffers?: GPUBuffer[], attributeIndicesArray: number[][] } };

interface IWGRPipelineContext {

	rpass: IWGRendererPass;
	pipeline: GPURenderPipeline;
	readonly uniformCtx: IWGRUniformContext;

	getWGCtx(): WebGPUContext;
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, byteOffset?: number): void;
	createUniformBindGroup(
		groupIndex: number,
		dataParams?: { index: number; buffer: GPUBuffer; bufferSize: number }[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[]
	): GPUBindGroup;
	createUniformsBuffer(params: { sizes: number[]; usage: number }, mappedAtCreation?: boolean): GPUBuffer | null;

}
export { VtxDescParam, VtxPipelinDescParam, BufDataParamType, IWGRPipelineContext };

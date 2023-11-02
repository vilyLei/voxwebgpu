import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { IWGRUniformContext } from "../uniform/IWGRUniformContext";
import { IWGRendererPass } from "./IWGRendererPass";

type BufDataParamType = { size: number, usage: number, defaultData?: NumberArrayDataType, shared: boolean, usageType?: number };
type VtxDescParam = { vertex: { arrayStride: number, params: { offset: number, format: string }[] } };
type BindGroupDataParamType = { index: number, buffer: GPUBuffer, bufferSize: number, shared: boolean, usageType?: number };
type VtxPipelinDescParam = { vertex: { buffers?: GPUBuffer[], attributeIndicesArray: number[][] } };

interface IWGRPipelineContext {

	rpass: IWGRendererPass;
	pipeline: GPURenderPipeline;
	readonly uniformCtx: IWGRUniformContext;

	destroy(): void;
	getWGCtx(): WebGPUContext;
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, byteOffset?: number): void;
	createUniformBindGroupDesc(
		groupIndex: number,
		dataParams?: { index: number; buffer: GPUBuffer; bufferSize: number }[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex?: number
	): GPUBindGroupDescriptor;

	uniformBindGroupDescUpdate(
		desc: GPUBindGroupDescriptor,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		index?: number
	): void;
	createUniformBindGroupWithDesc(desc: GPUBindGroupDescriptor): GPUBindGroup;
	createUniformBindGroup(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView, sampler?: GPUSampler }[],
		bindIndex?: number
	): GPUBindGroup;

	/**
	 * @param params { sizes: number[]; usage: number } type instance.
	 * @param initSize The defaut value is 0.
	 * @param force256 The defaut value is true.
	 * @param mappedAtCreation The defaut value is false.
	 */
	createUniformsBuffer(params: { sizes: number[]; usage: number }, initSize?: number, force256?: boolean, mappedAtCreation?: boolean): GPUBuffer | null;

}
export { BindGroupDataParamType, VtxDescParam, VtxPipelinDescParam, BufDataParamType, IWGRPipelineContext };

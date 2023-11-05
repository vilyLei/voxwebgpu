import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { IWGRUniformContext } from "../uniform/IWGRUniformContext";
import { IWGRendererPass } from "./IWGRendererPass";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { GPUBindGroupLayoutDescriptor } from "../../gpu/GPUBindGroupLayoutDescriptor";
import { WGRShaderVisibility } from "../uniform/WGRShaderVisibility";

interface BufDataParamType {
	size: number;
	usage: number;
	defaultData?: NumberArrayDataType;
	shared: boolean;
	vuid?: number;
	usageType?: number;
	arrayStride?: number;
	visibility?: WGRShaderVisibility
};
type VtxDescParam = { vertex: { arrayStride: number, params: { offset: number, format: string }[] } };
type BindGroupDataParamType = { index: number, buffer: GPUBuffer, bufferSize: number, shared: boolean, usageType?: number };
type VtxPipelinDescParam = { vertex: { buffers?: GPUBuffer[], attributeIndicesArray: number[][] } };
type UniformBufferParam = { sizes: number[], usage: number, arrayStride?:number };

interface IWGRPipelineContext {

	rpass: IWGRendererPass;
	pipeline?: GPURenderPipeline;
	comppipeline?: GPUComputePipeline;
	readonly uniformCtx: IWGRUniformContext;

	destroy(): void;
	getWGCtx(): WebGPUContext;
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, byteOffset?: number): void;
	createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout;
	createBindGroupDesc(
		groupIndex: number,
		dataParams?: { index: number; buffer: GPUBuffer; bufferSize: number }[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex?: number,
		layout?: GPUBindGroupLayout
	): GPUBindGroupDescriptor;

	bindGroupDescUpdate(
		desc: GPUBindGroupDescriptor,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		index?: number
	): void;
	createBindGroupWithDesc(desc: GPUBindGroupDescriptor): GPUBindGroup;
	createBindGroup(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView, sampler?: GPUSampler }[],
		bindIndex?: number,
		layout?: GPUBindGroupLayout
	): GPUBindGroup;

	/**
	 * @param params UniformBufferParam instance.
	 * @param initSize The defaut value is 0.
	 * @param force256 The defaut value is true.
	 * @param mappedAtCreation The defaut value is false.
	 */
	createUniformsBuffer(params: UniformBufferParam, initSize?: number, force256?: boolean, mappedAtCreation?: boolean): GPUBuffer | null;

}
export { BindGroupDataParamType, VtxDescParam, VtxPipelinDescParam, BufDataParamType, UniformBufferParam, IWGRPipelineContext };

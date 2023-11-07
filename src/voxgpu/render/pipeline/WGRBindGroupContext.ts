import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBindGroupDescriptor, GPUBindGroupDescriptorEntity, GPUBindGroupDescriptorEntityResource } from "../../gpu/GPUBindGroupDescriptor";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUBufferDescriptor } from "../../gpu/GPUBufferDescriptor";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPURenderPipelineEmpty } from "../../gpu/GPURenderPipelineEmpty";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { BindGroupDataParamType, BufDataParamType, VtxDescParam, VtxPipelinDescParam, UniformBufferParam, IWGRPipelineContext } from "./IWGRPipelineContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRPipelineShader } from "./WGRPipelineShader";
import { WGRUniformParam, WGRUniformContext } from "../uniform/WGRUniformContext";
import { GPUQueue } from "../../gpu/GPUQueue";
import { IWGRendererPass } from "./IWGRendererPass";
import { GPUBindGroupLayoutDescriptor } from "../../gpu/GPUBindGroupLayoutDescriptor";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { GPUPipelineLayout } from "../../gpu/GPUPipelineLayout";
/**
 * one type shading shader, one WGRBindGroupContext instance
 */
class WGRBindGroupContext {
	private static sUid = 0;
	private mUid = WGRBindGroupContext.sUid++;

	private mWGCtx: WebGPUContext;
	private mBGLayouts: GPUBindGroupLayout[] = new Array(8);


	rpass: IWGRendererPass;
	pipeline?: GPURenderPipeline = new GPURenderPipelineEmpty();
	comppipeline?: GPUComputePipeline;

	type = "render";
	queue: GPUQueue;

	constructor(wgCtx?: WebGPUContext) {
		// console.log("XXX XXX create a WGRBindGroupContext instance.");
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	getUid(): number {
		return this.mUid;
	}
	destroy(): void {
		if(this.mWGCtx) {
			this.mWGCtx = null;
		}
	}
	initialize(wgCtx: WebGPUContext): void {
		if (wgCtx && !this.mWGCtx) {
			this.mWGCtx = wgCtx;
			this.queue = wgCtx.queue;
		}
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	createUniformBufferWithParam(bufSize: number, usage: number, mappedAtCreation = false): GPUBuffer {
		const desc = {
			size: bufSize,
			usage: usage,
			mappedAtCreation
		};
		const buf = this.mWGCtx.device.createBuffer(desc);
		return buf;
	}
	/**
	 * @param params UniformBufferParam instance.
	 * @param initSize The defaut value is 0.
	 * @param force256 The defaut value is true.
	 * @param mappedAtCreation The defaut value is false.
	 */
	createUniformsBuffer(
		params: UniformBufferParam,
		initSize = 0,
		force256: boolean = true,
		mappedAtCreation = false
	): GPUBuffer | null {
		if (params && params.sizes.length > 0) {
			let total = params.sizes.length;
			let size = initSize;
			let bufSize = size;
			let segs: { index: number, size: number }[] = new Array(total);
			if (force256) {
				for (let i = 0; i < total; ++i) {
					size = size <= 256 ? size : size % 256;
					size = size > 0 ? 256 - size : 0;

					bufSize += size;
					size = params.sizes[i];
					segs[i] = { index: bufSize, size: size };
					bufSize += size;
				}
			} else {
				for (let i = 0; i < total; ++i) {
					size = params.sizes[i];
					segs[i] = { index: bufSize, size: size };
					bufSize += size;
				}
			}
			const desc = {
				size: bufSize,
				usage: params.usage,
				arrayStride: params.arrayStride
			};
			// const buf = this.mWGCtx.device.createBuffer(desc);
			const buf = this.mWGCtx.buffer.createBuffer(desc);
			buf.segs = segs;
			buf.arrayStride = params.arrayStride;
			// console.log("createUniformsBuffer(), segs: ", segs);
			// console.log("createUniformsBuffer(), bufSize: ", bufSize, ", usage: ", params.usage);
			return buf;
		}
		return null;
	}
	updateUniformBufferAt(buffer: GPUBuffer, td: NumberArrayDataType, index: number, offset = 0): void {
		// console.log("updateUniformBufferAt() index: ", index,",segs: ", buffer.segs);
		// console.log("updateUniformBufferAt() buffer.size: ", buffer.size);
		// console.log("updateUniformBufferAt() buffer.segs[index].index + offset: ", buffer.segs[index].index + offset);
		// console.log("updateUniformBufferAt() td: ", td);
		this.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
	}
	createBindGroupLayout(descriptor: GPUBindGroupLayoutDescriptor): GPUBindGroupLayout {
		const device = this.mWGCtx.device;
		return device.createBindGroupLayout(descriptor);
	}
	bindGroupDescUpdate(
		desc: GPUBindGroupDescriptor,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		index = 0,
		uniformAppend?: boolean
	): void {
		let ei = 0;
		let es = desc.entries;
		let flag = uniformAppend === false ? true : false;
		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					const res = es[i].resource as GPUBindGroupDescriptorEntityResource;
					if (res.offset !== undefined) {
						// the minimum BufferBindingType::ReadOnlyStorage alignment (256)
						res.offset = res.shared || flag ? 0 : index * 256;
						res.buffer = dp.buffer;
						res.size = dp.bufferSize;
					}
					ei++;
				} else {
					throw Error("Illegal operaiton !!!");
				}
			}
		}
		if (texParams && texParams.length > 0) {
			for (let i = 0; i < texParams.length; ++i) {
				const t = texParams[i];
				if (t.texView) {
					let et = es[ei++] as GPUBindGroupDescriptorEntity;
					if (t.sampler && et.resource !== t.sampler) {
						et.resource = t.sampler;
					}
					et = es[ei++] as GPUBindGroupDescriptorEntity;
					if (et.resource !== t.texView) {
						et.resource = t.texView;
					}
				}
			}
		}
	}
	createBindGroupDesc(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex = 0,
		layout?: GPUBindGroupLayout
	): GPUBindGroupDescriptor {
		const device = this.mWGCtx.device;

		if (!layout && !this.mBGLayouts[groupIndex]) {
			if(this.pipeline) {
				this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
			}else {
				this.mBGLayouts[groupIndex] = this.comppipeline.getBindGroupLayout(groupIndex);
			}
		}
		let desc = {
			layout: layout ? layout : this.mBGLayouts[groupIndex],
			entries: []
		} as GPUBindGroupDescriptor;

		let bindI = 0;
		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					const offset = dp.shared ? 0 : 256 * dp.index
					// console.log("ooooooooo bindI: ", bindI, ", i: ", i);
					// console.log("		offset: ", offset);
					// console.log("		dp.shared: ", dp.shared, ", bufferSize: ",dp.bufferSize);
					// console.log("		", dp.buffer);
					const ed = {
						binding: bindIndex + bindI++,
						resource: {
							offset, // 实际应用中的计算不在这里
							buffer: dp.buffer,
							size: dp.bufferSize,
							shared: dp.shared,
							usageType: dp.usageType,
						}
					};
					desc.entries.push(ed);
				}
			}
		}

		// console.log("createUniformBindGroup(), texParams: ", texParams);
		if (texParams && texParams.length > 0) {
			const sampler = device.createSampler({
				magFilter: "linear",
				minFilter: "linear",
				mipmapFilter: "linear"
			});

			for (let i = 0; i < texParams.length; ++i) {
				const t = texParams[i];
				if (t.texView) {
					const es = {
						binding: bindIndex + bindI++,
						resource: t.sampler ? t.sampler : sampler
					};
					const et = {
						binding: bindIndex + bindI++,
						resource: t.texView
					};
					desc.entries.push(es, et);
				}
			}
		}
		// console.log("createUniformBindGroup(), desc: ", desc);
		if (desc.entries.length < 1) {
			throw Error("Illegal operation !!!");
		}
		return desc;
	}
	private static sBindGroupUid = 0;
	private createBindGroupObj(desc: GPUBindGroupDescriptor): GPUBindGroup {
		const device = this.mWGCtx.device;
		if (desc.entries.length < 1) {
			throw Error("Illegal operation !!!");
		}
		console.log("createBindGroupObj(), desc: ", desc);
		const p = device.createBindGroup(desc);
		p.uid = WGRBindGroupContext.sBindGroupUid ++;
		return p;
	}
	createBindGroupWithDesc(desc: GPUBindGroupDescriptor): GPUBindGroup {
		return this.createBindGroupObj( desc );
	}
	createBindGroup(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex = 0,
		layout?: GPUBindGroupLayout
	): GPUBindGroup {
		const desc = this.createBindGroupDesc(groupIndex, dataParams, texParams, bindIndex, layout);
		return this.createBindGroupObj( desc );
	}
}
export { VtxPipelinDescParam, BufDataParamType, WGRUniformParam, WGRBindGroupContext };

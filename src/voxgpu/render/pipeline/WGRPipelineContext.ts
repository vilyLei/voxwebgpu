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
import { BindGroupDataParamType, BufDataParamType, VtxDescParam, VtxPipelinDescParam, IWGRPipelineContext } from "./IWGRPipelineContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRPipelineShader } from "./WGRPipelineShader";
import { WGRUniformParam, WGRUniformContext } from "../uniform/WGRUniformContext";
import { GPUQueue } from "../../gpu/GPUQueue";
import { IWGRendererPass } from "./IWGRendererPass";

class WGRPipelineContext implements IWGRPipelineContext {
	private static sUid = 0;
	private mUid = WGRPipelineContext.sUid++;
	private mInit = true;
	private mWGCtx: WebGPUContext;
	private mBGLayouts: GPUBindGroupLayout[] = new Array(8);
	private mPipelineParams: WGRPipelineCtxParams;
	private mShader = new WGRPipelineShader();

	rpass: IWGRendererPass;
	pipeline: GPURenderPipeline = new GPURenderPipelineEmpty();
	queue: GPUQueue;

	shadinguuid = "";
	name = "PipelineContext";
	readonly uniformCtx = new WGRUniformContext();

	constructor(wgCtx?: WebGPUContext) {
		console.log("XXX XXX create a WGRPipelineContext instance.");
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	private init(): void {
		if (this.mInit) {
			this.mInit = false;
			const ctx = this.mWGCtx;
			const p = this.mPipelineParams;
			if (p) {
				this.mShader.build(p);
				p.label = this.shadinguuid + "-pl-" + this.mUid;
				console.log("WGRPipelineContext::init(), param:\n", p);
				this.pipeline = ctx.device.createRenderPipeline(p);
			}
		}
	}
	updateSharedUniforms(): void {}
	runBegin(): void {
		this.init();
		this.uniformCtx.runBegin();
	}
	runEnd(): void {
		this.uniformCtx.runEnd();
	}
	initialize(wgCtx: WebGPUContext): void {
		if (wgCtx && !this.mWGCtx) {
			this.mWGCtx = wgCtx;
			this.uniformCtx.initialize(this);
			this.mShader.initialize(wgCtx);
		}
	}

	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	createUniformBuffer(desc: GPUBufferDescriptor): GPUBuffer {
		const buf = this.mWGCtx.device.createBuffer(desc);
		return buf;
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
	/*
	createUniformsBufferInit(params: { sizes: number[]; usage: number }, mappedAtCreation = false): GPUBuffer | null {
		if (params && params.sizes.length > 0) {
			let total = params.sizes.length;
			let size = params.sizes[0];
			let bufSize = size;
			let segs: { index: number; size: number }[] = new Array(total);
			segs[0] = { index: 0, size: size };

			for (let i = 1; i < total; ++i) {
				size = size <= 256 ? size : size % 256;
				size = size > 0 ? 256 - size : 0;

				bufSize += size;
				size = params.sizes[i];
				segs[i] = { index: bufSize, size: size };
				bufSize += size;
			}
			const desc = {
				size: bufSize,
				usage: params.usage
			};
			const buf = this.mWGCtx.device.createBuffer(desc);
			buf.segs = segs;
			console.log("createUniformsBuffer(), segs: ", segs);
			console.log("createUniformsBuffer(), bufSize: ", bufSize, ", usage: ", params.usage);
			return buf;
		}
		return null;
	}
	//*/
	createUniformsBuffer(
		params: { sizes: number[]; usage: number },
		initSize = 0,
		force256: boolean = true,
		mappedAtCreation = false
	): GPUBuffer | null {
		if (params && params.sizes.length > 0) {
			let total = params.sizes.length;
			let size = initSize;
			let bufSize = size;
			let segs: { index: number; size: number }[] = new Array(total);
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
				usage: params.usage
			};
			const buf = this.mWGCtx.device.createBuffer(desc);
			buf.segs = segs;
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
		this.mWGCtx.device.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
	}
	uniformBindGroupDescUpdate(
		desc: GPUBindGroupDescriptor,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		index = 0
	): void {
		let ei = 0;
		let es = desc.entries;
		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					const res = es[i].resource as GPUBindGroupDescriptorEntityResource;
					if (res.offset !== undefined) {
						// the minimum BufferBindingType::ReadOnlyStorage alignment (256)
						res.offset = res.shared ? 0 : index * 256;
					}
					ei++;
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
	createUniformBindGroupDesc(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex = 0
	): GPUBindGroupDescriptor {
		const device = this.mWGCtx.device;

		if (!this.mBGLayouts[groupIndex]) {
			this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
		}
		let desc = {
			layout: this.mBGLayouts[groupIndex],
			entries: []
		} as GPUBindGroupDescriptor;

		let bindI = 0;
		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					// console.log("ooooooooo bindI: ", bindI, ", i: ", i);
					// console.log("		dp.shared: ", dp.shared, dp.bufferSize);
					// console.log("		", dp.buffer);
					const ed = {
						binding: bindIndex + bindI++,
						resource: {
							offset: dp.shared ? 0 : 256 * dp.index, // 实际应用中的计算不在这里
							buffer: dp.buffer,
							size: dp.bufferSize,
							shared: dp.shared,
							usageType: dp.usageType
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
	createUniformBindGroupWithDesc(desc: GPUBindGroupDescriptor): GPUBindGroup {
		const device = this.mWGCtx.device;
		if (desc.entries.length < 1) {
			throw Error("Illegal operation !!!");
		}
		return device.createBindGroup(desc);
	}
	createUniformBindGroup(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex = 0
	): GPUBindGroup {
		const device = this.mWGCtx.device;

		if (!this.mBGLayouts[groupIndex]) {
			this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
		}
		let desc = {
			layout: this.mBGLayouts[groupIndex],
			entries: []
		} as GPUBindGroupDescriptor;

		if (dataParams) {
			const dps = dataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				if (dp.buffer && dp.bufferSize > 0) {
					const ed = {
						binding: bindIndex++,
						resource: {
							offset: 256 * dp.index,
							buffer: dp.buffer,
							size: dp.bufferSize,
							shared: dp.shared,
							usageType: dp.usageType
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
						binding: bindIndex++,
						resource: t.sampler ? t.sampler : sampler
					};
					const et = {
						binding: bindIndex++,
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
		return device.createBindGroup(desc);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, descParams: VtxDescParam[]): GPURenderPipeline {
		const ctx = this.mWGCtx;
		if (descParams) {
			let location = 0;
			for (let k = 0; k < descParams.length; ++k) {
				const vtx = descParams[k].vertex;
				pipelineParams.addVertexBufferLayout({ arrayStride: vtx.arrayStride, attributes: [], stepMode: "vertex" });
				const params = vtx.params;
				for (let i = 0; i < params.length; ++i) {
					const p = params[i];
					pipelineParams.addVertexBufferAttribute(
						{
							shaderLocation: location++,
							offset: p.offset,
							format: p.format
						},
						k
					);
				}
				if (pipelineParams.buildDeferred) {
					this.mPipelineParams = pipelineParams;
				} else {
					this.mShader.build(pipelineParams);
				}
			}
		}
		console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);
		if (!this.mPipelineParams) {
			this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
		}
		return this.pipeline;
	}

	createRenderPipelineWithBuf(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): GPURenderPipeline {
		const vtx = vtxDesc.vertex;
		const vtxDescParams = this.createRenderPipelineVtxParams(vtx.buffers, vtx.attributeIndicesArray);
		console.log("vtxDescParams: ", vtxDescParams);
		return this.createRenderPipeline(pipelineParams, vtxDescParams);
	}
	createRenderPipelineVtxParam(vtxBuf: GPUBuffer, attributeIndices: number[]): VtxDescParam {
		const p: VtxDescParam = {
			vertex: {
				arrayStride: vtxBuf.arrayStride,
				params: []
			}
		};
		const params = p.vertex.params;
		const ls = attributeIndices;
		for (let i = 0; i < attributeIndices.length; ++i) {
			params.push({ offset: vtxBuf.vectorOffsets[ls[i]], format: vtxBuf.vectorFormats[ls[i]] });
		}
		return p;
	}
	createRenderPipelineVtxParams(vtxBufs: GPUBuffer[], attributeIndicesArray: number[][]): VtxDescParam[] {
		const ls: VtxDescParam[] = new Array(attributeIndicesArray.length);
		for (let i = 0; i < attributeIndicesArray.length; ++i) {
			ls[i] = this.createRenderPipelineVtxParam(vtxBufs[i], attributeIndicesArray[i]);
		}
		return ls;
	}
}
export { VtxPipelinDescParam, BufDataParamType, WGRUniformParam, WGRPipelineContext };

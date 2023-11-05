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
/**
 * one type shading shader, one WGRPipelineContext instance
 */
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
	comppipeline: GPUComputePipeline;

	queue: GPUQueue;

	shadinguuid = "";
	name = "PipelineContext";
	readonly uniformCtx = new WGRUniformContext(false);

	constructor(wgCtx?: WebGPUContext) {
		// console.log("XXX XXX create a WGRPipelineContext instance.");
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
				console.log("WGRPipelineContext::init(), param:\n", p);

				let bindGLayout: GPUBindGroupLayout;
				if (!this.uniformCtx.isLayoutAuto()) {
					bindGLayout = this.uniformCtx.getBindGroupLayout(p.multisampleEnabled);
					let pipeGLayout = ctx.device.createPipelineLayout({
						label: p.label,
						bindGroupLayouts: [bindGLayout]
					});
					console.log("CCCCCCCCCC 01 bindGLayout: ", bindGLayout);
					console.log("CCCCCCCCCC 02 pipeGLayout: ", pipeGLayout);
					p.layout = pipeGLayout;
					console.log("CCCCCCCCCC 03 pipeline use spec layout !!!");
				}
				if (p.compShaderSrc) {
					this.comppipeline = ctx.device.createComputePipeline({
						label: this.shadinguuid + "-comp-pl-" + this.mUid,
						layout: bindGLayout,
						compute: p.compute
					});
				} else {
					p.label = this.shadinguuid + "-pl-" + this.mUid;
					this.pipeline = ctx.device.createRenderPipeline(p);
				}
			}
		}
	}
	destroy(): void { }
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
			this.queue = wgCtx.queue;
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
			const buf = this.mWGCtx.device.createBuffer(desc);
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
						res.buffer = dp.buffer;
						res.size = dp.bufferSize;
						// console.log(">>>>>>>>> res.shared: ", res.shared, ", offset: ", res.offset, ", index: ", index, ", size:",dp.buffer.size);
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
			this.mBGLayouts[groupIndex] = this.pipeline.getBindGroupLayout(groupIndex);
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
	createBindGroupWithDesc(desc: GPUBindGroupDescriptor): GPUBindGroup {
		const device = this.mWGCtx.device;
		if (desc.entries.length < 1) {
			throw Error("Illegal operation !!!");
		}
		console.log("createBindGroupWithDesc(), desc: ", desc);
		return device.createBindGroup(desc);
	}
	createBindGroup(
		groupIndex: number,
		dataParams?: BindGroupDataParamType[],
		texParams?: { texView?: GPUTextureView; sampler?: GPUSampler }[],
		bindIndex = 0,
		layout?: GPUBindGroupLayout
	): GPUBindGroup {

		const device = this.mWGCtx.device;
		const desc = this.createBindGroupDesc(groupIndex, dataParams, texParams, bindIndex, layout);
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
		if(vtxDesc) {
			const vtx = vtxDesc.vertex;
			const vtxDescParams = vtx ? this.createRenderPipelineVtxParams(vtx.buffers, vtx.attributeIndicesArray): [{}] as VtxDescParam[];
			// console.log("vtxDescParams: ", vtxDescParams);
			return this.createRenderPipeline(pipelineParams, vtxDescParams);
		}else {
			return this.createRenderPipeline(pipelineParams, [{}] as VtxDescParam[]);
		}
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

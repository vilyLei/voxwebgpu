import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { GPURenderPipelineEmpty } from "../../gpu/GPURenderPipelineEmpty";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { BufDataParamType, VtxDescParam, VtxPipelinDescParam, IWGRPipelineContext } from "./IWGRPipelineContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRPipelineShader } from "./WGRPipelineShader";
import { WGRUniformParam, WGRUniformContext } from "../uniform/WGRUniformContext";
import { GPUQueue } from "../../gpu/GPUQueue";
import { IWGRendererPass } from "./IWGRendererPass";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { GPUPipelineLayout } from "../../gpu/GPUPipelineLayout";
import { WGRBindGroupContext } from "./WGRBindGroupContext";
/**
 * one type shading shader, one WGRPipelineContext instance
 */
class WGRPipelineContext implements IWGRPipelineContext {
	private static sUid = 0;
	private mUid = WGRPipelineContext.sUid++;

	private mInit = true;
	private mWGCtx: WebGPUContext;
	private mPipelineParams: WGRPipelineCtxParams;
	private mShader = new WGRPipelineShader();

	bindGroupCtx = new WGRBindGroupContext();
	type = "render";
	rpass: IWGRendererPass;
	pipeline?: GPURenderPipeline = new GPURenderPipelineEmpty();
	comppipeline?: GPUComputePipeline;

	queue: GPUQueue;

	shadinguuid = "";
	name = "PipelineContext";
	readonly uniformCtx = new WGRUniformContext(false);

	constructor(wgCtx?: WebGPUContext) {
		console.log("WGRPipelineContext::constructor() ...");
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
				// console.log("WGRPipelineContext::init(), param:\n", p);

				let pipeGLayout: GPUPipelineLayout;
				if (!this.uniformCtx.isLayoutAuto()) {
					const bindGLayout = this.uniformCtx.getBindGroupLayout(p.multisampleEnabled);
					const bindGroupLayouts = bindGLayout ? [bindGLayout] : [];
					pipeGLayout = ctx.device.createPipelineLayout({
						label: p.label,
						bindGroupLayouts
					});
					// console.log("CCCCCCCCCC 01 bindGLayout: ", bindGLayout);
					// console.log("CCCCCCCCCC 02 pipeGLayout: ", pipeGLayout);
					// console.log("CCCCCCCCCC 03 pipeline use spec layout !!!");
				}else {
					pipeGLayout = ctx.device.createPipelineLayout({
						label: p.label,
						bindGroupLayouts: []
					});
				}
				this.bindGroupCtx.rpass = this.rpass;
				if (p.compShaderSrc) {
					const desc = {
						label: this.shadinguuid + "-comp-pl-" + this.mUid,
						layout: pipeGLayout,
						compute: p.compute
					};
					// console.log("GPUShaderStage.COMPUTE: ", GPUShaderStage.COMPUTE);
					console.log("WGRPipelineContext::init(), create compute pieline desc: ", desc);
					this.comppipeline = ctx.device.createComputePipeline( desc );
					this.type = "compute";
					this.bindGroupCtx.comppipeline = this.comppipeline;
				} else {
					p.layout = pipeGLayout;
					p.label = this.shadinguuid + "-pl-" + this.mUid;
					console.log("WGRPipelineContext::init(), create rendering pieline desc: ", p);
					this.pipeline = ctx.device.createRenderPipeline(p);
					this.bindGroupCtx.pipeline = this.pipeline;
				}
			}
		}
	}
	destroy(): void {
		if(this.mWGCtx) {
			this.mWGCtx = null;
		}
	}
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
			this.bindGroupCtx.initialize(wgCtx);
			this.uniformCtx.initialize(this.bindGroupCtx);
			this.mShader.initialize(wgCtx);
		}
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, descParams: VtxDescParam[]): GPURenderPipeline {
		const ctx = this.mWGCtx;
		if (descParams) {
			if(!pipelineParams.compShaderSrc) {
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
				}
			}
		}
		if (pipelineParams.buildDeferred) {
			this.mPipelineParams = pipelineParams;
		} else {
			this.mShader.build(pipelineParams);
		}
		// console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);
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

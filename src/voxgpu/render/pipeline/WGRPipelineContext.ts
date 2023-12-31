import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPURenderPipeline } from "../../gpu/GPURenderPipeline";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { BufDataParamType, VtxDescParam, VtxPipelinDescParam, WGRPipelineContextImpl } from "./WGRPipelineContextImpl";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRPipelineShader } from "./WGRPipelineShader";
import { WGRUniformParam, WGRUniformContext } from "../uniform/WGRUniformContext";
import { GPUQueue } from "../../gpu/GPUQueue";
import { WGRendererPassImpl } from "./WGRendererPassImpl";
import { GPUComputePipeline } from "../../gpu/GPUComputePipeline";
import { GPUPipelineLayout } from "../../gpu/GPUPipelineLayout";
import { WGRBindGroupContext } from "./WGRBindGroupContext";
import { WGRDrawMode } from "../Define";
/**
 * one type shading shader, one WGRPipelineContext instance
 */
class WGRPipelineContext implements WGRPipelineContextImpl {
	private static sUid = 0;
	private mUid = WGRPipelineContext.sUid++;

	private mInit = true;
	private mWGCtx: WebGPUContext;
	private mPipelineParams: WGRPipelineCtxParams;
	private mShader = new WGRPipelineShader();
	private mPipelineAsync = false;
	bindGroupCtx = new WGRBindGroupContext();
	type = "render";
	rpass: WGRendererPassImpl;
	pipeline?: GPURenderPipeline;
	comppipeline?: GPUComputePipeline;

	queue: GPUQueue;

	shadinguuid = "";
	name = "PipelineContext";
	readonly uniformCtx = new WGRUniformContext(false);

	constructor(wgCtx?: WebGPUContext, pipelineAsync = false) {
		console.log("WGRPipelineContext::constructor() ..., uid: ", this.mUid);
		this.mPipelineAsync = pipelineAsync;
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
				this.mShader.build(p, this.rpass);
				// console.log("WGRPipelineContext::init(), p.multisampled:\n", p.multisampled);

				let pipeGLayout: GPUPipelineLayout;
				if (!this.uniformCtx.isLayoutAuto()) {
					const bindGLayout = this.uniformCtx.getBindGroupLayout(p.multisampled);
					const bindGroupLayouts = bindGLayout ? [bindGLayout] : [];
					pipeGLayout = ctx.device.createPipelineLayout({
						label: p.label,
						bindGroupLayouts
					});
					// console.log("CCCCCCCCCC 01 bindGLayout: ", bindGLayout);
					// console.log("CCCCCCCCCC 02 pipeGLayout: ", pipeGLayout);
					// console.log("CCCCCCCCCC 03 pipeline use spec layout !!!");
				} else {
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

					this.type = "compute";
					if (this.mPipelineAsync) {
						ctx.device.createComputePipelineAsync(desc).then(resolve => {
							this.comppipeline = resolve;
							this.bindGroupCtx.comppipeline = this.comppipeline;
						});
					} else {
						this.comppipeline = ctx.device.createComputePipeline(desc);
						this.bindGroupCtx.comppipeline = this.comppipeline;
					}
				} else {
					p.layout = pipeGLayout;
					p.label = this.shadinguuid + "-pl-" + this.mUid;
					console.log("WGRPipelineContext::init(), create rendering pieline desc: ", p);
					if (this.mPipelineAsync) {
						ctx.device.createRenderPipelineAsync(p).then(resolve => {
							this.pipeline = resolve;
							this.bindGroupCtx.pipeline = this.pipeline;
						});
					} else {
						this.pipeline = ctx.device.createRenderPipeline(p);
						this.bindGroupCtx.pipeline = this.pipeline;
					}
				}
			}
		}
	}
	isEnabled(): boolean {
		return this.pipeline !== undefined || this.pipeline !== undefined;
	}
	destroy(): void {
		if (this.mWGCtx) {
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
	createRenderingPipeline(pipelineParams: WGRPipelineCtxParams, descParams: VtxDescParam[], vtxDesc?: VtxPipelinDescParam): GPURenderPipeline {
		const ctx = this.mWGCtx;
		if (descParams) {
			// if(!pipelineParams.compShaderSrc) {
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
			if (vtxDesc) {
				const primitive = pipelineParams.primitive;
				if (primitive && vtxDesc.vertex) {
					// console.log("vtxDesc.vertex.drawMode: ", vtxDesc.vertex.drawMode);
					switch (vtxDesc.vertex.drawMode) {
						case WGRDrawMode.LINES:
							primitive.topology = "line-list";
							break;
						default:
							break;
					}
				}
			}
			// }
		}
		return this.createRenderPipeline(pipelineParams);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams): GPURenderPipeline {
		const ctx = this.mWGCtx;
		if (pipelineParams.buildDeferred) {
			this.mPipelineParams = pipelineParams;
		} else {
			this.mShader.build(pipelineParams, this.rpass);
		}
		// console.log("createRenderPipeline(), pipelineParams:\n", pipelineParams);
		if (!this.mPipelineParams) {
			this.pipeline = ctx.device.createRenderPipeline(pipelineParams);
		}
		return this.pipeline;
	}
	createRenderPipelineWithBuf(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): GPURenderPipeline {
		if (pipelineParams.compShaderSrc) {
			return this.createRenderPipeline(pipelineParams);
		} else {
			if (vtxDesc) {
				const vtx = vtxDesc.vertex;

				const vtxDescParams = vtx ? this.createRenderPipelineVtxParams(vtx.buffers, vtx.attributeIndicesArray) : ([{}] as VtxDescParam[]);
				// console.log("vtxDescParams: ", vtxDescParams);
				return this.createRenderingPipeline(pipelineParams, vtxDescParams, vtxDesc);
			} else {
				return this.createRenderingPipeline(pipelineParams, [{}] as VtxDescParam[]);
			}
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

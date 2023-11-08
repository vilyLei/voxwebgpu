import Color4 from "../../material/Color4";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassDescriptor } from "../../gpu/GPURenderPassDescriptor";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
import { GPUComputePassEncoder } from "../../gpu/GPUComputePassEncoder";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureDescriptor } from "../../gpu/GPUTextureDescriptor";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRPassParam, IWGRendererPass } from "./IWGRendererPass";
import { WGRPColorAttachment } from "./WGRPColorAttachment";
import { WGRPDepthStencilAttachment } from "./WGRPDepthStencilAttachment";

class WGRendererPass implements IWGRendererPass {
	private mWGCtx: WebGPUContext;
	private mParam: WGRPassParam;
	private mDepthTexture: GPUTexture;
	private mDrawing = true;

	name = "";

	colorView: GPUTextureView;
	passEncoder?: GPURenderPassEncoder;
	compPassEncoder?: GPUComputePassEncoder;
	commandEncoder: GPUCommandEncoder;
	clearColor = new Color4(0.0, 0.0, 0.0, 1.0);

	passColors = [new WGRPColorAttachment()];
	passDepthStencil: WGRPDepthStencilAttachment;

	prevPass: WGRendererPass;
	separate = false;
	enabled = true;
	constructor(wgCtx?: WebGPUContext, drawing = true) {
		console.log("WGRendererPass::constructor(), drawing: ", drawing);
		this.mDrawing = drawing;
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	isDrawing(): boolean {
		return this.mDrawing;
	}
	get depthTexture(): GPUTexture {
		return this.mDepthTexture;
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
	}
	getPassParams(): WGRPassParam {
		return this.mParam;
	}
	build(params: WGRPassParam): void {
		console.log("WGRendererPass::build() mDrawing: ", this.mDrawing, "params: ", params);
		if (this.mDrawing) {
			params.multisampleEnabled = params.sampleCount && params.sampleCount > 1;
			this.mParam = params;
			if (this.prevPass) {
				this.mDepthTexture = this.prevPass.mDepthTexture;
				this.colorView = this.prevPass.colorView;
			} else {
				this.createRenderPassTexture(params);
			}
		}
	}
	private createRenderPassTexture(param: WGRPassParam): void {
		const ctx = this.mWGCtx;
		let separate = this.separate;

		let sampleCount = 1;
		const multisampled = param.multisampleEnabled === true;
		if (multisampled) {
			sampleCount = param.sampleCount;
		}
		let size = [ctx.canvasWidth, ctx.canvasHeight];

		let pcs = this.passColors;
		let colorAtt = pcs[0];
		if (this.separate) {
			let ls = param.colorAttachments;
			if (ls && ls.length > 0) {
				for (let i = 1; i < ls.length; ++i) {
					pcs.push(new WGRPColorAttachment());
				}
				for (let i = 0; i < ls.length; ++i) {
					colorAtt = pcs[i].setParam(ls[i]);
				}
			} else {
				const texture = ctx.texture.createRTTTexture({
					size,
					sampleCount,
					format: ctx.presentationFormat,
					usage: GPUTextureUsage.RENDER_ATTACHMENT
				});
				this.colorView = texture.createView();
				colorAtt.view = this.colorView;
				colorAtt.viewTexture = texture;
			}
		} else {
			if (multisampled) {
				const texture = ctx.texture.createRTTTexture({
					size,
					sampleCount,
					format: ctx.presentationFormat,
					usage: GPUTextureUsage.RENDER_ATTACHMENT
				});
				this.colorView = texture.createView();
				colorAtt.view = this.colorView;
				colorAtt.viewTexture = texture;
			}
		}

		if (!(param.depthTestEnabled === false) || param.depthStencilAttachment) {
			let dsp = param.depthStencilAttachment;
			let dsAtt = this.passDepthStencil;
			if (!dsAtt) dsAtt = new WGRPDepthStencilAttachment().setParam(dsp);
			this.passDepthStencil = dsAtt;

			if (!dsAtt.view && !separate) {
				size = [ctx.canvasWidth, ctx.canvasHeight];
				let format = "depth24plus";
				if (param.depthFormat !== undefined) format = param.depthFormat;
				const depthTexDesc = {
					size,
					sampleCount,
					format,
					usage: GPUTextureUsage.RENDER_ATTACHMENT
				} as GPUTextureDescriptor;

				const depthTexture = ctx.texture.createRTTTexture(depthTexDesc);
				this.mDepthTexture = depthTexture;
				dsAtt.view = depthTexture.createView();
				dsAtt.viewTexture = depthTexture;
			}
		}

		// console.log(this);
		// console.log("depthTexDesc: ", depthTexDesc, ", depthTexture: ", depthTexture);
	}
	runBegin(): void {
		const ctx = this.mWGCtx;
		if (this.enabled && ctx.enabled) {
			const device = ctx.device;
			const param = this.mParam;

			this.commandEncoder = device.createCommandEncoder();
			const cmdEncoder = this.commandEncoder;
			if (this.mDrawing) {
				let pcs = this.passColors;

				const colorT = pcs[0];

				let dsAtt = this.passDepthStencil;

				const prev = this.prevPass;
				if (prev) {
					const prevColorAtt = prev.passColors[0];
					const prevDSAtt = prev.passDepthStencil;

					colorT.loadOp = "load";

					if (param.multisampleEnabled) {
						colorT.view = prevColorAtt.view;
						colorT.resolveTarget = prevColorAtt.resolveTarget;
					} else {
						colorT.view = prevColorAtt.view;
					}
					if (prevDSAtt) {
						if (!dsAtt) {
							dsAtt = new WGRPDepthStencilAttachment();
							dsAtt.depthLoadOp = "load";
							this.passDepthStencil = dsAtt;
						}
						dsAtt = this.passDepthStencil;
						dsAtt.view = prevDSAtt.view;
					}
				} else {
					if (this.separate) {
					} else {
						if (pcs.length == 1) {
							pcs[0].clearValue.copyFrom(this.clearColor);
						}
						if (param.multisampleEnabled) {
							colorT.resolveTarget = colorT.resolveTargetTexture ? colorT.resolveTarget : ctx.createCurrentView();
						} else {
							colorT.view = colorT.viewTexture ? colorT.view : ctx.createCurrentView();
						}
					}
				}

				let colorAttachments = this.passColors;
				let renderPassDescriptor: GPURenderPassDescriptor;
				if (dsAtt) {
					renderPassDescriptor = {
						colorAttachments: colorAttachments,
						depthStencilAttachment: dsAtt
					};
				} else {
					renderPassDescriptor = {
						colorAttachments: colorAttachments
					};
				}

				this.passEncoder = cmdEncoder.beginRenderPass(renderPassDescriptor);
			} else {
				this.compPassEncoder = cmdEncoder.beginComputePass();
			}
		}
	}
	runEnd(): GPUCommandBuffer {
		const ctx = this.mWGCtx;
		if (this.enabled && ctx.enabled) {
			if (this.mDrawing) {
				this.passEncoder.end();
			} else {
				this.compPassEncoder.end();
			}
			return this.commandEncoder.finish();
		}
		return null;
	}
}
export { IWGRendererPass, WGRPassParam, WGRendererPass };

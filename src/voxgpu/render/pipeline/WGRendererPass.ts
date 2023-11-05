import Color4 from "../../material/Color4";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import { GPURenderPassDescriptor } from "../../gpu/GPURenderPassDescriptor";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
import { GPUComputePassEncoder } from "../../gpu/GPUComputePassEncoder";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureDescriptor } from "../../gpu/GPUTextureDescriptor";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRPassParams, IWGRendererPass } from "./IWGRendererPass";
import { GPURenderPassDepthStencilAttachment } from "../../gpu/GPURenderPassDepthStencilAttachment";

class WGRendererPass implements IWGRendererPass {

	private mWGCtx: WebGPUContext;
	private mParams: WGRPassParams;
	private mDepthTexture: GPUTexture;
	private mDrawing = true;

	name = "";

	colorView: GPUTextureView;
	passEncoder?: GPURenderPassEncoder;
	compPassEncoder?: GPUComputePassEncoder;
	commandEncoder: GPUCommandEncoder;
	clearColor = new Color4(0.0, 0.0, 0.0, 1.0);

	resolveTarget: GPUTextureView;
	resolveView: GPUTextureView;

	colorAttachment: GPURenderPassColorAttachment = {
		clearValue: null,
		loadOp: "clear",
		storeOp: "store"
	};
	depStcAttachment: GPURenderPassDepthStencilAttachment = {
		view: null,
		depthClearValue: 1.0,
		depthLoadOp: "clear",
		depthStoreOp: "store"
	};
	prevPass: WGRendererPass;

	enabled = true;
	constructor(wgCtx?: WebGPUContext, drawing = true) {
		console.log("WGRendererPass::constructor(), drawing: ", drawing);
		this.mDrawing = drawing;
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	get depthTexture(): GPUTexture {
		return this.mDepthTexture;
	}
	initialize(wgCtx: WebGPUContext): void {
		this.mWGCtx = wgCtx;
	}
	getPassParams(): WGRPassParams {
		return this.mParams;
	}
	build(params: WGRPassParams): void {

		if (this.mDrawing) {
			params.multisampleEnabled = params.sampleCount && params.sampleCount > 1;
			this.mParams = params;
			if (this.prevPass) {
				this.mDepthTexture = this.prevPass.mDepthTexture;
				this.colorView = this.prevPass.colorView;
			} else {
				this.createRenderPassTexture(params);
			}
		}
	}
	private createRenderPassTexture(params: WGRPassParams): void {
		const ctx = this.mWGCtx;
		const device = ctx.device;
		const canvas = ctx.canvas;

		if (params && params.multisampleEnabled) {
			const texture = device.createTexture({
				size: [ctx.canvas.width, ctx.canvas.height],
				sampleCount: params.sampleCount,
				format: ctx.presentationFormat,
				usage: GPUTextureUsage.RENDER_ATTACHMENT
			});
			this.colorView = texture.createView();
		}

		const depthTexDesc = {
			size: [canvas.width, canvas.height],
			format: "depth24plus",
			usage: GPUTextureUsage.RENDER_ATTACHMENT
		} as GPUTextureDescriptor;
		if (params) {
			if (params.multisampleEnabled) depthTexDesc.sampleCount = params.sampleCount;
			if (params.depthFormat) depthTexDesc.format = params.depthFormat;
		}

		const depthTexture = device.createTexture(depthTexDesc);
		this.mDepthTexture = depthTexture;
		// console.log(this);
		// console.log("depthTexDesc: ", depthTexDesc, ", depthTexture: ", depthTexture);
	}
	runBegin(): void {
		const ctx = this.mWGCtx;
		if (this.enabled && ctx.enabled) {
			const device = ctx.device;
			const param = this.mParams;

			this.commandEncoder = device.createCommandEncoder();
			const cmdEncoder = this.commandEncoder;
			if (this.mDrawing) {
				const colorAtt = this.colorAttachment;
				colorAtt.clearValue = this.clearColor;
				const prev = this.prevPass;
				if (prev) {
					if (param.multisampleEnabled) {
						colorAtt.view = prev.colorView;
						colorAtt.resolveTarget = prev.colorAttachment.resolveTarget;
					} else {
						colorAtt.view = prev.colorAttachment.view;
					}
				} else {
					if (param.multisampleEnabled) {
						colorAtt.view = this.colorView;
						colorAtt.resolveTarget = this.resolveTarget ? this.resolveTarget : ctx.createCurrentView();
					} else {
						colorAtt.view = this.resolveView ? this.resolveView : ctx.createCurrentView();
					}
				}

				const depStcAtt = this.depStcAttachment;
				if (prev) {
					depStcAtt.view = prev.depStcAttachment.view;
				} else {
					depStcAtt.view = this.mDepthTexture.createView();
				}

				let colorAttachments: GPURenderPassColorAttachment[] = [colorAtt];
				const renderPassDescriptor: GPURenderPassDescriptor = {
					colorAttachments: colorAttachments,
					depthStencilAttachment: depStcAtt
				};

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
export { IWGRendererPass, WGRPassParams, WGRendererPass };

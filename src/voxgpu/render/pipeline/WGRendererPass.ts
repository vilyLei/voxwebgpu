import Color4 from "../../material/Color4";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import { GPURenderPassDescriptor } from "../../gpu/GPURenderPassDescriptor";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
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

	colorView: GPUTextureView;
	passEncoder: GPURenderPassEncoder;
	commandEncoder: GPUCommandEncoder;
	clearColor = new Color4(0.0, 0.0, 0.0, 1.0);

	rpassColorAttachment: GPURenderPassColorAttachment = {
		clearValue: null,
		loadOp: "clear",
		storeOp: "store"
	};
	depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
		view: null,
		depthClearValue: 1.0,
		depthLoadOp: "clear",
		depthStoreOp: "store"
	};

	constructor(wgCtx?: WebGPUContext) {
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
		params.multisampleEnabled = params.sampleCount && params.sampleCount > 1;

		this.mParams = params;
		this.createRenderPassTexture(params);
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
		console.log(this);
		console.log("depthTexDesc: ", depthTexDesc, ", depthTexture: ", depthTexture);
	}
	runBegin(): void {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			const device = ctx.device;
			const param = this.mParams;

			this.commandEncoder = device.createCommandEncoder();
			const cmdEncoder = this.commandEncoder;

			const colorAtt = this.rpassColorAttachment;
			colorAtt.clearValue = this.clearColor;

			if (param.multisampleEnabled) {
				colorAtt.view = this.colorView;
				colorAtt.resolveTarget = ctx.createCurrentView();
			} else {
				colorAtt.view = ctx.createCurrentView();
			}

			const depStcAtt = this.depthStencilAttachment;
			depStcAtt.view = this.mDepthTexture.createView();

			let colorAttachments: GPURenderPassColorAttachment[] = [colorAtt];
			const renderPassDescriptor: GPURenderPassDescriptor = {
				colorAttachments: colorAttachments,
				depthStencilAttachment: depStcAtt
			};

			this.passEncoder = cmdEncoder.beginRenderPass(renderPassDescriptor);
		}
	}
	runEnd(): GPUCommandBuffer {
		const ctx = this.mWGCtx;
		if (ctx.enabled) {
			this.passEncoder.end();
			return this.commandEncoder.finish();
		}
		return null;
	}
}
export { IWGRendererPass, WGRPassParams, WGRendererPass };

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
import { texDescriptorFilter } from "../../texture/WGTextureDataDescriptor";
import { WGRPassColorAttachment } from "./WGRPassColorAttachment";

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
	clearColor: Color4;

	passColors = [new WGRPColorAttachment()];
	passDepthStencil: WGRPDepthStencilAttachment;

	prevPass: WGRendererPass;
	separate = false;
	enabled = true;
	constructor(wgCtx?: WebGPUContext, drawing = true) {
		// console.log("WGRendererPass::constructor(), drawing: ", drawing);
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
	private mColorAttachments: WGRPassColorAttachment[];
	private updateColorAttachmentView(colorAtt: WGRPColorAttachment, t: WGRPassColorAttachment): void {
		if (!colorAtt.view) {
			colorAtt.setParam(t);
			if (!colorAtt.view) {
				let td = texDescriptorFilter(t.texture);
				if (td) {
					const rttData = td.rttTexture;
					if(rttData) {
						const ctx = this.mWGCtx;
						if (rttData.texture === undefined) {
							const rtt = ctx.texture.createColorRTTTexture();
							rttData.texture = rtt;
							rttData.textureView = rtt.createView();							
							colorAtt.view = rttData.textureView;
							// console.log("动态创建一个 color rtt gpu texture instance.");
						}
						colorAtt.view = rttData.textureView;
					}
				}
			}
		}
	}
	private createRenderPassTexture(param: WGRPassParam): void {
		const ctx = this.mWGCtx;
		let separate = this.separate;

		let sampleCount = 1;
		const multisampled = param.multisampleEnabled === true;
		param.multisampleEnabled = multisampled;
		if (multisampled) {
			sampleCount = param.sampleCount;
		}
		let size = [ctx.canvasWidth, ctx.canvasHeight];

		let pcs = this.passColors;
		let colorAtt = pcs[0];
		// console.log("createRenderPassTexture(), this.separate: ", this.separate);
		// console.log("createRenderPassTexture(), sampleCount: ", sampleCount, ", multisampled: ", multisampled);
		if (separate) {
			let ls = param.colorAttachments;
			this.mColorAttachments = ls;
			if (ls && ls.length > 0) {
				for (let i = 1; i < ls.length; ++i) {
					pcs.push(new WGRPColorAttachment());
				}
				for (let i = 0; i < ls.length; ++i) {
					
					// this.updateColorAttachmentView(colorAtt, ls[i]);
				}
				this.clearColor.setColor(pcs[0].clearValue);
				// console.log("xxx xxx pcs: ", pcs);
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

			if (!dsAtt.view) {
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
		const prev = this.prevPass;
		if (prev) {
			this.enabled = this.enabled && prev.enabled;
		}

		if (this.enabled && ctx.enabled) {
			const device = ctx.device;
			const param = this.mParam;

			this.commandEncoder = device.createCommandEncoder();
			const cmdEncoder = this.commandEncoder;
			if (this.mDrawing) {
				let pcs = this.passColors;

				const colorT = pcs[0];

				let dsAtt = this.passDepthStencil;
				const multisampleEnabled = param.multisampleEnabled;
				if (prev) {
					const prevColorAtt = prev.passColors[0];
					const prevDSAtt = prev.passDepthStencil;

					colorT.loadOp = "load";

					if (multisampleEnabled) {
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
					if (pcs.length == 1) {
						pcs[0].clearValue.copyFrom(this.clearColor);
					}
					if (this.separate) {
						// console.log("run a rpass, this.separate: ", this.separate,", multisampleEnabled: ", multisampleEnabled);
						const cts = this.mColorAttachments;
						if(cts !== undefined) {
							const p = colorT.param;
							const t = cts[0];
							if (!colorT.view || p != t || colorT.texture !== t.texture) {
								if(t.texture !== undefined) {
									colorT.view = null;
									this.updateColorAttachmentView( colorT, cts[0] );
									this.clearColor.setColor(colorT.clearValue);
								}
							}
						}
					} else {
						if (multisampleEnabled) {
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
	destroy(): void {
		this.mColorAttachments = null;
	}
}
export { IWGRendererPass, WGRPassParam, WGRendererPass };

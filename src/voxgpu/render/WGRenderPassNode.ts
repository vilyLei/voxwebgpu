import { WGRPassParam, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { IWGRenderPassNode } from "./IWGRenderPassNode";
import Color4 from "../material/Color4";
import Camera from "../view/Camera";
import { BlockParam, WGRenderUnitBlock } from "./WGRenderUnitBlock";
import { Entity3D } from "../entity/Entity3D";
import { WGRPColorAttachmentImpl } from "./pipeline/WGRPColorAttachmentImpl";
import { WGRPassViewport } from "./pipeline/WGRPassViewport";
class WGRenderPassNode implements IWGRenderPassNode {
	private static sUid = 0;
	private mUid = WGRenderPassNode.sUid++;
	private mWGCtx: WebGPUContext;
	private mRBParam: BlockParam;
	private mDrawing = true;
	private mPassBuilded = false;
	readonly clearColor = new Color4(0.0, 0.0, 0.0, 1.0);

	viewport = new WGRPassViewport();
	colorAttachments: WGRPColorAttachmentImpl[];
	camera: Camera;
	name = "";

	pipelineCtxs: WGRPipelineContext[] = [];
	rpass: WGRendererPass;
	pctxMap: Map<string, WGRPipelineContext> = new Map();
	rcommands: GPUCommandBuffer[];
	param?: WGRPassParam;

	enabled = true;
	prevNode: WGRenderPassNode;
	builder: IWGRPassNodeBuilder;

	unitBlock: WGRenderUnitBlock;
	mode = 0;
	separate = false;
	constructor(bp: BlockParam, drawing = true) {
		this.mRBParam = bp;
		this.camera = bp.camera;
		this.mDrawing = drawing;
		this.rpass = new WGRendererPass(null, drawing);
		this.rpass.clearColor = this.clearColor;
		this.rpass.viewport = this.viewport;
	}
	setColorAttachmentClearEnabledAt(enabled: boolean, index: number = 0): void {
		if (this.mPassBuilded) {
			const ca = this.rpass.passColors[index];
			if (ca) {
				ca.loadOp = enabled ? "clear" : "load";
			}
		}
	}
	isDrawing(): boolean {
		return this.mDrawing;
	}
	get uid(): number {
		return this.mUid;
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	destroy(): void {
		if (this.rpass) {
			this.mRBParam = null;
			this.prevNode = null;
		}
	}
	getPassNodeWithMaterial(material: WGMaterialDescripter): WGRenderPassNode {
		const b = this.builder;
		if (b) {
			return b.getPassNodeWithMaterial(material);
		}
		return this;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParam): void {
		this.param = param ? param : this.param;
		if (!this.param) this.param = {};

		if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
			this.mWGCtx = wgCtx;

			if (this.prevNode) {
				this.rpass.prevPass = this.prevNode.rpass;
			}
			let param = this.param;
			if (param.clearColor) {
				this.clearColor.setColor(param.clearColor);
			}
			console.log('WGRenderPassNode::initialize(), param: ', param);
			this.rpass.initialize(wgCtx);
			this.checkRPassParam(param);
			this.rpass.build(param);
			this.mPassBuilded = true;
			this.colorAttachments = this.rpass.passColors;
		}
	}

	hasMaterial(material: WGMaterialDescripter): boolean {
		if (this.unitBlock) {
			return this.unitBlock.hasMaterial(material);
		}
		return false;
	}
	setMaterial(material: WGMaterialDescripter): void {
		if (this.unitBlock) {
			this.unitBlock.setMaterial(material);
		}
	}
	addEntity(entity: Entity3D): void {
		if (entity) {
			if (!this.unitBlock) {
				this.unitBlock = WGRenderUnitBlock.createBlock();
			}
			const ub = this.unitBlock;
			ub.rbParam = this.mRBParam;
			ub.builder = this;
			console.log("WGRenderPassNode::addEntity(), ub.builder: ", ub.builder);
			this.unitBlock.addEntity(entity);
		}
	}
	private checkRPassParam(param: WGRPassParam): void {
		if (param.sampleCount !== undefined && param.sampleCount > 1) {
			param.multisampled = true;
		} else if (param.multisampled === true) {
			param.sampleCount = 4;
		} else {
			param.multisampled = false;
		}
		if (param.depthFormat == undefined) {
			param.depthFormat = "depth24plus";
		}
	}

	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext {
		const flag = material.shadinguuid && material.shadinguuid !== "";
		const map = this.pctxMap;
		if (flag) {
			if (map.has(material.shadinguuid)) {
				console.log("WGRenderPassBlock::createRenderPipelineCtxWithMaterial(), apply old ctx.");
				return map.get(material.shadinguuid);
			}
		}
		const ctx = this.createRenderPipelineCtx(material.shaderSrc, material.pipelineVtxParam, material.pipelineDefParam);
		if (flag) {
			ctx.shadinguuid = material.shadinguuid;
			map.set(material.shadinguuid, ctx);
		}
		console.log("WGRenderPassBlock::createRenderPipelineCtxWithMaterial(), apply new ctx.");
		return ctx;
	}
	// pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}
	createRenderPipelineCtx(
		shdSrc: WGRShderSrcType,
		pipelineVtxParam: VtxPipelinDescParam,
		pipelineParam?: WGRPipelineContextDefParam
	): WGRPipelineContext {

		const plp = pipelineParam;

		let depthStencilEnabled = plp ? (plp.depthStencilEnabled === false ? false : true) : true;
		const pipeParams = new WGRPipelineCtxParams({
			shaderSrc: shdSrc.shaderSrc,
			vertShaderSrc: shdSrc.vertShaderSrc,
			fragShaderSrc: shdSrc.fragShaderSrc,
			compShaderSrc: shdSrc.compShaderSrc,
			depthStencilEnabled
		});
		if (plp) {
			if (plp.blendModes) {
				pipeParams.setBlendModes(plp.blendModes);
			}
			if (plp.depthStencil) {
				pipeParams.setDepthStencil(plp.depthStencil);
			} else {
				pipeParams.setDepthWriteEnabled(plp.depthWriteEnabled === true, plp.depthCompare);
			}
			pipeParams.setPrimitiveState(plp.primitiveState ? plp.primitiveState : { cullMode: plp.faceCullMode });
		}

		return this.createRenderPipeline(pipeParams, pipelineVtxParam);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): WGRPipelineContext {
		const pipelineCtx = new WGRPipelineContext(this.mWGCtx);
		this.pipelineCtxs.push(pipelineCtx);

		if (this.mDrawing) {
			if (this.rpass.depthTexture) {
				pipelineParams.setDepthStencilFormat(this.rpass.depthTexture.format);
			} else {
				pipelineParams.depthStencilEnabled = false;
				pipelineParams.depthStencil = undefined;
			}

			const passParam = this.rpass.getPassParams();
			if (passParam.multisampled) {
				pipelineParams.multisampled = true;
				if (pipelineParams.multisample) {
					pipelineParams.multisample.count = passParam.sampleCount;
				} else {
					pipelineParams.multisample = {
						count: passParam.sampleCount
					};
				}
				pipelineParams.sampleCount = passParam.sampleCount;
			}
		}

		pipelineCtx.createRenderPipelineWithBuf(pipelineParams, vtxDesc);
		pipelineCtx.rpass = this.rpass;
		return pipelineCtx;
	}

	runBegin(): void {
		this.colorAttachments = this.rpass.passColors;
		this.rpass.enabled = this.enabled;
		this.rcommands = [];
		this.rpass.runBegin();
		if (this.enabled) {
			for (let i = 0; i < this.pipelineCtxs.length;) {
				this.pipelineCtxs[i++].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			for (let i = 0; i < this.pipelineCtxs.length;) {
				this.pipelineCtxs[i++].runEnd();
			}
		}
		let cmd = this.rpass.runEnd();
		if (cmd) {
			this.rcommands = [cmd];
		}
	}
	run(): void {
		if (this.enabled) {
			const b = this.unitBlock;
			if (b) {
				// console.log("node b: ", b);
				b.run();
			}
		}
	}
	render(): void {
		if (this.enabled) {
			this.runBegin();
			this.run();
			this.runEnd();
		}
	}
}
export { WGRenderPassNode };

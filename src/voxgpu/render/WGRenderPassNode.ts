import { WGRPassParam, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, findShaderEntryPoint, WGRShadeSrcParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { IWGRenderPassNodeRef } from "./IWGRenderPassNodeRef";
import Color4 from "../material/Color4";
import Camera from "../view/Camera";
import { BlockParam, WGRenderUnitBlock } from "./WGRenderUnitBlock";
import { IWGRUnit } from "./IWGRUnit";
import { Entity3D } from "../entity/Entity3D";
class WGRenderPassNode implements IWGRenderPassNodeRef {
	private static sUid = 0;
	private mUid = WGRenderPassNode.sUid++;
	private mWGCtx: WebGPUContext;
	private mRBParam: BlockParam;
	private mDrawing = true;

	camera: Camera;
	clearColor = new Color4(0.0, 0.0, 0.0, 1.0);

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

	separate = false;
	constructor(bp: BlockParam, drawing = true) {
		this.mRBParam = bp;
		this.camera = bp.camera;
		this.mDrawing = drawing;
		this.rpass = new WGRendererPass(null, drawing);
		this.rpass.clearColor = this.clearColor;
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
			this.rpass.initialize(wgCtx);
			this.checkRPassParam(this.param);
			this.rpass.build(this.param);
		}
	}

	private addEntityToBlock(entity: Entity3D): void {
		entity.update();
		const runit = this.mRBParam.roBuilder.createRUnit(entity, this);
		this.unitBlock.addRUnit(runit);
	}
	addEntity(entity: Entity3D): void {
		// console.log("WGRenderPassNode::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity && !entity.isInRenderer()) {
			if (!this.unitBlock) {
				this.unitBlock = WGRenderUnitBlock.createBlock();
			}
			entity.update();
			entity.rstate.__$inRenderer = true;

			let flag = true;
			if (this.mWGCtx && this.mWGCtx.enabled) {
				if (entity.isREnabled()) {
					flag = false;
					this.addEntityToBlock(entity);
				}
			}
			// console.log("WGRenderPassNode::addEntity(), flag: ", flag);
			if (flag) {
				this.mRBParam.entityMana.addEntity({ entity: entity, rever: entity.rstate.__$rever, dst: this });
			}
		}
	}
	addRUnit(unit: IWGRUnit): void {
		// /**
		//  * 正式加入渲染器之前，对shader等的分析已经做好了
		//  */
		// if (unit) {
		// 	this.mUnits.push(unit);
		// }
		// console.log("add an unit to a passNode.");
		this.unitBlock.addRUnit(unit);
	}

	private checkRPassParam(param: WGRPassParam): void {
		if (param.sampleCount !== undefined && param.sampleCount > 1) {
			param.multisampleEnabled = true;
		} else if (param.multisampleEnabled === true) {
			param.sampleCount = 4;
		} else {
			param.multisampleEnabled = false;
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
		const ctx = this.createRenderPipelineCtx(material.shaderCodeSrc, material.pipelineVtxParam, material.pipelineDefParam);
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
				pipeParams.setDepthWriteEnabled(plp.depthWriteEnabled === true);
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
			if (passParam.multisampleEnabled) {
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
		this.rpass.enabled = this.enabled;
		this.rcommands = [];
		this.rpass.runBegin();
		if (this.enabled) {
			for (let i = 0; i < this.pipelineCtxs.length; ) {
				this.pipelineCtxs[i++].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			for (let i = 0; i < this.pipelineCtxs.length; ) {
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
}
export { WGRenderPassNode };

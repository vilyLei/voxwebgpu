import { WGRPassParams, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import { IWGRenderPassNodeRef } from "./IWGRenderPassNodeRef";
class WGRenderPassNode implements IWGRenderPassNodeRef {

	private static sUid = 0;
	private mUid = WGRenderPassNode.sUid++;
	private mWGCtx: WebGPUContext;

	name = "";

	pipelineCtxs: WGRPipelineContext[] = [];
	rpass: WGRendererPass;
	pctxMap: Map<string, WGRPipelineContext> = new Map();
	rcommands: GPUCommandBuffer[];
	param?: WGRPassParams;

	enabled = true;
	prevNode: WGRenderPassNode;

	constructor(drawing = true) {
		this.rpass = new WGRendererPass(null, drawing);
	}
	destroy(): void {
		this.prevNode = null;
	}
	getUid(): number {
		return this.mUid;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		this.param = param ? param : this.param;
		if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
			this.mWGCtx = wgCtx;

			if (this.prevNode) {
				this.rpass.prevPass = this.prevNode.rpass;
			}
			this.rpass.initialize(wgCtx);
			this.rpass.build(this.param);
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
		const pipeParams = new WGRPipelineCtxParams({
			shaderSrc: shdSrc.shaderSrc,
			vertShaderSrc: shdSrc.vertShaderSrc,
			fragShaderSrc: shdSrc.fragShaderSrc,
			compShaderSrc: shdSrc.compShaderSrc,
			depthStencilEnabled: plp ? (plp.depthStencilEnabled === false ? false : true) : true
		});
		if (plp) {
			if (plp.blendModes) {
				pipeParams.setBlendModes(plp.blendModes);
			} else if (plp.blendMode === "transparent") {
				// for test
				pipeParams.setTransparentBlendParam(0);
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
		pipelineParams.setDepthStencilFormat(this.rpass.depthTexture.format);

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

		pipelineCtx.createRenderPipelineWithBuf(pipelineParams, vtxDesc);
		pipelineCtx.rpass = this.rpass;
		return pipelineCtx;
	}

	runBegin(): void {
		this.rpass.enabled = this.enabled;
		// if(this.name === 'newpassnode') {
		// 	console.log("XXX this.rpass.enabled: ", this.rpass.enabled, this.enabled);
		// }
		// console.log("this.rpass.enabled: ", this.rpass.enabled);
		this.rcommands = [];
		if (this.enabled) {
			this.rpass.runBegin();
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
			this.rcommands = [this.rpass.runEnd()];
		}
	}
}
export { WGRenderPassNode };

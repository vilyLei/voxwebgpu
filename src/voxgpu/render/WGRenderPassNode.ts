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
	pipelineCtxs: WGRPipelineContext[] = [];
	rpass = new WGRendererPass();
	pctxMap: Map<string, WGRPipelineContext> = new Map();
	rcommands: GPUCommandBuffer[];
	param?: WGRPassParams;

	enabled = true;
	getUid(): number {
		return this.mUid;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.rpass.initialize(wgCtx);
			this.rpass.build(param);
			this.param = param;
		}
	}

	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext {

		const flag = material.shadinguuid && material.shadinguuid !== "";
		const map = this.pctxMap;
		if(flag) {
			if(map.has(material.shadinguuid)) {
				console.log("WGRenderPassBlock::createRenderPipelineCtxWithMaterial(), apply old ctx.");
				return map.get(material.shadinguuid);
			}
		}
		const ctx = this.createRenderPipelineCtx(material.shaderCodeSrc, material.pipelineVtxParam, material.pipelineDefParam);
		if(flag) {
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
			vertShaderSrc: shdSrc.vertShaderSrc,
			fragShaderSrc: shdSrc.fragShaderSrc,
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
		return pipelineCtx;
	}

	runBegin(): void {
		this.rpass.enabled = this.enabled;
		this.rcommands = [];
		if (this.enabled) {
			this.rpass.runBegin();
			for (let i = 0; i < this.pipelineCtxs.length; ++i) {
				this.pipelineCtxs[i].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			for (let i = 0; i < this.pipelineCtxs.length; ++i) {
				this.pipelineCtxs[i].runEnd();
			}
			this.rcommands = [this.rpass.runEnd()];
		}
	}
}
export { WGRenderPassNode };
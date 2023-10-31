import { IWGRendererPass, WGRPassParams } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { IWGRUnit } from "./IWGRUnit";

import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import Camera from "../view/Camera";
import { WGRenderPassNode } from "./WGRenderPassNode";

class WGRenderPassBlock {
	private mWGCtx: WebGPUContext;

	private mPassNodes: WGRenderPassNode[] = [];

	private mUnits: IWGRUnit[] = [];
	camera: Camera;
	rcommands: GPUCommandBuffer[];

	enabled = true;

	constructor(wgCtx?: WebGPUContext, param?: WGRPassParams) {
		this.initialize(wgCtx, param);
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;

			const passNode = new WGRenderPassNode();
			passNode.initialize(wgCtx, param);
			this.mPassNodes.push(passNode);
		}
	}
	addRUnit(unit: IWGRUnit): void {
		/**
		 * 正式加入渲染器之前，对shader等的分析已经做好了
		 */
		if (unit) {
			this.mUnits.push(unit);
		}
	}
	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): { ctx: WGRPipelineContext; rpass: IWGRendererPass } {

		const node = this.mPassNodes[0];
		return { ctx: node.createRenderPipelineCtxWithMaterial(material), rpass: node.rpass };
	}
	// pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}
	createRenderPipelineCtx(
		shdSrc: WGRShderSrcType,
		pipelineVtxParam: VtxPipelinDescParam,
		pipelineParam?: WGRPipelineContextDefParam
	): WGRPipelineContext {
		const rpass = this.mPassNodes[0];
		return rpass.createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam): WGRPipelineContext {
		const rpass = this.mPassNodes[0];
		return rpass.createRenderPipeline(pipelineParams, vtxDesc);
	}

	runBegin(): void {
		this.rcommands = [];
		if (this.enabled) {
			const nodes = this.mPassNodes;
			for (let i = 0; i < nodes.length; ++i) {
				nodes[i].runBegin();
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {
			const nodes = this.mPassNodes;
			for (let i = 0; i < nodes.length; ++i) {
				nodes[i].runEnd();
				this.rcommands = this.rcommands.concat(nodes[i].rcommands);
			}
		}
	}
	run(): void {
		if (this.enabled) {
			const nodes = this.mPassNodes;
			const rc = nodes[0].rpass.passEncoder;
			const uts = this.mUnits;
			const utsLen = uts.length;
			for (let i = 0; i < utsLen; ++i) {
				const ru = uts[i];
				if (ru.enabled) {
					if (ru.passes) {
						const ls = ru.passes;
						// console.log("multi passes total", ls.length);
						for (let i = 0, ln = ls.length; i < ln; ++i) {
							ls[i].runBegin();
							ls[i].run();
						}
					} else {
						// console.log("single passes ...");
						ru.runBegin();
						ru.run();
					}
				}
			}
		}
	}
	destroy(): void {
		if (this.mWGCtx) {
			this.mWGCtx = null;
		}
	}
}
export { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock };

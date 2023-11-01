import { IWGRendererPass, WGRPassParams } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { IWGRUnit } from "./IWGRUnit";
import { IWGRPassRef } from "./pipeline/IWGRPassRef";

import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import Camera from "../view/Camera";
import { WGRUniformContext } from "./uniform/WGRUniformContext";
import { WGRenderPassNode } from "./WGRenderPassNode";

class WGRenderPassBlock {
	private mWGCtx: WebGPUContext;
	private mRendererUid = 0;

	private mPassNodes: WGRenderPassNode[] = [];
	private mUnits: IWGRUnit[] = [];

	camera: Camera;
	rcommands: GPUCommandBuffer[];

	enabled = true;
	// uniformCtx = new WGRUniformContext();

	constructor(rendererUid: number, wgCtx?: WebGPUContext, param?: WGRPassParams) {
		this.mRendererUid = rendererUid;
		this.initialize(wgCtx, param);
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParams): void {
		if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
			this.mWGCtx = wgCtx;
			for (let i = 0; i < this.mPassNodes.length; ++i) {
				this.mPassNodes[i].initialize(wgCtx);
			}
		}
		if (this.mPassNodes.length == 0 && param) {
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
	appendRendererPass(param?: WGRPassParams): IWGRPassRef {
		let node = this.mPassNodes[this.mPassNodes.length - 1];
		const passNode = new WGRenderPassNode();
		// passNode.uniformCtx = this.uniformCtx;
		passNode.prevNode = node;
		passNode.initialize(this.mWGCtx, param ? param : node.param);
		const rpass = passNode.rpass;
		rpass.colorAttachment.loadOp = "load";
		rpass.depStcAttachment.depthLoadOp = "load";
		this.mPassNodes.push(passNode);
		return { index: this.mPassNodes.length - 1, node: passNode };
	}
	private getPassNode(ref: IWGRPassRef): WGRenderPassNode {
		let node = this.mPassNodes[this.mPassNodes.length - 1];
		if (ref && ref.index !== undefined) {
			if (ref.index >= 0 && ref.index < this.mPassNodes.length) {
				node = this.mPassNodes[ref.index];
			}
		}
		return node;
	}
	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): { ctx: WGRPipelineContext, rpass: IWGRendererPass } {
		const node = this.getPassNode(material.rpass);
		return { ctx: node.createRenderPipelineCtxWithMaterial(material), rpass: node.rpass };
	}
	// pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}
	createRenderPipelineCtx(
		shdSrc: WGRShderSrcType,
		pipelineVtxParam: VtxPipelinDescParam,
		pipelineParam?: WGRPipelineContextDefParam,
		renderPassConfig?: IWGRPassRef
	): WGRPipelineContext {
		const node = this.getPassNode(renderPassConfig);
		return node.createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam, renderPassConfig?: IWGRPassRef): WGRPipelineContext {
		const node = this.getPassNode(renderPassConfig);
		return node.createRenderPipeline(pipelineParams, vtxDesc);
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
			// console.log("this.mPassNodes: ", this.mPassNodes);
			for (let i = 0; i < nodes.length; ++i) {
				nodes[i].runEnd();
				this.rcommands = this.rcommands.concat(nodes[i].rcommands);
			}
			// console.log("this.rcommands: ", this.rcommands);
		}
	}
	run(): void {
		if (this.enabled) {
			// console.log('>');
			const uts = this.mUnits;
			let utsLen = uts.length;
			for (let i = 0; i < utsLen; ) {
				const ru = uts[i];
				if (ru.__$rever == ru.st.__$rever) {
					if (ru.getRF()) {
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
					i++;
				} else {
					ru.destroy();
					uts.splice(i, 1);
					utsLen--;
					console.log("WGEntityNodeMana::update(), remove a rendering runit.");
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

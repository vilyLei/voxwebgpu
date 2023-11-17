import { WGRPassParam } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGRPassWrapperImpl } from "./pipeline/WGRPassWrapperImpl";
import { WGRPassWrapper } from "./pipeline/WGRPassWrapper";

import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import Camera from "../view/Camera";
import { WGRenderPassNode } from "./WGRenderPassNode";
import { BlockParam, WGRenderUnitBlock } from "./WGRenderUnitBlock";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { Entity3D } from "../entity/Entity3D";
import { WGRPassNodeGraph } from "./pass/WGRPassNodeGraph";

class WGRenderPassBlock implements IWGRPassNodeBuilder {
	private mWGCtx: WebGPUContext;
	private mRendererUid = 0;
	private mrPassParam: WGRPassParam;

	private mCompPassNodes: WGRenderPassNode[] = [];
	private mRPassNodes: WGRenderPassNode[] = [];
	private mRSeparatePassNodes: WGRenderPassNode[] = [];
	private mPassNodes: WGRenderPassNode[] = [];
	private mPNodeFlags: number[] = [];
	private mRBParam: BlockParam;

	camera: Camera;
	rcommands: GPUCommandBuffer[];
	unitBlock: WGRenderUnitBlock;

	prev: WGRenderPassBlock;

	enabled = true;

	constructor(rendererUid: number, bp: BlockParam, wgCtx?: WebGPUContext, param?: WGRPassParam) {
		this.mRendererUid = rendererUid;
		this.mRBParam = bp;
		this.camera = bp.camera;
		this.mrPassParam = param;
		this.initialize(wgCtx, param);
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	initialize(wgCtx: WebGPUContext, param?: WGRPassParam): void {
		this.mrPassParam = param ? param : this.mrPassParam;
		if (wgCtx) {
			param = this.mrPassParam;
			if (!this.mWGCtx && wgCtx && wgCtx.enabled) {
				this.mWGCtx = wgCtx;
				for (let i = 0; i < this.mPassNodes.length; ++i) {
					this.mPassNodes[i].initialize(wgCtx);
				}
			}
			if (this.mPassNodes.length == 0 && param) {
				const passNode = new WGRenderPassNode(this.mRBParam);
				passNode.builder = this;
				passNode.initialize(wgCtx, param);
				this.mPassNodes.push(passNode);
				this.mPNodeFlags.push(1);
				this.mRPassNodes.push(passNode);
			}
		}
	}
	hasMaterial(material: WGMaterialDescripter): boolean {
		if (this.unitBlock) {
			return this.unitBlock.hasMaterial(material);
		}
		return false;
	}
	addEntity(entity: Entity3D): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity) {
			if (!this.unitBlock) {
				this.unitBlock = WGRenderUnitBlock.createBlock();
			}
			const ub = this.unitBlock;
			ub.rbParam = this.mRBParam;
			ub.builder = this;
			ub.addEntity(entity);
		}
	}
	getRenderPassAt(index: number): WGRPassWrapperImpl {

		const ls = this.mRPassNodes;
		const ln = ls.length;
		if (index < 0) index = 0;
		else if (index >= ln) index = ln;
		return { index, node: ls[index] };
	}
	getComptePassAt(index: number): WGRPassWrapperImpl {

		const ls = this.mCompPassNodes;
		const ln = ls.length;
		if (index < 0) index = 0;
		else if (index >= ln) index = ln;
		return { index, node: ls[index] };
	}
	appendRendererPass(param?: WGRPassParam): WGRPassWrapperImpl {

		if (!param) param = {};
		const computing = param && param.computeEnabled === true;
		let index = -1;
		const passNode = new WGRenderPassNode(this.mRBParam, !computing);
		passNode.camera = this.camera;
		console.log("appendRendererPass(), create a new render pass, param: ", param);
		if (computing) {
			passNode.builder = this;
			passNode.name = "newcomppassnode-" + this.mPassNodes.length;
			passNode.initialize(this.mWGCtx, param);
			this.mCompPassNodes.push(passNode);

			index = this.mCompPassNodes.length - 1;
		} else {
			passNode.name = "newpassnode-" + this.mPassNodes.length;
			let prevNode: WGRenderPassNode;
			let prevPass = param.prevPass;
			let prevNodeParam: WGRPassParam;

			if (prevPass && prevPass.node !== undefined) {

				prevNode = prevPass.node as WGRenderPassNode;
				prevNodeParam = prevNode.param;
				param.multisampleEnabled = prevNodeParam.multisampleEnabled;
				param.depthFormat = prevNodeParam.depthFormat;

				passNode.builder = this;
				passNode.prevNode = prevNode;
				passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
				const rpass = passNode.rpass;
				rpass.name = "newpass_type01";
				rpass.passColors[0].loadOp = "load";
				rpass.passDepthStencil.depthLoadOp = "load";
				this.mRPassNodes.push(passNode);
				index = this.mRPassNodes.length - 1;

			} else if (!(param.separate === true)) {

				prevNode = this.mRPassNodes[this.mRPassNodes.length - 1];
				prevNodeParam = prevNode.param;
				param.multisampleEnabled = prevNodeParam.multisampleEnabled;
				param.depthFormat = prevNodeParam.depthFormat;

				passNode.prevNode = prevNode;
				passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
				const rpass = passNode.rpass;
				rpass.name = "newpass_type02";
				this.mRPassNodes.push(passNode);
				index = this.mRPassNodes.length - 1;
			} else {
				console.log("create a separate render pass.");
				const rpass = passNode.rpass;
				rpass.name = "newpass_type03(separate)";
				passNode.separate = rpass.separate = true;
				passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
				this.mRSeparatePassNodes.push(passNode);
				index = -1;
			}
		}
		this.mPassNodes.push(passNode);
		this.mPNodeFlags.push(1);

		const ref = new WGRPassWrapper();
		ref.index = index
		ref.node = passNode;
		return ref;
	}
	private getPassNode(ref: WGRPassWrapperImpl): WGRenderPassNode {
		const nodes = this.mRPassNodes;
		let node = nodes[nodes.length - 1];
		if (ref) {
			if (ref.node) {
				return node;
			}
			if (ref.index !== undefined) {
				if (ref.index >= 0 && ref.index < nodes.length) {
					node = nodes[ref.index];
				}
			}
		}
		return node;
	}
	getPassNodeWithMaterial(material: WGMaterialDescripter): WGRenderPassNode {
		let node = this.getPassNode(material.rpass ? material.rpass.rpass : null);
		if (material.shaderSrc.compShaderSrc) {
			if (this.mCompPassNodes.length < 1) {
				this.appendRendererPass({ computeEnabled: true });
			}
			node = this.mCompPassNodes[this.mCompPassNodes.length - 1];
		}
		return node;
	}
	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext {
		throw Error('Illegal operation !!!');
		return null;
	}
	// pipelineParam value likes {blendMode: "transparent", depthWriteEnabled: false, faceCullMode: "back"}
	createRenderPipelineCtx(
		shdSrc: WGRShderSrcType,
		pipelineVtxParam: VtxPipelinDescParam,
		pipelineParam?: WGRPipelineContextDefParam,
		renderPassConfig?: WGRPassWrapperImpl
	): WGRPipelineContext {
		const node = this.getPassNode(renderPassConfig);
		return node.createRenderPipelineCtx(shdSrc, pipelineVtxParam, pipelineParam);
	}
	createRenderPipeline(pipelineParams: WGRPipelineCtxParams, vtxDesc: VtxPipelinDescParam, renderPassConfig?: WGRPassWrapperImpl): WGRPipelineContext {
		const node = this.getPassNode(renderPassConfig);
		return node.createRenderPipeline(pipelineParams, vtxDesc);
	}
	private mGraph: WGRPassNodeGraph;
	setPassNodeGraph(graph: WGRPassNodeGraph): void {
		this.mGraph = graph;
		if (graph) {
			let ps = graph.passes;
			for (let i = 0; i < ps.length; ++i) {
				const node = ps[i].node as WGRenderPassNode;
				node.mode = 1;
			}
		}
	}
	runBegin(): void {

		this.rcommands = [];
		if (this.enabled) {
			const graph = this.mGraph;
			if (graph) {
				// let ps = graph.passes;
				// for (let i = 0; i < ps.length; ++i) {
				// 	const node = ps[i].node;
				// 	node.rcommands = [];
				// }
				graph.runBegin();
			}

			const nodes = this.mPassNodes;
			for (let i = 0; i < nodes.length; ++i) {
				if (nodes[i].mode < 1) {
					nodes[i].runBegin();
				}
			}
		}
	}
	runEnd(): void {
		if (this.enabled) {

			const graph = this.mGraph;
			if (graph) {
				this.rcommands = this.rcommands.concat(graph.cmdWrapper.rcommands);
			}
			const nodes = this.mPassNodes;
			// console.log("this.mPassNodes: ", this.mPassNodes);

			for (let i = 0; i < nodes.length; ++i) {
				const node = nodes[i];
				if (node.mode < 1) {
					node.runEnd();
					this.rcommands = this.rcommands.concat(node.rcommands);
				}
			}
			// console.log("this.rcommands: ", this.rcommands);
		}
	}
	run(): void {
		if (this.enabled) {
			const graph = this.mGraph;
			if (graph) {
				graph.run();
			}
			const nodes = this.mPassNodes;
			for (let i = 0; i < nodes.length; ++i) {
				if (nodes[i].mode < 1) {
					nodes[i].run();
				}
			}
			if (this.unitBlock) {
				this.unitBlock.run();
			}
		}
	}
	destroy(): void {
		if (this.mWGCtx) {
			this.mWGCtx = null;
			this.mRPassNodes = [];
			this.mCompPassNodes = [];
			this.mPassNodes = [];
			this.mRBParam = null;
		}
	}
}
export { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock };

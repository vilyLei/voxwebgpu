import { IWGRendererPass, WGRPassParam } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { IWGRUnit } from "./IWGRUnit";
import { IWGRPassRef } from "./pipeline/IWGRPassRef";

import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import Camera from "../view/Camera";
import { WGRenderPassNode } from "./WGRenderPassNode";
import { BlockParam, WGRenderUnitBlock } from "./WGRenderUnitBlock";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { Entity3D } from "../entity/Entity3D";

class WGRenderPassBlock implements IWGRPassNodeBuilder {
	private mWGCtx: WebGPUContext;
	private mRendererUid = 0;
	private mrPassParam: WGRPassParam;

	private mCompPassNodes: WGRenderPassNode[] = [];
	private mRPassNodes: WGRenderPassNode[] = [];
	private mRSeparatePassNodes: WGRenderPassNode[] = [];
	private mPassNodes: WGRenderPassNode[] = [];
	// private mUnits: IWGRUnit[] = [];
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
		if(wgCtx) {
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
				this.mRPassNodes.push(passNode);
			}
		}
	}

	private addEntityToBlock(entity: Entity3D): void {
		entity.update();
		entity.rstate.__$rever++;
		const runit = this.mRBParam.roBuilder.createRUnit(entity, this);
		this.unitBlock.addRUnit(runit);
	}
	addEntity(entity: Entity3D): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity && !entity.isInRenderer()) {

			entity.update();
			entity.rstate.__$inRenderer = true;

			let flag = true;
			if (this.mWGCtx && this.mWGCtx.enabled) {
				if (entity.isREnabled()) {
					flag = false;
					this.addEntityToBlock(entity);
				}
			}
			if (flag) {
				entity.rstate.__$rever++;
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
		this.unitBlock.addRUnit(unit);
	}
	getRenderPassAt(index: number): IWGRPassRef {

		const ls = this.mRPassNodes;
		const ln = ls.length;
		if(index < 0) index = 0;
		else if(index >= ln) index = ln;
		return { index, node: ls[index] };
	}
	getComptePassAt(index: number): IWGRPassRef {

		const ls = this.mCompPassNodes;
		const ln = ls.length;
		if(index < 0) index = 0;
		else if(index >= ln) index = ln;
		return { index, node: ls[index] };
	}
	appendRendererPass(param?: WGRPassParam): IWGRPassRef {

		if(!param) param = {};
		const computing = param && param.computeEnabled === true;
		let index = -1;
		const passNode = new WGRenderPassNode(this.mRBParam, !computing);
		passNode.camera = this.camera;
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

			if(prevPass && prevPass.node !== undefined) {

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

			}else if(!(param.separate === false)) {

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
			}else {
				passNode.initialize(this.mWGCtx, param ? param : prevNode.param);
				const rpass = passNode.rpass;
				passNode.separate = rpass.separate = true;
				rpass.name = "newpass_type03(separate)";
				this.mRSeparatePassNodes.push(passNode);
				index = -1;
			}
		}
		this.mPassNodes.push(passNode);
		return { index, node: passNode };
	}
	private getPassNode(ref: IWGRPassRef): WGRenderPassNode {
		const nodes = this.mRPassNodes;
		let node = nodes[nodes.length - 1];
		if (ref) {
			if(ref.node) {
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
	// createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): { ctx: WGRPipelineContext, rpass: IWGRendererPass } {
	// 	let node = this.getPassNode(material.rpass ? material.rpass.rpass : null);
	// 	if (material.shaderCodeSrc.compShaderSrc) {
	// 		if (this.mCompPassNodes.length < 1) {
	// 			this.appendRendererPass({ computeEnabled: true });
	// 		}
	// 		node = this.mCompPassNodes[this.mCompPassNodes.length - 1];
	// 	}
	// 	return { ctx: node.createRenderPipelineCtxWithMaterial(material), rpass: node.rpass };
	// }

	getPassNodeWithMaterial(material: WGMaterialDescripter): WGRenderPassNode {
		let node = this.getPassNode(material.rpass ? material.rpass.rpass : null);
		if (material.shaderCodeSrc.compShaderSrc) {
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
			const nodes = this.mPassNodes;
			for (let i = 0; i < nodes.length; ++i) {
				nodes[i].run();
			}
			this.unitBlock.run();
		}
	}
	destroy(): void {
		if (this.mWGCtx) {
			this.mWGCtx = null;
			this.mRPassNodes = [];
			this.mPassNodes = [];
			this.mRBParam = null;
		}
	}
}
export { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock };

import Camera from "../view/Camera";
import { Entity3D } from "../entity/Entity3D";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { WGWaitEntityNode, WGEntityNodeMana } from "./WGEntityNodeMana";
import Vector3 from "../math/Vector3";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";

import IRenderer from "./IRenderer";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";
import { WGRendererConfig, checkConfig } from "./WGRendererParam";
import { WGRenderUnitBlock } from "../render/WGRenderUnitBlock";

class WGRenderer implements IRenderer {
	private ___$$$$$$$Author = "VilyLei(vily313@126.com)";
	private static sUid = 0;
	private mUid = WGRenderer.sUid++;
	private mInit = true;
	private mDiv: HTMLDivElement;
	private mRPBlocks: WGRenderPassBlock[] = [];
	private mWGCtx: WebGPUContext;
	private mROBuilder = new WGRObjBuilder();
	private mEntityMana = new WGEntityNodeMana();
	private mConfig: WGRendererConfig;

	readonly camera = new Camera();
	enabled = true;
	stage: IRenderStage3D;

	constructor(config?: WGRendererConfig) {
		if (config) {
			this.initialize(config);
		}
	}
	private initCamera(width: number, height: number): void {
		let p = this.mConfig.camera;
		if (!p) p = {};
		if (!p.eye) p.eye = new Vector3(1100.0, 1100.0, 1100.0);
		if (!p.up) p.up = new Vector3(0, 1, 0);
		if (!p.origin) p.origin = new Vector3();
		if (p.fovDegree === undefined) p.fovDegree = 45;
		if (p.near === undefined) p.near = 0.1;
		if (p.far === undefined) p.far = 8000;
		p.perspective = p.perspective === false ? false : true;

		const cam = this.camera;
		if (p.perspective) {
			cam.perspectiveRH((Math.PI * p.fovDegree) / 180.0, width / height, p.near, p.far);
		} else {
			cam.inversePerspectiveZ = true;
			cam.orthoRH(p.near, p.far, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
		}
		cam.lookAtRH(p.eye, p.origin, p.up);
		cam.setViewXY(0, 0);
		cam.setViewSize(width, height);
		cam.update();
	}
	get uid(): number {
		return 0;
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	getStage3D(): IRenderStage3D {
		return this.stage;
	}
	getCamera(): IRenderCamera {
		return this.camera;
	}
	getDiv(): HTMLDivElement {
		return this.mDiv;
	}
	getCanvas(): HTMLCanvasElement {
		return this.mWGCtx.canvas;
	}
	initialize(config?: WGRendererConfig): void {
		if (this.mInit && !this.mWGCtx) {
			this.mInit = false;
			let wgCtx = config ? config.ctx : null;
			if (wgCtx) {
				// console.log("WGRenderer::initialize(), a 01");

				this.mDiv = config.div;
				this.mWGCtx = wgCtx;
				const canvas = wgCtx.canvas;
				this.initCamera(canvas.width, canvas.height);
			} else {
				config = checkConfig(config);
				this.mDiv = config.div;
				wgCtx = new WebGPUContext();
				wgCtx.initialize(config.canvas, config.gpuCanvasCfg).then(() => {
					this.init();
					if (config && config.callback) {
						config.callback("renderer-init");
					}
					const mana = this.mEntityMana;
					mana.wgCtx = wgCtx;
					mana.callback = this.receiveNode;
					this.mEntityMana.updateToTarget();
				});
				this.mWGCtx = wgCtx;
			}
			this.mConfig = config;
			// this.intDefaultBlock();
		}
	}
	private receiveNode = (node: WGWaitEntityNode): void => {
		this.addEntityToBlock(node.entity, node.dst);
	};
	private intDefaultBlock(): void {
		if (this.mRPBlocks.length < 1) {
			let param = this.mConfig.rpassparam;
			if (!param) {
				param = {
					sampleCount: 4,
					multisampleEnabled: true,
					depthFormat: "depth24plus"
				};
			}
			this.createRenderBlock(param);
		}
	}
	private init(): void {
		const ctx = this.mWGCtx;
		const canvas = this.mWGCtx.canvas;
		this.initCamera(canvas.width, canvas.height);

		for (let i = 0; i < this.mRPBlocks.length; ++i) {
			this.mRPBlocks[i].initialize(ctx);
		}
	}

	private addEntityToBlock(entity: Entity3D, rb: any): void {
		console.log("addEntityToBlock() ...., rb: ", rb);
		entity.update();
		entity.rstate.__$rever++;
		const runit = this.mROBuilder.createRUnit(entity, rb);
		runit.etuuid = entity.uuid;
		rb.addRUnit(runit);
	}
	addEntity(entity: Entity3D, blockIndex = 0): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity && !entity.isInRenderer()) {

			if(this.mRPBlocks.length < 1) {
				this.initialize();
				this.intDefaultBlock();
			}
			if (blockIndex < 0 || blockIndex >= this.mRPBlocks.length) {
				throw Error("Illegal operation !!!");
			}
			const rb = this.mRPBlocks[blockIndex];
			rb.addEntity( entity );
		}
	}

	removeEntity(entity: Entity3D): void {
		if (entity) {
			if (entity.isInRenderer()) {
				const st = entity.rstate;
				st.__$rever++;
				st.__$inRenderer = false;
				st.__$rendering = false;
				console.log("Renderer::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());
			}
		}
	}
	appendRenderPass(param?: WGRPassParam, blockIndex = 0): IWGRPassRef {
		this.initialize();
		this.intDefaultBlock();
		const len = this.mRPBlocks.length;
		if (blockIndex >= 0 && blockIndex < len) {
			return this.mRPBlocks[blockIndex].appendRendererPass(param);
		}
		throw Error("Illegal operations !!!");
		return { index: -1 };
	}
	createRenderPass(param?: WGRPassParam, blockIndex = 0): IWGRPassRef {
		return this.appendRenderPass(param, blockIndex);
	}
	getRPBlockAt(i: number): WGRenderPassBlock {
		this.initialize();
		this.intDefaultBlock();
		return this.mRPBlocks[i];
	}
	createRenderBlock(param?: WGRPassParam): WGRenderPassBlock {
		let bp = {entityMana: this.mEntityMana, roBuilder: this.mROBuilder, camera: this.camera};
		const rb = new WGRenderPassBlock(this.mUid, bp, this.mWGCtx, param);
		// rb.camera = this.camera;
		rb.unitBlock = WGRenderUnitBlock.createBlock();
		this.mRPBlocks.push(rb);
		return rb;
	}
	isEnabled(): boolean {
		return this.enabled && this.mWGCtx && this.mWGCtx.enabled;
	}
	run(rendering = true): void {
		if (this.enabled) {
			const ctx = this.mWGCtx;
			if (ctx && ctx.enabled) {
				this.mEntityMana.update();
				if (rendering) {
					const rbs = this.mRPBlocks;
					if (rbs.length > 0) {
						const rb = rbs[0];

						rb.runBegin();
						rb.run();
						rb.runEnd();
						const cmds = rb.rcommands;
						ctx.queue.submit(cmds);
					}
				}
			}
		}
	}
	destroy(): void {
		const ctx = this.mWGCtx;
		if (ctx && ctx.enabled) {
		}
	}
}
export { WGRendererConfig, WGRPipelineContextDefParam, WGRenderer };

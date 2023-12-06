import Camera from "../view/Camera";
import { Entity3D, Entity3DParam } from "../entity/Entity3D";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { WGEntityNodeMana } from "./WGEntityNodeMana";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";

import IRenderer from "./IRenderer";
import { WGRPassWrapperImpl } from "../render/pipeline/WGRPassWrapperImpl";
import { WGRendererConfig, checkConfig } from "./WGRendererParam";
import { WGRenderUnitBlock } from "../render/WGRenderUnitBlock";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";

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

	readonly camera: Camera;// = new Camera();
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
		if(!(p.enabled === false)) {
			let selfT: any = this;
			if(!this.camera) {
				selfT.camera = new Camera();
			}

			p.viewWidth = width;
			p.viewHeight = height;
			this.camera.initialize(p);
		}

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

			if(!config) config = {};

			if(!config || !config.camera || !(config.camera.enabled === false)) {
				if(!this.camera) {
					(this as any).camera = new Camera();
				}
			}

			this.mInit = false;
			let wgctx = config ? config.ctx : null;
			if (wgctx) {
				// console.log("WGRenderer::initialize(), a 01");

				this.mDiv = config.div;
				this.mWGCtx = wgctx;
				const canvas = wgctx.canvas;
				this.mROBuilder.wgctx = wgctx;
				this.initCamera(canvas.width, canvas.height);
			} else {

				config = checkConfig(config);
				this.mDiv = config.div;

				wgctx = new WebGPUContext();
				wgctx.initialize(config.canvas, config.gpuCanvasCfg).then(() => {

					this.init();
					if (config && config.callback) {
						config.callback("renderer-init");
					}

					this.mROBuilder.wgctx = wgctx;
					const mana = this.mEntityMana;
					mana.wgctx = wgctx;
					mana.roBuilder = this.mROBuilder;

					this.mEntityMana.updateToTarget();
				});
				this.mWGCtx = wgctx;
			}
			this.mConfig = config;
		}
	}
	private intDefaultBlock(): void {
		if (this.mRPBlocks.length < 1) {
			let param = this.mConfig.rpassparam;
			if (!param) {
				param = {
					sampleCount: 4,
					multisampled: true,
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

		const bs = this.mRPBlocks;
		for (let i = 0; i < bs.length; ++i) {
			bs[i].initialize(ctx);
		}
	}

	addEntity(entity: Entity3D, param?: Entity3DParam): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		const bs = this.mRPBlocks;
		if (bs.length < 1) {
			this.initialize();
			this.intDefaultBlock();
		}
		let blockIndex = 0;
		if(param) {
			if(param.processIndex !== undefined) {
				blockIndex = param.processIndex;
			}
		}
		if (blockIndex < 0 || blockIndex >= bs.length) {
			throw Error("Illegal operation !!!");
		}
		const rb = bs[blockIndex];
		rb.addEntity(entity, param);
	}

	removeEntity(entity: Entity3D): void {
		if (entity) {
			if (entity.isInRenderer()) {
				
				const ls = entity.__$bids;
				if (ls) {
					let bs: WGRenderUnitBlock[] = new Array(ls.length);
					for (let i = 0; i < ls.length; ++i) {
						bs[i] = WGRenderUnitBlock.getBlockAt(ls[i]);
					}
					entity.__$bids = [];
					for (let i = 0; i < ls.length; ++i) {
						bs[i].removeEntity(entity);
					}

				}

				const st = entity.rstate;
				st.__$rever++;
				st.__$inRenderer = false;
				st.__$rendering = false;

				console.log("Renderer::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());
			}
		}
	}
	setPassNodeGraph(graph: WGRPassNodeGraph, blockIndex = 0): void {
		this.intDefaultBlock();
		const len = this.mRPBlocks.length;
		if (blockIndex >= 0 && blockIndex < len) {
			this.mRPBlocks[blockIndex].setPassNodeGraph(graph);
		}else {
			throw Error("Illegal operations !!!");
		}
	}
	appendRenderPass(param?: WGRPassParam, blockIndex = 0): WGRPassWrapperImpl {
		this.initialize();
		this.intDefaultBlock();
		const len = this.mRPBlocks.length;
		if (blockIndex >= 0 && blockIndex < len) {
			return this.mRPBlocks[blockIndex].appendRendererPass(param);
		}
		throw Error("Illegal operations !!!");
		return { index: -1 };
	}
	createRenderPass(param?: WGRPassParam, blockIndex = 0): WGRPassWrapperImpl {
		return this.appendRenderPass(param, blockIndex);
	}
	getRPBlockAt(i: number): WGRenderPassBlock {
		this.initialize();
		this.intDefaultBlock();
		return this.mRPBlocks[i];
	}
	createRenderBlock(param?: WGRPassParam): WGRenderPassBlock {
		let bp = { entityMana: this.mEntityMana, roBuilder: this.mROBuilder, camera: this.camera };
		const rb = new WGRenderPassBlock(this.mUid, bp, this.mWGCtx, param);
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

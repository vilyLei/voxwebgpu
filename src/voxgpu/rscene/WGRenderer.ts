import Camera from "../view/Camera";
import { Entity3D } from "../entity/Entity3D";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGRPipelineContextDefParam, WGRPassParams, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { WGEntityNodeMana } from "./WGEntityNodeMana";
import Vector3 from "../math/Vector3";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";

import { GPUCanvasConfiguration } from "../gpu/GPUCanvasConfiguration";
import IRenderer from "./IRenderer";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";

interface WGRenderConfig {
	gpuCanvasCfg?: GPUCanvasConfiguration;
	ctx?: WebGPUContext;
	canvas?: HTMLCanvasElement;
	div?: HTMLDivElement;
	callback?: (type?: string) => void;
}
class RPassInfoParam {
	blockIndex = 0;
	rparam: WGRPassParams;
	ref: IWGRPassRef;
}

class WGRenderer implements IRenderer {
	private ___$$$$$$$Author = "VilyLei(vily313@126.com)";
	private mInit = true;
	private mDiv: HTMLDivElement;
	private mRPBlocks: WGRenderPassBlock[] = [];
	private mBlockRPassParams: WGRPassParams[] = [];
	private mRPassInfos: RPassInfoParam[] = [];
	private mWGCtx: WebGPUContext;
	private mROBuilder = new WGRObjBuilder();
	private mNodeMana = new WGEntityNodeMana();

	readonly camera = new Camera();
	enabled = true;
	stage: IRenderStage3D;

	constructor(config?: WGRenderConfig) {
		this.mNodeMana.target = this;
		if (config) {
			this.initialize(config);
		}
	}
	private initCamera(width: number, height: number): void {
		const cam = this.camera;
		const camUpDirect = new Vector3(0, 1, 0);
		cam.perspectiveRH((Math.PI * 45) / 180.0, width / height, 0.1, 5000);
		cam.lookAtRH(new Vector3(800.0, 800.0, 800.0), new Vector3(), camUpDirect);
		cam.update();
	}
	getUid(): number {
		return 0;
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
	checkConfig(config?: WGRenderConfig): WGRenderConfig {
		let canvasCFG: GPUCanvasConfiguration = { alphaMode: "premultiplied" };
		let canvas: HTMLCanvasElement;
		let div: HTMLDivElement;

		if (config) {
			canvas = config.canvas;
			div = config.div;
			if (config.gpuCanvasCfg) {
				canvasCFG = config.gpuCanvasCfg;
			}
		} else {
			config = { canvas: null };
		}
		let width = 512;
		let height = 512;
		if (!div) {
			div = document.createElement("div");
			document.body.appendChild(div);

			const style = div.style;
			style.display = "bolck";
			style.position = "absolute";

			if (style.left == "") {
				style.left = "0px";
				style.top = "0px";
			}
			div.style.width = width + "px";
			div.style.height = height + "px";
		}
		if (!canvas) {
			canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			div.appendChild(canvas);
		}
		config.canvas = canvas;
		config.div = div;
		config.gpuCanvasCfg = canvasCFG;
		return config;
	}
	initialize(config?: WGRenderConfig): void {
		if (this.mInit && !this.mWGCtx) {
			this.mInit = false;
			const wgCtx = config ? config.ctx : null;

			if (wgCtx) {
				// console.log("WGRenderer::initialize(), a 01");

				this.mDiv = config.div;
				this.mWGCtx = wgCtx;
				const canvas = wgCtx.canvas;
				this.initCamera(canvas.width, canvas.height);
			} else {
				config = this.checkConfig(config);
				this.mDiv = config.div;
				this.mWGCtx = new WebGPUContext();
				this.mWGCtx.initialize(config.canvas, config.gpuCanvasCfg).then(() => {
					this.init();
					if (config && config.callback) {
						config.callback("renderer-init");
					}
					this.mNodeMana.updateToTarget();
				});
			}
		}
	}
	private init(): void {
		const canvas = this.mWGCtx.canvas;
		this.initCamera(canvas.width, canvas.height);
		for (let i = 0; i < this.mBlockRPassParams.length; ++i) {
			this.createRenderBlock(this.mBlockRPassParams[i]);
		}
		this.mBlockRPassParams = [];
		this.buildRPasses();
	}
	private buildRPasses(): void {
		for (let i = 0; i < this.mRPassInfos.length; ) {
			const rinfo = this.mRPassInfos[i];

			if (rinfo.blockIndex >= 0 && rinfo.blockIndex < this.mRPBlocks.length) {
				const ref = this.mRPBlocks[rinfo.blockIndex].appendRendererPass(rinfo.rparam);
				rinfo.ref.index = ref.index;
				rinfo.ref.node = ref.node;
				this.mRPassInfos.splice(i, 1);
			} else {
				++i;
			}
		}
	}
	getWGCtx(): WebGPUContext {
		return this.mWGCtx;
	}
	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		if (this.mInit) {
			this.initialize();
		}
		if (entity) {
			let flag = true;
			if (this.mWGCtx && this.mWGCtx.enabled) {
				// console.log("WGRenderer::addEntity(), a 03");
				if (processIndex == 0 && this.mRPBlocks.length < 1) {
					this.createRenderBlock({
						sampleCount: 4,
						multisampleEnabled: true,
						depthFormat: "depth24plus"
					});
					this.buildRPasses();
				}
				if (entity.isREnabled()) {
					if (processIndex >= 0 && processIndex < this.mRPBlocks.length) {
						entity.update();
						flag = false;
						const rb = this.mRPBlocks[processIndex];
						const runit = this.mROBuilder.createRUnit(entity, rb);
					} else {
						throw Error("Illegal operation !!!");
					}
				}
			}
			if (flag) {
				this.mNodeMana.addEntity(entity, processIndex, deferred);
			}
		}
	}

	removeEntity(entity: Entity3D): void {}
	appendRendererPassAt(processIndex = 0, param?: WGRPassParams): IWGRPassRef {
		const len = this.mRPBlocks.length;
		if (len > 0) {
			if (processIndex >= 0 && processIndex < len) {
				return this.mRPBlocks[processIndex].appendRendererPass(param);
			}
			return { index: -1 };
		}
		let info = new RPassInfoParam();
		info.blockIndex = processIndex;
		info.rparam = param;
		info.ref = { index: -1 };
		this.mRPassInfos.push(info);
		return info.ref;
	}
	getRPBlockAt(i: number): WGRenderPassBlock {
		return this.mRPBlocks[i];
	}
	createRenderBlock(param?: WGRPassParams): WGRenderPassBlock {
		if (this.mWGCtx) {
			const rb = new WGRenderPassBlock(this.mWGCtx, param);
			rb.camera = this.camera;
			this.mRPBlocks.push(rb);
			return rb;
		} else {
			this.mBlockRPassParams.push(param);
		}
		return null;
	}
	bindMaterial(material: WGMaterial, block: WGRenderPassBlock): WGMaterial {
		if (this.mWGCtx) {
			const p = block.createRenderPipelineCtxWithMaterial(material);
			material.initialize(p.ctx);
		}
		return material;
	}
	isEnabled(): boolean {
		return this.mWGCtx && this.mWGCtx.enabled;
	}
	run(): void {
		if (this.enabled) {
			const ctx = this.mWGCtx;
			if (ctx && ctx.enabled) {
				this.mNodeMana.update();

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
	destroy(): void {
		const ctx = this.mWGCtx;
		if (ctx && ctx.enabled) {
		}
	}
}
export { WGRenderConfig, WGRPipelineContextDefParam, WGRenderer };

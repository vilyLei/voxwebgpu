import Camera from "../view/Camera";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
import { RAdapterContext } from "./context/RAdapterContext";
import { IRendererScene } from "./IRendererScene";
import Stage3D from "./Stage3D";
import { WGRendererConfig, checkConfig } from "./WGRendererParam";
import { WGRenderer } from "./WGRenderer";
import { Entity3D, Entity3DParam } from "../entity/Entity3D";
import { IRenderableObject } from "../render/IRenderableObject";
import { IRenderableEntityContainer } from "../render/IRenderableEntityContainer";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRPassParam } from "../render/WGRenderPassBlock";
import { WGRPassWrapperImpl } from "../render/pipeline/WGRPassWrapperImpl";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";

class RendererScene implements IRendererScene {
	private static sUid = 0;
	private mUid = 0;

	private mInit = true;
	private mContainers: IRenderableEntityContainer[] = [];
	private mStage: Stage3D;

	enabled = true;
	private mRenderer: WGRenderer;
	racontext: RAdapterContext;
	camera:Camera;// = new Camera;

	constructor(uidBase = 0) {
		this.mUid = uidBase + RendererScene.sUid++;
	}
	get renderer(): WGRenderer {
		return this.mRenderer;
	}
	get uid(): number {
		return this.mUid;
	}

	initialize(config?: WGRendererConfig): void {
		if (this.mInit) {
			this.mInit = false;
			const renderer = new WGRenderer();
			config = checkConfig(config);

			this.mStage = new Stage3D(this.uid, document);
			this.racontext = new RAdapterContext();
			this.racontext.initialize({ stage: this.mStage, canvas: config.canvas, div: config.div });
			renderer.initialize(config);

			this.mRenderer = renderer;
			this.camera = renderer.camera;
		}
	}

	setPassNodeGraph(graph: WGRPassNodeGraph, blockIndex = 0): void {
		this.initialize();
		this.mRenderer.setPassNodeGraph(graph, blockIndex);
	}
	createRTTPass(param?: WGRPassParam, blockIndex = 0): WGRPassWrapperImpl {
		this.initialize();
		if(!param) param = {};
		param.separate = true;
		return this.renderer.appendRenderPass(param, blockIndex);
	}
	createRenderPass(param?: WGRPassParam, blockIndex = 0): WGRPassWrapperImpl {
		this.initialize();
		return this.renderer.appendRenderPass(param, blockIndex);
	}
	getWGCtx(): WebGPUContext {
		return this.renderer.getWGCtx();
	}
	getStage3D(): IRenderStage3D {
		return this.racontext.getStage();
	}
	getCamera(): IRenderCamera {
		return this.camera;
	}
	enableMouseEvent(enabled = true): void {}

	private addContainer(container: IRenderableEntityContainer, processid: number = 0): void {

		if(container.isContainer()) {
			this.initialize();
			if (container.__$wuid < 0 && container.__$contId < 1) {
				let i = 0;
				for (; i < this.mContainers.length; ++i) {
					if (this.mContainers[i] == container) {
						break;
					}
				}
				if (i >= this.mContainers.length) {

					container.__$wuid = this.mUid;
					container.__$wprocuid = processid;
					container.__$setRenderer(this);
					this.mContainers.push(container);
					container.update();
				}
			}
		}else {
			throw Error("illegal operation !!!");
		}
	}
	addEntity(entity: IRenderableObject, param?: Entity3DParam): RendererScene {
		if(entity) {
			this.initialize();
			if (entity.isContainer()) {
				this.addContainer(entity as IRenderableEntityContainer);
			} else {
				this.mRenderer.addEntity(entity as Entity3D, param);
			}
		}
		return this;
	}
	removeEntity(entity: IRenderableObject): void {
		if (entity.isContainer()) {

		} else {
			this.mRenderer.removeEntity( entity as Entity3D );
		}
	}
	/**
	 * @param type event type
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addEventListener(type: number, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {
		this.initialize();
		const st = this.racontext.getStage();
		st.addEventListener(type, func, captureEnabled, bubbleEnabled);
	}
	/**
	 * @param type event type
	 * @param func event listerner callback function
	 */
	removeEventListener(type: number, func: (evt: any) => void): void {
		const st = this.racontext.getStage();
		st.removeEventListener(type, func);
	}
	run(rendering = true): void {

		const r = this.mRenderer;
		if (this.enabled && r && r.isEnabled()) {

			this.camera.update();
			const st = this.racontext.getStage();
			st.enterFrame();
			r.run(rendering);
		}
	}
	destroy(): void {}
}
export { RendererScene };

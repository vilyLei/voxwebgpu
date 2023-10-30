import Camera from "../view/Camera";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
import { RAdapterContext } from "./context/RAdapterContext";
import { IRendererScene } from "./IRendererScene";
import Stage3D from "./Stage3D";
import { WGRenderConfig, WGRenderer } from "./WGRenderer";
import { Entity3D } from "../entity/Entity3D";
import { Entity3DContainer } from "../entity/Entity3DContainer";
import { IRenderableObject } from "../render/IRenderableObject";
import { IRenderableEntityContainer } from "../render/IRenderableEntityContainer";

class RendererScene implements IRendererScene {
	private static sUid = 0;
	private mInit = true;
	private mUid = 0;
	private mContainers: IRenderableEntityContainer[] = [];
	private mStage: Stage3D;

	enabled = true;
	renderer: WGRenderer;
	racontext: RAdapterContext;
	camera: Camera;

	constructor(uidBase: number = 0) {
		this.mUid = uidBase + RendererScene.sUid++;
	}

	getUid(): number {
		return this.mUid;
	}

	initialize(config?: WGRenderConfig): void {
		if (this.mInit) {
			this.mInit = false;
			config = config ? config : { canvas: null };
			const renderer = new WGRenderer();
			renderer.checkConfig(config);

			this.mStage = new Stage3D(this.getUid(), document);
			this.racontext = new RAdapterContext();
			this.racontext.initialize({ stage: this.mStage, canvas: config.canvas, div: config.div });
			renderer.initialize(config);

			this.renderer = renderer;
			this.camera = renderer.camera;
		}
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
			// container.__$wuid = this.mUid;
			// container.__$wprocuid = processid;
			// container.__$setRenderer(this);
			// this.mContainers.push(container);

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
					// if(container.isSpaceEnabled()) {
					// 	this.mRspace.addEntity(container);
					// }
					// if(container.getREType() >= 20) {
					// 	this.m_renderer.addContainer(container, this.m_processids[processid]);
					// }
				}
			}
		}else {
			throw Error("illegal operation !!!");
		}
	}
	addEntity(entity: IRenderableObject, processIndex = 0, deferred = true): void {

		if (entity.isContainer()) {
			this.addContainer(entity as IRenderableEntityContainer, processIndex);
		} else {
			this.renderer.addEntity(entity as Entity3D, processIndex, deferred);
		}
	}
	removeEntity(entity: IRenderableObject): void {
		if (entity.isContainer()) {

		} else {
		}
	}
	/**
	 * @param type event type
	 * @param target event listerner
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {
		const st = this.racontext.getStage();
		st.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
	}
	/**
	 * @param type event type
	 * @param target event listerner
	 * @param func event listerner callback function
	 */
	removeEventListener(type: number, target: any, func: (evt: any) => void): void {
		const st = this.racontext.getStage();
		st.removeEventListener(type, target, func);
	}
	run(): void {
		if (this.enabled && this.renderer && this.renderer.isEnabled()) {
			this.camera.update();
			const st = this.racontext.getStage();
			st.enterFrame();
			this.renderer.run();
		}
	}
	destroy(): void {}
}
export { RendererScene };

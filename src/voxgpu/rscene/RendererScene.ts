import Camera from "../view/Camera";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
import { RAdapterContext } from "./context/RAdapterContext";
import { IRendererScene } from "./IRendererScene";
import Stage3D from "./Stage3D";
import { WGRenderConfig, WGRenderer } from "./WGRenderer";
import { Entity3D } from "../entity/Entity3D";

class RendererScene implements IRendererScene {

	private mInit = true;
	private static sUid = 0;
	private mUid = 0;
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
	enableMouseEvent(enabled = true): void {
	}

	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		this.renderer.addEntity(entity, processIndex, deferred);
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
	destroy(): void {
	}
}
export { RendererScene };

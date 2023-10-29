import Camera from "../view/Camera";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
import { RAdapterContext } from "./context/RAdapterContext";
import { IRendererScene } from "./IRendererScene";

class RendererScene implements IRendererScene {

	enabled = true;

	racontext: RAdapterContext;
	camera: Camera;
	constructor() {
	}
	initialize(): void {
	}
	getStage3D(): IRenderStage3D {
		return this.racontext.getStage();
	}
	getCamera(): IRenderCamera {
		return this.camera;
	}
	enableMouseEvent(enabled = true): void {
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
	}
	destroy(): void {
	}
}
export { RendererScene };

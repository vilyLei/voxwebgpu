import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";

import IRenderer from "./IRenderer";

interface IRendererScene extends IRenderer {
	getStage3D(): IRenderStage3D;
	getCamera(): IRenderCamera;
	enableMouseEvent(enabled?: boolean): void;

	/**
	 * @param type event type
	 * @param target event listerner
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addEventListener(type: number, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
	/**
	 * @param type event type
	 * @param target event listerner
	 * @param func event listerner callback function
	 */
	removeEventListener(type: number, func: (evt: any) => void): void;
	run(): void;
	destroy(): void;
}
export { IRendererScene };

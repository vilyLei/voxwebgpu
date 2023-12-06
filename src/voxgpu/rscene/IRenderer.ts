/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
import { IRenderableEntity } from "../render/IRenderableEntity";
import { Entity3DParam } from "../entity/Entity3DParam";
/**
 * define the renderer instance behaviours;
 */
interface IRenderer {

	uid: number;
	getStage3D(): IRenderStage3D;
	getCamera(): IRenderCamera;

	// getViewWidth(): number;
	// getViewHeight(): number;

	/**
	 * add an entity to the renderer process of the renderer instance
	 * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
	 * @param processid this destination renderer process id, the default value is 0
	 * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id, the defaule value is true
	 */
	addEntity(entity: IRenderableEntity, param?: Entity3DParam): void;
	/**
	 * remove an entity from the renderer instance
	 * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
	 */
	removeEntity(entity: IRenderableEntity): void;
	run(): void;
}
export default IRenderer;

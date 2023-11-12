
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNodeRef } from "../IWGRenderPassNodeRef";
/**
 * render pass reference
 */
interface IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNodeRef;
	addEntity?(entity: Entity3D): IWGRPassWrapper;
}
export { IWGRPassWrapper };

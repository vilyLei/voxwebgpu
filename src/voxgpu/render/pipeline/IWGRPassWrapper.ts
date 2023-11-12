
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
/**
 * render pass reference
 */
interface IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNode;
	addEntity?(entity: Entity3D): IWGRPassWrapper;
	setColorArrachmentClearEnabledAt?(enabled: boolean, index?: number): IWGRPassWrapper;
}
export { IWGRPassWrapper };

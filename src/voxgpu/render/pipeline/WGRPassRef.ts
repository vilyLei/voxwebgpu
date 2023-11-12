
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNodeRef } from "../IWGRenderPassNodeRef";
import { IWGRPassWrapper } from "./IWGRPassWrapper";
/**
 * render pass reference
 */
class WGRPassRef implements IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNodeRef;
	addEntity(entity: Entity3D): IWGRPassWrapper {
		if(this.node) {
			this.node.addEntity( entity );
		}
		return this;
	}
}
export { WGRPassRef };

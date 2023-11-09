
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNodeRef } from "../IWGRenderPassNodeRef";
import { IWGRPassRef } from "./IWGRPassRef";
/**
 * render pass reference
 */
class WGRPassRef implements IWGRPassRef {
	index?: number;
	name?: string;
	node?: IWGRenderPassNodeRef;
	addEntity(entity: Entity3D): IWGRPassRef {
		if(this.node) {
			this.node.addEntity( entity );
		}
		return this;
	}
}
export { WGRPassRef };

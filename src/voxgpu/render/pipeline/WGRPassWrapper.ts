
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
import { IWGRPassWrapper } from "./IWGRPassWrapper";
/**
 * render pass reference
 */
class WGRPassWrapper implements IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNode;
	addEntity(entity: Entity3D): IWGRPassWrapper {
		if(this.node) {
			this.node.addEntity( entity );
		}
		return this;
	}
	setColorAttachmentClearEnabledAt(enabled: boolean, index: number = 0): IWGRPassWrapper {
		if(this.node) {
			this.node.setColorAttachmentClearEnabledAt(enabled, index);
		}
		return this;
	}
}
export { WGRPassWrapper };

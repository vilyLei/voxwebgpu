
import { Entity3D } from "../../entity/Entity3D";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
import { WGRCmdWrapper, IWGRPassWrapper } from "./IWGRPassWrapper";
import { WGRPColorAttachmentImpl } from "../pipeline/WGRPColorAttachmentImpl";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
/**
 * render pass reference
 */
class WGRPassWrapper implements IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNode;
	cmdWrapper?: WGRCmdWrapper;
	get rcommands(): GPUCommandBuffer[] {
		if(this.node) {
			return this.node.rcommands;
		}
		return undefined;
	}
	get colorAttachments(): WGRPColorAttachmentImpl[] {
		if(this.node) {
			return this.node.colorAttachments;
		}
		return undefined;
	}
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
	render(): void {
		if(this.node) {
			this.node.render();
			const cmd = this.cmdWrapper;
			if(cmd) {
				//this.rcommands.concat(pass.rcommands);
				cmd.rcommands = cmd.rcommands.concat(this.node.rcommands);
			}
		}
	}
}
export { WGRPassWrapper };


import { Entity3D, Entity3DParam } from "../../entity/Entity3D";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
import { WGRCmdWrapper, WGRPassWrapperImpl } from "./WGRPassWrapperImpl";
import { WGRPColorAttachmentImpl } from "../pipeline/WGRPColorAttachmentImpl";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
/**
 * render pass reference
 */
class WGRPassWrapper implements WGRPassWrapperImpl {
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
	addEntity(entity: Entity3D, param?: Entity3DParam): WGRPassWrapperImpl {
		if(this.node) {
			this.node.addEntity( entity, param );
		}
		return this;
	}
	setColorAttachmentClearEnabledAt(enabled: boolean, index: number = 0): WGRPassWrapperImpl {
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

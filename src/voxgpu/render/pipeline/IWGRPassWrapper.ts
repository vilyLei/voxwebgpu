
import { Entity3D } from "../../entity/Entity3D";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
import { WGRPColorAttachmentImpl } from "../pipeline/WGRPColorAttachmentImpl";
interface WGRCmdWrapper {
	uid?: number;
	rcommands: GPUCommandBuffer[];
}
/**
 * render pass reference
 */
interface IWGRPassWrapper {
	index?: number;
	name?: string;
	node?: IWGRenderPassNode;
	colorAttachments?: WGRPColorAttachmentImpl[];
	cmdWrapper?: WGRCmdWrapper;
	rcommands?: GPUCommandBuffer[];
	addEntity?(entity: Entity3D): IWGRPassWrapper;
	render?(): void;
	setColorAttachmentClearEnabledAt?(enabled: boolean, index?: number): IWGRPassWrapper;
}
export { WGRCmdWrapper, IWGRPassWrapper };


import { Entity3D } from "../../entity/Entity3D";
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { IWGRenderPassNode } from "../IWGRenderPassNode";
import { WGREntityParam } from "../WGREntityParam";
import { WGRPColorAttachmentImpl } from "./WGRPColorAttachmentImpl";
interface WGRCmdWrapper {
	uid?: number;
	rcommands: GPUCommandBuffer[];
}
/**
 * render pass reference
 */
interface WGRPassWrapperImpl {
	index?: number;
	name?: string;
	node?: IWGRenderPassNode;
	colorAttachments?: WGRPColorAttachmentImpl[];
	cmdWrapper?: WGRCmdWrapper;
	rcommands?: GPUCommandBuffer[];
	getWGCtx?(): WebGPUContext;
	addEntity?(entity: Entity3D, param?: WGREntityParam): WGRPassWrapperImpl;
	render?(): void;
	setColorAttachmentClearEnabledAt?(enabled: boolean, index?: number): WGRPassWrapperImpl;
}
export { WGRCmdWrapper, WGRPassWrapperImpl };

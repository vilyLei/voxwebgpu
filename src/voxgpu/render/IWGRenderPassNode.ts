import IColor4 from "../material/IColor4";
import {IWGRPassNodeBuilder} from "./IWGRPassNodeBuilder";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { Entity3D } from "../entity/Entity3D";
import { WGRPColorAttachmentImpl } from "./pipeline/WGRPColorAttachmentImpl";
import Camera from "../view/Camera";

interface IWGRenderPassNode extends IWGRPassNodeBuilder {
	enabled: boolean;
	camera: Camera;
	uid: number;
	clearColor: IColor4;
	rcommands: GPUCommandBuffer[];
	colorAttachments: WGRPColorAttachmentImpl[];
	addEntity(entity: Entity3D): void;
	setColorAttachmentClearEnabledAt(enabled: boolean, index?: number): void;
	runBegin(): void;
	runEnd(): void;
	run(): void;
	render(): void;
}
export { IWGRenderPassNode };

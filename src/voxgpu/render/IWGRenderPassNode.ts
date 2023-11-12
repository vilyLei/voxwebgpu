import IColor4 from "../material/IColor4";
import {IWGRPassNodeBuilder} from "./IWGRPassNodeBuilder";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";

import { Entity3D } from "../entity/Entity3D";
interface IWGRenderPassNode extends IWGRPassNodeBuilder {
	enabled: boolean;
	uid: number;
	clearColor: IColor4;
	rcommands: GPUCommandBuffer[];
	addEntity(entity: Entity3D): void;
	setColorAttachmentClearEnabledAt(enabled: boolean, index?: number): void;
	runBegin(): void;
	runEnd(): void;
	run(): void;
}
export { IWGRenderPassNode };

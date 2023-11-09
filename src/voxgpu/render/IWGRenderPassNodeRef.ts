import IColor4 from "../material/IColor4";
import {IWGRPassNodeBuilder} from "./IWGRPassNodeBuilder";

import { Entity3D } from "../entity/Entity3D";
interface IWGRenderPassNodeRef extends IWGRPassNodeBuilder {
	enabled: boolean;
	uid: number;
	clearColor: IColor4;
	addEntity(entity: Entity3D): void;
}
export { IWGRenderPassNodeRef };

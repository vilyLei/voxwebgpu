import { Entity3D, Entity3DParam } from "../entity/Entity3D";
import { WGREntityNode } from "../render/WGREntityNode";
import { WGRenderUnitBlock } from "../render/WGRenderUnitBlock";
import { IWGRPassNodeBuilder } from "../render/IWGRPassNodeBuilder";

interface WGWaitEntityNode {

	syncSort?: boolean;
	entity: Entity3D;
	rever: number;
	builder: IWGRPassNodeBuilder;
	node: WGREntityNode;
	block: WGRenderUnitBlock;
	entityParam?: Entity3DParam;

}
export { WGWaitEntityNode };

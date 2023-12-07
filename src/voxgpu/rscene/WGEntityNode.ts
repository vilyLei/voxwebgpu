import { Entity3D } from "../entity/Entity3D";
import { WGREntityParam } from "../render/WGREntityParam";
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
	entityParam?: WGREntityParam;

}
export { WGWaitEntityNode };

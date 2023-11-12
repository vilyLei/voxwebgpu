
import { Entity3D } from "../entity/Entity3D";
import { WGRUnitState } from "../render/WGRUnitState";
class WGREntityNode {

    entity: Entity3D;
    blockid = -1;
    entityid = -1;
	readonly rstate = new WGRUnitState();
    constructor(){}
}
export { WGREntityNode }
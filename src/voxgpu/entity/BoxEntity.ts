import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import BoxGeometry from "../geometry/primitive/BoxGeometry";
import IVector3 from "../math/IVector3";
import Vector3 from "../math/Vector3";

interface BoxEntityParam extends Entity3DParam {
	minPos?: IVector3,
	maxPos?: IVector3,
}
class BoxEntity extends PrimitiveEntity {
	constructor(param?: BoxEntityParam) {
		super(param);
	}

	protected getGeometryData(param: BoxEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.minPos === undefined) param.minPos = new Vector3(-50,-50,-50);
		if (param.maxPos === undefined) param.maxPos = new Vector3(50,50,50);
		let box = new BoxGeometry();
		box.initialize(param.minPos, param.maxPos);
		return box;
	}
}
export { BoxEntity };
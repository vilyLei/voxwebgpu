import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import BoxGeometry from "../geometry/primitive/BoxGeometry";
import Vector3 from "../math/Vector3";

interface BoxEntityParam extends Entity3DParam {
	minPos?: Vector3DataType;
	maxPos?: Vector3DataType;
}
class BoxEntity extends PrimitiveEntity {
	constructor(param?: BoxEntityParam) {
		super(param);
	}

	protected getGeometryData(param: BoxEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.minPos === undefined) param.minPos = [-50,-50,-50];
		if (param.maxPos === undefined) param.maxPos = [50,50,50];
		return new BoxGeometry().initialize(param.minPos, param.maxPos);
	}
}
export { BoxEntity };

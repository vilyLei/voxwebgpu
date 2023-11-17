import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import BoxGeometry from "../geometry/primitive/BoxGeometry";
import Vector3 from "../math/Vector3";

interface CubeEntityParam extends PrimitiveEntityParam {
	cubeSize?: number;
}
class CubeEntity extends PrimitiveEntity {
	constructor(param?: CubeEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CubeEntityParam): GeometryBase {

		if (!param) param = {};

		let h = 50;

		if(param.cubeSize !== undefined) {
			h = Math.abs(param.cubeSize * 0.5);
		}
		const minPos = [-h,-h,-h];
		const maxPos = [h, h, h];
		return new BoxGeometry().initialize(minPos, maxPos);
	}
}
export { CubeEntity };

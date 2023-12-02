import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import BoxGeometry from "../geometry/primitive/BoxGeometry";
import Vector3 from "../math/Vector3";

interface CubeEntityParam extends PrimitiveEntityParam {
	cubeSize?: number;
	normalScale?: number;
}
class CubeEntity extends PrimitiveEntity {
	constructor(param?: CubeEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CubeEntityParam): GeometryBase {

		if (!param) param = {};

		let h = 50;
		let g = new BoxGeometry();

		if(param.cubeSize !== undefined) {
			h = Math.abs(param.cubeSize * 0.5);
		}
		if(param.normalScale !== undefined) {
			g.normalScale = param.normalScale;
		}
		const minPos = [-h,-h,-h];
		const maxPos = [h, h, h];
		return g.initialize(minPos, maxPos);
	}
}
export { CubeEntity };

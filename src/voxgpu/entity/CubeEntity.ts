import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import BoxGeometry from "../geometry/primitive/BoxGeometry";
import Vector3 from "../math/Vector3";

interface CubeEntityParam extends Entity3DParam {
	cubeSize?: number
}
class CubeEntity extends PrimitiveEntity {
	constructor(param?: CubeEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CubeEntityParam): GeometryBase {

		if (!param) param = {};

		const minPos = new Vector3(-50,-50,-50);
		const maxPos = new Vector3(50,50,50);

		if(param.cubeSize !== undefined) {
			const h = Math.abs(param.cubeSize * 0.5);
			minPos.setXYZ(-h, -h, -h);
			maxPos.setXYZ(h, h, h);
		}
		let g = new BoxGeometry();
		g.initialize(minPos, maxPos);
		return g;
	}
}
export { CubeEntity };

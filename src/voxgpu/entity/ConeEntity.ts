import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import ConeGeometry from "../geometry/primitive/ConeGeometry";

interface ConeEntityParam extends PrimitiveEntityParam {
	radius?: number;
	height?: number;
	rings?: number;
	alignYRatio?: number;
}
class ConeEntity extends PrimitiveEntity {
	constructor(param?: ConeEntityParam) {
		super(param);
	}

	protected getGeometryData(param: ConeEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100.0;
		if (param.height === undefined) param.height = 200.0;
		if (param.rings === undefined) param.rings = 20;
		if (param.alignYRatio === undefined) param.alignYRatio = -0.5;
		let g = new ConeGeometry();
		g.initialize(param.radius, param.height, param.rings, param.alignYRatio);
		return g;
	}
}
export { ConeEntity };

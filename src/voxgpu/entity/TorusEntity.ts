import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import TorusGeometry from "../geometry/primitive/TorusGeometry";

interface TorusEntityParam extends PrimitiveEntityParam {
	radius?: number;
	axisRadius?: number;
	rings?: number;
	segments?: number;
	/**
	 * Possible values are: 0, 1, 2
	 */
	axisType?: number;
}
class TorusEntity extends PrimitiveEntity {
	constructor(param?: TorusEntityParam) {
		super(param);
	}
	protected getGeometryData(param: TorusEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100;
		if (param.axisRadius === undefined) param.axisRadius = 30;
		if (param.rings === undefined) param.rings = 20;
		if (param.segments === undefined) param.segments = 10;
		if (param.axisType === undefined) param.axisType = 0;

		let g = new TorusGeometry();
		g.axisType = param.axisType;
		g.initialize(param.radius, param.axisRadius, param.rings, param.segments);
		return g;
	}
}
export { TorusEntity };

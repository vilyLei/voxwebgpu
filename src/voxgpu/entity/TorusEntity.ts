import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import TorusGeometry from "../geometry/primitive/TorusGeometry";

interface TorusEntityParam extends PrimitiveEntityParam {
	radius?: number;
	axisRadius?: number;
	longitudeNumSegments?: number;
	latitudeNumSegments?: number;
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
		if (param.radius === undefined) param.radius = 100.0;
		if (param.axisRadius === undefined) param.axisRadius = 30.0;
		if (param.longitudeNumSegments === undefined) param.longitudeNumSegments = 10;
		if (param.latitudeNumSegments === undefined) param.latitudeNumSegments = 20;
		if (param.axisType === undefined) param.axisType = 0;

		let g = new TorusGeometry();
		g.axisType = param.axisType;
		g.initialize(param.radius, param.axisRadius, param.longitudeNumSegments, param.latitudeNumSegments);
		return g;
	}
}
export { TorusEntity };

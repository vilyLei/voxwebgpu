import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";

interface PlaneEntityParam extends Entity3DParam {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	axisType?: number;
}
class PlaneEntity extends PrimitiveEntity {
	constructor(param?: PlaneEntityParam) {
		super(param);
	}
	protected getGeometryData(param: PlaneEntityParam): GeometryBase {
		let geom = new RectPlaneGeometry();
		geom.axisType = param.axisType === undefined ? 0 : param.axisType;
		geom.initialize(
			param.x === undefined ? -50 : param.x,
			param.y === undefined ? -50 : param.y,
			param.width === undefined ? 100 : param.width,
			param.height === undefined ? 100 : param.height,
			);
		return geom;
	}
}
export { PlaneEntity };

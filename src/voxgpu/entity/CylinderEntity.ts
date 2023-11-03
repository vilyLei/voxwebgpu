import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import CylinderGeometry from "../geometry/primitive/CylinderGeometry";

interface CylinderEntityParam extends Entity3DParam {
	radius?: number;
	height?: number;
	longitudeNumSegments?: number;
	latitudeNumSegments?: number;
}
class CylinderEntity extends PrimitiveEntity {
	constructor(param?: CylinderEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CylinderEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100.0;
		if (param.height === undefined) param.height = 300.0;
		if (param.longitudeNumSegments === undefined) param.longitudeNumSegments = 20;
		if (param.latitudeNumSegments === undefined) param.latitudeNumSegments = 20;
		let g = new CylinderGeometry();
		g.initialize(param.radius, param.height, param.longitudeNumSegments, param.latitudeNumSegments);
		return g;
	}
}
export { CylinderEntity };

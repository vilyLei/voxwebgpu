import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import SphereGeometry from "../geometry/primitive/SphereGeometry";

interface SphereEntityParam extends PrimitiveEntityParam {
	radius?: number;
	longitudeNumSegments?: number;
	latitudeNumSegments?: number;
}
class SphereEntity extends PrimitiveEntity {
	constructor(param?: SphereEntityParam) {
		super(param);
	}

	protected getGeometryData(param: SphereEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100.0;
		if (param.longitudeNumSegments === undefined) param.longitudeNumSegments = 20;
		if (param.latitudeNumSegments === undefined) param.latitudeNumSegments = 20;
		let sph = new SphereGeometry();
		sph.initialize(param.radius, param.longitudeNumSegments, param.latitudeNumSegments, false);
		return sph;
	}
}
export { SphereEntity };

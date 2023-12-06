import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import SphereGeometry from "../geometry/primitive/SphereGeometry";

interface SphereEntityParam extends PrimitiveEntityParam {
	radius?: number;
	rings?: number;
	segments?: number;
}
class SphereEntity extends PrimitiveEntity {
	constructor(param?: SphereEntityParam) {
		super(param);
	}

	protected getGeometryData(param: SphereEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100.0;
		if (param.rings === undefined) param.rings = 20;
		if (param.segments === undefined) param.segments = 20;
		let sph = new SphereGeometry();
		sph.initialize(param.radius, param.rings, param.segments, false);
		return sph;
	}
}
export { SphereEntity };

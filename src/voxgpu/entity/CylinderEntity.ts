import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import CylinderGeometry from "../geometry/primitive/CylinderGeometry";

interface CylinderEntityParam extends PrimitiveEntityParam {
	radius?: number;
	height?: number;
	rings?: number;
	segments?: number;
	uvType?: number;
	alignYRatio?: number;
}
class CylinderEntity extends PrimitiveEntity {
	constructor(param?: CylinderEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CylinderEntityParam): GeometryBase {
		if (!param) param = {};
		if (param.radius === undefined) param.radius = 100.0;
		if (param.height === undefined) param.height = 300.0;
		if (param.rings === undefined) param.rings = 20;
		if (param.segments === undefined) param.segments = 20;
		if (param.uvType === undefined) param.uvType = 1;
		if (param.alignYRatio === undefined) param.alignYRatio = -0.5;
		let g = new CylinderGeometry();
		g.initialize(param.radius, param.height, param.rings, param.segments,param.uvType,param.alignYRatio);
		return g;
	}
}
export { CylinderEntity };

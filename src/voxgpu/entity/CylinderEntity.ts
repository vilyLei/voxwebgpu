import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import CylinderGeometry from "../geometry/primitive/CylinderGeometry";

interface CylinderEntityParam extends Entity3DParam {
	radius?: number;
	height?: number;
	longitudeNumSegments?: number;
	latitudeNumSegments?: number;
	uvType?: number;
	alignYRatio?: number;
}
class CylinderEntity extends PrimitiveEntity {
	constructor(param?: CylinderEntityParam) {
		super(param);
	}

	protected getGeometryData(param: CylinderEntityParam): GeometryBase {
		if (!param) param = {};
		// param.radius ??= 100;
		// param.height ??= 300;
		// param.longitudeNumSegments ??= 20;
		// param.latitudeNumSegments ??= 20;
		// param.uvType ??= 1;
		// param.alignYRatio ??= -0.5;
		if (param.radius === undefined) param.radius = 100.0;
		if (param.height === undefined) param.height = 300.0;
		if (param.longitudeNumSegments === undefined) param.longitudeNumSegments = 20;
		if (param.latitudeNumSegments === undefined) param.latitudeNumSegments = 20;
		if (param.uvType === undefined) param.uvType = 1;
		if (param.alignYRatio === undefined) param.alignYRatio = -0.5;
		let g = new CylinderGeometry();
		g.initialize(param.radius, param.height, param.longitudeNumSegments, param.latitudeNumSegments,param.uvType,param.alignYRatio);
		return g;
	}
}
export { CylinderEntity };

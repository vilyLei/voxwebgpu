import { Entity3DParam, PrimitiveEntity } from "./PrimitiveEntity";
import GeometryBase from "../geometry/primitive/GeometryBase";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import Extent2 from "../math/Extent2";

interface PlaneEntityParam extends Entity3DParam {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	axisType?: number;
	extent?: Extent2DataType;
}
const __$Extent = new Extent2();
class PlaneEntity extends PrimitiveEntity {
	constructor(param?: PlaneEntityParam) {
		super(param);
	}
	protected getGeometryData(param: PlaneEntityParam): GeometryBase {
		let geom = new RectPlaneGeometry();
		geom.axisType = param.axisType === undefined ? 0 : param.axisType;
		if(param.extent !== undefined) {
			const t = __$Extent;
			t.setExtent(param.extent);
			geom.initialize( t.x, t.y, t.width, t.height);
		}else {
			geom.initialize(
				param.x === undefined ? -50 : param.x,
				param.y === undefined ? -50 : param.y,
				param.width === undefined ? 100 : param.width,
				param.height === undefined ? 100 : param.height,
			);
		}
		return geom;
	}
}
export { PlaneEntity };

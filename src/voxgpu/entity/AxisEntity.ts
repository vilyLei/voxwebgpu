import Color4 from "../material/Color4";
import Vector3 from "../math/Vector3";
import { Line3DEntityParam, Line3DEntity } from "./Line3DEntity";

interface AxisEntityParam extends Line3DEntityParam {

	axisLength?: number;
	xAxisLength?: number;
	yAxisLength?: number;
	zAxisLength?: number;

	xAxisColor?: ColorDataType;
	yAxisColor?: ColorDataType;
	zAxisColor?: ColorDataType;
}

function buildPosData(param: AxisEntityParam): void {

	let size = param.axisLength !== undefined ? param.axisLength : 200;
	let sizeX = param.xAxisLength;
	let sizeY = param.yAxisLength;
	let sizeZ = param.zAxisLength;
	sizeX = sizeX !== undefined ? sizeX : size;
	sizeY = sizeY !== undefined ? sizeY : size;
	sizeZ = sizeZ !== undefined ? sizeZ : size;

	let v0 = new Vector3();
	let vx = new Vector3(sizeX);
	let vy = new Vector3(0, sizeY);
	let vz = new Vector3(0, 0, sizeZ);
	let linePositions = [v0, vx, v0, vy, v0, vz];
	param.linePositions = linePositions;
}

function buildColorData(param: AxisEntityParam): void {

	let c = new Color4(1.0, 0.0, 0.0);
	let cx = param.xAxisColor ? c.toWhite().setColor(param.xAxisColor) : c;
	c = new Color4(0.0, 1.0, 0.0);
	let cy = param.yAxisColor ? c.toWhite().setColor(param.yAxisColor) : c;
	c = new Color4(0.0, 0.0, 1.0);
	let cz = param.zAxisColor ? c.toWhite().setColor(param.zAxisColor) : c;

	let lineColors = [cx, cx, cy, cy, cz, cz];
	param.lineColors = lineColors;
}
class AxisEntity extends Line3DEntity {
	constructor(param?: AxisEntityParam) {
		if(!param) param = {};

		param.dashedData = true;
		if( !param.linePositions ) {
			buildPosData( param );
		}
		if( !param.lineColors ) {
			buildColorData( param );
		}
		super(param);
	}
}
export { AxisEntityParam, AxisEntity };

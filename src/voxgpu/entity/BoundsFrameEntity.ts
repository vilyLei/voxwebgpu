import IAABB from "../cgeom/IAABB";
import IOBB from "../cgeom/IOBB";
import Color4 from "../material/Color4";
import Vector3 from "../math/Vector3";
import { Line3DEntityParam, Line3DEntity } from "./Line3DEntity";

interface BoundsFrameEntityParam extends Line3DEntityParam {

	minPos?: Vector3DataType;
	maxPos?: Vector3DataType;

	obb?: IOBB;
	obbFrameScale?: number;
	bounds?: IAABB;

	frameColors?: ColorDataType[];
	frameColor?: ColorDataType;
	vertices8?: Vector3DataType[];
}
const __v8List = [
	new Vector3(), new Vector3(), new Vector3(), new Vector3(),
	new Vector3(), new Vector3(), new Vector3(), new Vector3()
];
function createPosDataWith8Pos(vertices8: Vector3DataType[]): Vector3DataType[] {
	const vps = __v8List;
	let len = vertices8.length < 8 ? vertices8.length : 8;
	for(let i = 0; i < len; ++i) {
		vps[i].setXYZ(0,0,0).setVector4(vertices8[i]);
	}
	// let posarr = [
	// 	// bottom frame
	// 	vps[0].x, vps[0].y, vps[0].z, vps[1].x, vps[1].y, vps[1].z,
	// 	vps[1].x, vps[1].y, vps[1].z, vps[2].x, vps[2].y, vps[2].z,
	// 	vps[2].x, vps[2].y, vps[2].z, vps[3].x, vps[3].y, vps[3].z,
	// 	vps[3].x, vps[3].y, vps[3].z, vps[0].x, vps[0].y, vps[0].z,
	// 	// wall frame
	// 	vps[0].x, vps[0].y, vps[0].z, vps[4].x, vps[4].y, vps[4].z,
	// 	vps[1].x, vps[1].y, vps[1].z, vps[5].x, vps[5].y, vps[5].z,
	// 	vps[2].x, vps[2].y, vps[2].z, vps[6].x, vps[6].y, vps[6].z,
	// 	vps[3].x, vps[3].y, vps[3].z, vps[7].x, vps[7].y, vps[7].z,
	// 	// top frame
	// 	vps[4].x, vps[4].y, vps[4].z, vps[5].x, vps[5].y, vps[5].z,
	// 	vps[5].x, vps[5].y, vps[5].z, vps[6].x, vps[6].y, vps[6].z,
	// 	vps[6].x, vps[6].y, vps[6].z, vps[7].x, vps[7].y, vps[7].z,
	// 	vps[7].x, vps[7].y, vps[7].z, vps[4].x, vps[4].y, vps[4].z
	// ];
	let linePositions = [
		vps[0], vps[1], vps[1], vps[2], vps[2], vps[3], vps[3], vps[0],
		vps[0], vps[4], vps[1], vps[5], vps[2], vps[6], vps[3], vps[7],
		vps[4], vps[5], vps[5], vps[6], vps[6], vps[7], vps[7], vps[4]

	];
	return linePositions;
}


function createPosList8WithOBB(obb: IOBB, scale: number = 1.0): Vector3DataType[] {

	// bottom frame plane wit "-y axes"
	let et = obb.extent.clone().scaleBy(scale);

	let cv = obb.center;
	let max_vx = obb.axes[0].clone().scaleBy(et.x);
	let max_vy = obb.axes[1].clone().scaleBy(et.y);
	let max_vz = obb.axes[2].clone().scaleBy(et.z);
	let min_vx = max_vx.clone().scaleBy(-1);
	let min_vy = max_vy.clone().scaleBy(-1);
	let min_vz = max_vz.clone().scaleBy(-1);

	// 与"y"轴垂直的center positon之上的面
	let v0 = max_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);// max pos
	let v1 = max_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
	let v2 = min_vx.clone().addBy(max_vy).addBy(min_vz).addBy(cv);
	let v3 = min_vx.clone().addBy(max_vy).addBy(max_vz).addBy(cv);
	// 与"y"轴垂直的center positon之下的面
	let p0 = max_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);
	let p1 = max_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
	let p2 = min_vx.clone().addBy(min_vy).addBy(min_vz).addBy(cv);
	let p3 = min_vx.clone().addBy(min_vy).addBy(max_vz).addBy(cv);

	let ls = [v0, v1, v2, v3, p0, p1, p2, p3];
	return ls;
}

function buildPosData(param: BoundsFrameEntityParam): void {
	if(param.obb) {
		let scale = param.obbFrameScale !== undefined ? param.obbFrameScale : 1;
		param.vertices8 = createPosList8WithOBB( param.obb, scale );
	}
	if(param.vertices8) {
		param.linePositions = createPosDataWith8Pos( param.vertices8 );
		return;
	}
	let min = new Vector3();
	let max = new Vector3();
	let flag = true;
	if(param.bounds !== undefined) {
		const b = param.bounds;
		min.setVector4(b.min);
		max.setVector4(b.max);
		flag = false;
	}
	if(param.minPos !== undefined) {
		min.setVector4(param.minPos);
		flag = false;
	}
	if(param.maxPos !== undefined) {
		max.setVector4(param.maxPos);
		flag = false;
	}
	if(flag) {
		min.setXYZ(-50, -50, -50);
		max.setXYZ(50, 50, 50);
	}

	let linePositions = [
		new Vector3( min.x, min.y, min.z ), new Vector3(min.x, min.y, max.z),
		new Vector3( min.x, min.y, min.z ), new Vector3(max.x, min.y, min.z),
		new Vector3( min.x, min.y, max.z ), new Vector3(max.x, min.y, max.z),
		new Vector3( max.x, min.y, min.z ), new Vector3(max.x, min.y, max.z),
		// wall frame
		new Vector3( min.x, min.y, min.z ), new Vector3( min.x, max.y, min.z ),
		new Vector3( min.x, min.y, max.z ), new Vector3( min.x, max.y, max.z ),
		new Vector3( max.x, min.y, min.z ), new Vector3( max.x, max.y, min.z ),
		new Vector3( max.x, min.y, max.z ), new Vector3( max.x, max.y, max.z ),
		// top frame plane: +y
		new Vector3( min.x, max.y, min.z ), new Vector3( min.x, max.y, max.z ),
		new Vector3( min.x, max.y, min.z ), new Vector3( max.x, max.y, min.z ),
		new Vector3( min.x, max.y, max.z ), new Vector3( max.x, max.y, max.z ),
		new Vector3( max.x, max.y, min.z ), new Vector3( max.x, max.y, max.z ),
	]
	param.linePositions = linePositions;
}

function buildColorData(param: BoundsFrameEntityParam): void {
	let c = new Color4();

	let len = param.linePositions.length;
	param.lineColors = new Array(len) as ColorDataType[];
	let cs = param.frameColors;
	let csLen = Math.min(Math.floor(len/2), cs.length);
	for(let i = 0; i < csLen; ++i) {
		const k = i * 2;
		if(cs[i]) {
			param.lineColors[ k ] = cs[i];
			param.lineColors[ k  + 1] = cs[i];
		}else {
			param.lineColors[ k ] = c;
			param.lineColors[ k  + 1] = c;
		}
	}

	for(let i = csLen * 2; i < len; ++i) {
		param.lineColors[i] = c;
	}
}
class BoundsFrameEntity extends Line3DEntity {
	constructor(param?: BoundsFrameEntityParam) {
		if(!param) param = {};

		param.dashedData = true;
		if( !param.linePositions ) {
			buildPosData( param );
		}
		if( !param.lineColors && param.frameColors ) {
			buildColorData( param );
		}
		super(param);
		if(param.frameColor) {
			this.color = param.frameColor;
		}
	}
}
export { BoundsFrameEntityParam, BoundsFrameEntity };

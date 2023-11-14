import Color4 from "../material/Color4";
import IVector3 from "../math/IVector3";
import Vector3 from "../math/Vector3";
import { Line3DEntityParam, Line3DEntity } from "./Line3DEntity";

interface RectLineGridEntityParam extends Line3DEntityParam {
	minPos?: Vector3DataType;
	maxPos?: Vector3DataType;
	stepsTotal?: number;
}

function buildGridMesh(minV3: Vector3DataType, maxV3: Vector3DataType, stepsTotal = 10): IVector3[] {
	if (stepsTotal < 1) stepsTotal = 1;
	let minV = new Vector3().setVector3(minV3);
	let maxV = new Vector3().setVector3(maxV3);
	// xoz
	let type = 1;
	let dv = new Vector3().subVecsTo(maxV, minV);
	if (dv.z < 0.1) {
		// xoy
		type = 0;
	} else if (dv.x < 0.1) {
		// yoz
		type = 2;
	}
	dv.scaleBy(1.0 / stepsTotal);
	let rn = stepsTotal + 1;
	// let cn = stepsTotal + 1;

	let pv0 = minV.clone();
	let pv1 = maxV.clone();
	let pv2 = maxV.clone();
	let pvs: IVector3[] = new Array(rn * 2);
	let j = 0;
	// xoz
	if (type == 1) {
		for (let i = 0; i < rn; ++i) {
			pv0.x = minV.x + dv.x * i;
			pv0.z = minV.z;
			pv1.copyFrom(pv0);
			pv1.z = maxV.z;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();

			pv2.copyFrom(pv0);
			pv0.x = pv1.z;
			pv0.z = pv1.x;
			pv1.x = pv2.z;
			pv1.z = pv2.x;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();
		}
	} else if (type == 2) {
		// yoz
		for (let i = 0; i < rn; ++i) {
			pv0.y = minV.y + dv.y * i;
			pv0.z = minV.z;
			pv1.copyFrom(pv0);
			pv1.z = maxV.z;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();

			pv2.copyFrom(pv0);
			pv0.y = pv1.z;
			pv0.z = pv1.y;
			pv1.y = pv2.z;
			pv1.z = pv2.y;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();
		}
	} else {
		// xoy
		for (let i = 0; i < rn; ++i) {
			pv0.x = minV.x + dv.x * i;
			pv0.y = minV.y;
			pv1.copyFrom(pv0);
			pv1.y = maxV.y;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();

			pv2.copyFrom(pv0);
			pv0.x = pv1.y;
			pv0.y = pv1.x;
			pv1.x = pv2.y;
			pv1.y = pv2.x;
			pvs[j++] = pv0.clone();
			pvs[j++] = pv1.clone();
		}
	}
	return pvs;
}

function buildPosData(param: RectLineGridEntityParam): void {
	if(param.minPos === undefined) {
		param.minPos = [-600, 0, -600];
	}
	if(param.maxPos === undefined) {
		param.maxPos = [600, 0, 600];
	}
	if(param.stepsTotal === undefined) {
		param.stepsTotal = 20;
	}
	param.linePositions = buildGridMesh(param.minPos, param.maxPos, param.stepsTotal);
}

function buildColorData(param: RectLineGridEntityParam): void {

}
class RectLineGridEntity extends Line3DEntity {
	constructor(param?: RectLineGridEntityParam) {
		if (!param) param = {};

		param.dashedData = true;
		if (!param.linePositions) {
			buildPosData(param);
		}
		if (!param.lineColors) {
			buildColorData(param);
		}
		super(param);
	}
}
export { RectLineGridEntityParam, RectLineGridEntity };

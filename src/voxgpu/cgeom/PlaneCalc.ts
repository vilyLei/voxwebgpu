/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";

class PlaneCalc {
	static IntersectBoo = false;
	static IntersectSatus = 0;
	static PlaneCalcIntersectSphere(pnv: Vector3, pdis: number, cv: Vector3, radius: number): void {
		PlaneCalc.IntersectBoo = false;
		PlaneCalc.IntersectSatus = 0;
		pdis = pnv.dot(cv) - pdis;
		if (pdis > MathConst.MATH_MIN_POSITIVE) {
			PlaneCalc.IntersectBoo = pdis <= radius;
			PlaneCalc.IntersectSatus = 1;
		} else if (pdis < MathConst.MATH_MAX_NEGATIVE) {
			PlaneCalc.IntersectBoo = -pdis <= radius;
			PlaneCalc.IntersectSatus = -1;
		}
	}
	static CalcPVCloseV(planeNV: Vector3, planeDis: number, posV: Vector3, outV: Vector3): void {
		let value: number = planeDis - posV.dot(planeNV);
		outV.setTo(value * planeNV.x, value * planeNV.y, value * planeNV.z);
		outV.addBy(posV);
	}
	static CalcPVCloseV2(pnv: Vector3, pd: number, posV: Vector3, outV: Vector3): void {
		let value: number = pd - posV.dot(pnv);
		outV.setTo(value * pnv.x, value * pnv.y, value * pnv.z);
		//outV.scaleBy(value);
		outV.addBy(posV);
	}
	static IntersectionSLV2(planeNV: Vector3, planeDis: number, sl_pos: Vector3, sl_tv: Vector3, outV: Vector3): number {
		// intersection or parallel
		let td: number = planeNV.dot(sl_tv);
		if (td > MathConst.MATH_MIN_POSITIVE || td < MathConst.MATH_MAX_NEGATIVE) {
			// intersection
			let dis: number = planeNV.dot(sl_pos) - planeDis;
			outV.x = sl_tv.x * 100000.0 + sl_pos.x;
			outV.y = sl_tv.y * 100000.0 + sl_pos.y;
			outV.z = sl_tv.z * 100000.0 + sl_pos.z;
			//
			td = planeNV.dot(outV) - planeDis;
			td = dis / (dis - td);
			outV.subtractBy(sl_pos);
			outV.scaleBy(td);
			outV.addBy(sl_pos);
			return 1;
		}
		td = planeNV.dot(sl_pos) - planeDis;
		if (td <= MathConst.MATH_MIN_POSITIVE || td >= MathConst.MATH_MAX_NEGATIVE) {
			// plane contains line
			outV.copyFrom(sl_pos);
			return 2;
		}
		return 0;
	}
}

export default PlaneCalc;
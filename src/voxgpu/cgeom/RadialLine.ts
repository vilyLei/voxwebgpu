/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import AbsGeomBase from "../cgeom/AbsGeomBase";

class RadialLine extends AbsGeomBase {
	static __tAv = new Vector3();
	tv = new Vector3(1.0, 0.0, 0.0);

	update(): void {
		this.tv.normalize();
	}
	updateFast(): void {
		this.tv.normalize();
	}
	// 射线和三个点表示的三角形是否相交
	static IntersectionTri(rlpv: Vector3, rltv: Vector3, triva: Vector3, trivb: Vector3, trivc: Vector3, outV: Vector3): number {
		return 0;
	}
	// 射线和两个点表示的线段是否相交
	static IntersectionLS(rlpv: Vector3, rltv: Vector3, lspva: Vector3, lspvb: Vector3, outV: Vector3, radius: number = 1.0): number {
		let pv: Vector3 = RadialLine.__tAv;
		pv.copyFrom(lspvb);
		pv.subtractBy(lspva);
		pv.normalize();
		Vector3.Cross(rltv, pv, outV);
		outV.normalize();
		pv.w = outV.dot(rlpv) - outV.dot(lspvb);
		if (Math.abs(pv.w) <= radius) {
			// 两条直线已经相交
			// outV 和 rlpv rltv 计算构成了一个平面
			outV.crossBy(rltv);
			outV.normalize();
			outV.w = outV.dot(rlpv);
			// 计算 lspva 所在的直线与平面的交点
			//let tv2:Vector3 = AbsGeomBase.__tV1;
			pv.w = (outV.w - outV.dot(lspva)) / (pv.dot(outV));
			outV.copyFrom(pv);
			outV.scaleBy(pv.w);
			outV.addBy(lspva);
			pv.copyFrom(outV);
			pv.subtractBy(lspva);
			let pv1: Vector3 = AbsGeomBase.__tV1;
			pv1.copyFrom(outV);
			pv1.subtractBy(lspvb);
			if (pv.dot(pv1) <= 0.0) {
				return 1;
			}
		}
		return 0;
	}
	/**
	 * @param rlpv 射线起点
	 * @param rltv  射线朝向
	 * @param cv 球心坐标
	 * @param radius 球体半径
	 * @param outV 如果相交，记录下交点
	 * @returns 检测得到距离射线起点最近的点, 1表示相交, 0表示不相交
	 */
	static IntersectioNearSphere2(rlpv: Vector3, rltv: Vector3, cv: Vector3, radius: number, outV: Vector3): number {
		let pv: Vector3 = RadialLine.__tAv;
		pv.x = cv.x - rlpv.x;
		pv.y = cv.y - rlpv.y;
		pv.z = cv.z - rlpv.z;

		pv.w = pv.dot(rltv);
		radius *= radius;
		if (pv.w > MathConst.MATH_MIN_POSITIVE) {
			outV.copyFrom(rltv);
			outV.scaleBy(pv.w);
			outV.subtractBy(pv);
			pv.x = outV.getLengthSquared();

			if (pv.x <= radius) {
				// 远距离
				//outV.w = pv.w + Math.sqrt(radius * radius - outV.getLengthSquared());
				// 取近距离
				pv.w -= Math.sqrt(radius - pv.x);
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return 1;
			}
		}
		else if (pv.getLengthSquared() <= radius) {
			outV.copyFrom(rltv);
			outV.scaleBy(pv.w);
			outV.subtractBy(pv);
			pv.x = outV.getLengthSquared();

			if (pv.x <= radius) {
				// 取远距离
				pv.w += Math.sqrt(radius - pv.x);
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return 1;
			}
		}
		return 0;
	}
	// @return 检测得到距离射线起点最近的点, 1表示相交,0表示不相交
	static IntersectioNearSphere(rlpv: Vector3, rltv: Vector3, cv: Vector3, radius: number, outV: Vector3): number {
		let pv: Vector3 = RadialLine.__tAv;
		pv.x = cv.x - rlpv.x;
		pv.y = cv.y - rlpv.y;
		pv.z = cv.z - rlpv.z;
		pv.w = pv.dot(rltv);
		if (pv.w > MathConst.MATH_MIN_POSITIVE) {
			outV.x = pv.x - pv.w * rltv.x;
			outV.y = pv.y - pv.w * rltv.y;
			outV.z = pv.z - pv.w * rltv.z;
			outV.x = outV.getLengthSquared();
			outV.w = radius * radius;
			if (outV.x <= outV.w) {
				// rlpv到远交点记作XP, rlpv到球心记作CP, CP到远交点记作RP
				// 通过余弦定律得到一元二次方程得并且解这个方程得到 XP 的距离
				// 获得CP距离的平方值
				outV.x = pv.getLengthSquared();
				// RP距离的平方值 减去 CP距离的平方值
				outV.z = outV.w - outV.x;
				//	// 获得CP距离值
				//	outV.w = Math.sqrt(outV.x);
				// 准备计算 CP和XP 之间夹角a的余弦值, cos(a)值
				pv.normalize();
				// cos(a) 值 和 CP距离值相乘
				//pv.y = pv.dot(rltv) * outV.w;
				outV.y = pv.dot(rltv) * Math.sqrt(outV.x);
				// 求解方程的根,得到近些的距离
				pv.w = (-outV.y + Math.sqrt(outV.y * outV.y + 4.0 * outV.z)) * 0.5;
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return 1;
			}
		}
		else {
			outV.x = pv.getLengthSquared();
			outV.w = radius * radius;
			if (outV.x <= outV.w) {
				outV.z = outV.w - outV.x;
				pv.normalize();
				outV.y = pv.dot(rltv) * Math.sqrt(outV.x);
				// 求解方程的根,得到远些的距离
				pv.w = (-outV.y + Math.sqrt(outV.y * outV.y + 4.0 * outV.z)) * 0.5;
				outV.copyFrom(rltv);
				outV.scaleBy(pv.w);
				outV.addBy(rlpv);
				outV.w = 1.0;
				return 1;
			}
		}
		return 0;
	}
	static IntersectSphere(rlpv: Vector3, rltv: Vector3, cv: Vector3, radius: number): boolean {
		let pv: Vector3 = RadialLine.__tAv;
		pv.x = cv.x - rlpv.x;
		pv.y = cv.y - rlpv.y;
		pv.z = cv.z - rlpv.z;
		pv.w = pv.dot(rltv);
		if (pv.w < MathConst.MATH_MIN_POSITIVE) {
			return pv.getLengthSquared() <= (radius * radius);
		}
		pv.x -= pv.w * rltv.x;
		pv.y -= pv.w * rltv.y;
		pv.z -= pv.w * rltv.z;
		return pv.getLengthSquared() <= (radius * radius);
	}
}

export default RadialLine;
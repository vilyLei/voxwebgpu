/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../math/Vector3";

class CircleCalc {
	private static s_pv0 = new Vector3();
	private static s_pv1 = new Vector3();
	static CalIntersectionTwoInXOY(cv0: Vector3, radius0: number, cv1: Vector3, radius1: number, outv0: Vector3, outv1: Vector3): void {
		let d: number = Vector3.Distance(cv0, cv1);// length cv0 -> cv1
		if (d <= (radius0 + radius1)) {
			let pv0: Vector3 = CircleCalc.s_pv0;
			let pv1: Vector3 = CircleCalc.s_pv1;
			pv1.z = pv0.z = cv0.z = cv1.z = 0.0;
			let a: number = (radius0 * radius0 - radius1 * radius1 + d * d) / (2.0 * d);
			pv1.x = cv0.x + (a / d) * (cv1.x - cv0.x);
			pv1.y = cv0.y + (a / d) * (cv1.y - cv0.y);
			pv0.x = pv1.x - cv0.x;
			pv0.y = pv1.y - cv0.y;
			let h: number = Math.sqrt(radius0 * radius0 - pv0.getLengthSquared());
			outv0.copyFrom(pv0);

			a = outv0.x;
			outv0.x = outv0.y;
			outv0.y = -1.0 * a;
			outv0.normalize();
			outv1.copyFrom(outv0);
			outv0.scaleBy(-h);
			outv0.addBy(pv1);
			outv1.scaleBy(h);
			outv1.addBy(pv1);
		}
	}
}

export default CircleCalc;
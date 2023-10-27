/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../math/Vector3";
import AbsGeomBase from "../cgeom/AbsGeomBase";
import PlaneCalc from "../cgeom/PlaneCalc";

class LineSegment extends AbsGeomBase {
	// bounds sphere squared radius
	radiusSquared = 2500.0;
	tv = new Vector3(1.0, 0.0, 0.0);
	// segment line's center
	center = new Vector3(50.0, 0.0, 0.0);
	// a 3d point's another position in straightLine
	anotherPosition = new Vector3(100, 0.0, 0.0);
	length = 100.0;
	intersectionCopSLV2(lsbpv: Vector3, lsbtv: Vector3, outV: Vector3): void {
		Vector3.Cross(this.tv, lsbtv, AbsGeomBase.__tV1);
		Vector3.Cross(this.tv, AbsGeomBase.__tV1, AbsGeomBase.__tV2);
		AbsGeomBase.__tV2.normalize();
		PlaneCalc.IntersectionSLV2(AbsGeomBase.__tV2, AbsGeomBase.__tV2.dot(this.position), lsbpv, lsbtv, outV);
		AbsGeomBase.__tV2.x = outV.x - this.position.x;
		AbsGeomBase.__tV2.y = outV.y - this.position.y;
		AbsGeomBase.__tV2.z = outV.z - this.position.z;
		let dis = AbsGeomBase.__tV2.dot(this.tv);
		if (dis < 0.0) outV.copyFrom(this.position);
		else if (dis > this.length) outV.copyFrom(this.anotherPosition);
	}
	update(): void {
		this.tv.x = this.anotherPosition.x - this.position.x;
		this.tv.y = this.anotherPosition.y - this.position.y;
		this.tv.z = this.anotherPosition.z - this.position.z;
		//
		this.length = this.tv.getLength();
		//
		this.tv.x *= 0.5;
		this.tv.y *= 0.5;
		this.tv.z *= 0.5;
		//
		this.center.x = this.position.x + this.tv.x;
		this.center.y = this.position.y + this.tv.y;
		this.center.z = this.position.z + this.tv.z;
		//
		this.radiusSquared = this.tv.getLengthSquared();
		this.tv.normalize();
	}
	updateFast(): void {
		this.update();
	}
}

export default LineSegment;
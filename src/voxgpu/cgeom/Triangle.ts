/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import AbsGeomBase from "../cgeom/AbsGeomBase";
import RadialLine from "../cgeom/RadialLine";
import StraightLine from "../cgeom/StraightLine";
import LineSegment from "../cgeom/LineSegment";
import Plane from "../cgeom/Plane";

export class Triangle extends Plane {
	// triangle three vertexes, use ccw sort
	v0 = new Vector3(100.0, 0, 0);
	v1 = new Vector3(0, 0, -100.0);
	v2 = new Vector3(0, 0, 0);
	// triangle three adges: LineSegment ls01, ls12, ls20;
	ls01 = new LineSegment();
	ls12 = new LineSegment();
	ls20 = new LineSegment();
	// bounds sphere squared radius
	radiusSquared = 100.0;
	getRandomPosition(outV: Vector3): void {

		let dis = this.ls01.length * Math.random();
		outV.x = this.ls01.position.x + dis * this.ls01.tv.x;
		outV.y = this.ls01.position.y + dis * this.ls01.tv.y;
		outV.z = this.ls01.position.z + dis * this.ls01.tv.z;

		dis = this.ls12.length * Math.random();
		outV.x += this.ls12.position.x + dis * this.ls12.tv.x;
		outV.y += this.ls12.position.y + dis * this.ls12.tv.y;
		outV.z += this.ls12.position.z + dis * this.ls12.tv.z;

		dis = this.ls20.length * Math.random();
		outV.x += this.ls20.position.x + dis * this.ls20.tv.x;
		outV.y += this.ls20.position.y + dis * this.ls20.tv.y;
		outV.z += this.ls20.position.z + dis * this.ls20.tv.z;

		outV.x *= 0.33333;
		outV.y *= 0.33333;
		outV.z *= 0.33333;
	}
	triIntersectStraightLinePos(sL: StraightLine, outV: Vector3): number {
		let flag: number = this.intersectStraightLinePos(sL, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		else if (flag == 2) {
			// plane contains line
			// test line intersect triangle
		}
		return -1;
	}
	triIntersectRadialLinePos(radL: RadialLine, outV: Vector3): number {
		let flag: number = this.intersectRadialLinePos(radL, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	    // test line intersect triangle
		//	}
		return -1;
	}
	triIntersectStraightLinePos2(sl_pos: Vector3, sl_tv: Vector3, outV: Vector3): number {
		let flag: number = this.intersectStraightLinePos2(sl_pos, sl_tv, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	    // test line intersect triangle
		//	}
		return -1;
	}
	triIntersectRadialLinePos2(rl_pos: Vector3, rl_tv: Vector3, outV: Vector3): number {
		let flag = this.intersectStraightLinePos2(rl_pos, rl_tv, outV);
		if (flag == 1) {
			flag = this.triContainsPoint(outV);
			if (flag > 0)
				return 1;
		}
		//	else if (flag == 2)
		//	{
		//	    // plane contains line
		//	}
		return -1;
	}
	triContainsPoint(pos: Vector3): number {
		let f: number = this.nv.dot(pos) - this.distance;
		if (f > MathConst.MATH_MIN_POSITIVE || f < MathConst.MATH_MAX_NEGATIVE) {
			return -1;
		}
		//
		AbsGeomBase.__tV0.x = pos.x - this.v0.x;
		AbsGeomBase.__tV0.y = pos.y - this.v0.y;
		AbsGeomBase.__tV0.z = pos.z - this.v0.z;
		Vector3.Cross(this.ls01.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//float f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		AbsGeomBase.__tV0.x = pos.x - this.v1.x;
		AbsGeomBase.__tV0.y = pos.y - this.v1.y;
		AbsGeomBase.__tV0.z = pos.z - this.v1.z;
		Vector3.Cross(this.ls12.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		AbsGeomBase.__tV0.x = pos.x - this.v2.x;
		AbsGeomBase.__tV0.y = pos.y - this.v2.y;
		AbsGeomBase.__tV0.z = pos.z - this.v2.z;
		Vector3.Cross(this.ls20.tv, AbsGeomBase.__tV0, AbsGeomBase.__tV1);
		//f = this.nv.dot(AbsGeomBase.__tV1);
		if (this.nv.dot(AbsGeomBase.__tV1) < 0) {
			return -1;
		}
		return 1;
	}
	update(): void {
		//
		let k: number = 1.0 / 3.0;
		this.position.x = k * (this.v0.x + this.v1.x + this.v2.x);
		this.position.y = k * (this.v0.y + this.v1.y + this.v2.y);
		this.position.z = k * (this.v0.z + this.v1.z + this.v2.z);
		this.nv.x = this.position.x - this.v0.x;
		this.nv.y = this.position.y - this.v0.y;
		this.nv.z = this.position.z - this.v0.z;
		this.radiusSquared = this.nv.getLengthSquared();
		//
		this.ls01.position.copyFrom(this.v0);
		this.ls01.anotherPosition.copyFrom(this.v1);
		this.ls12.position.copyFrom(this.v1);
		this.ls12.anotherPosition.copyFrom(this.v2);
		this.ls20.position.copyFrom(this.v2);
		this.ls20.anotherPosition.copyFrom(this.v0);
		//trace("tri update center: "+this.position);
		this.ls01.update();
		this.ls12.update();
		this.ls20.update();
		//
		Vector3.Cross(this.ls01.tv, this.ls12.tv, this.nv);
		this.nv.normalize();
		this.distance = this.nv.dot(this.v0);
		//trace("Triangle::update() nv: ", this.nv,", distance: ", this.distance);
	}
	updateFast(): void {
		this.update();
	}
}
export default Triangle;
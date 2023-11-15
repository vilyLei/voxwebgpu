import AABB from "../cgeom/AABB";
import Plane from "../cgeom/Plane";
import MC from "../math/MathConst";
import Matrix4 from "../math/Matrix4";
import Vector3 from "../math/Vector3";
import { IRenderFrustum } from "../render/IRenderFrustum";

const minv = MC.MATH_MIN_POSITIVE;
const maxv = MC.MATH_MAX_NEGATIVE;

class Frustum implements IRenderFrustum {

	private mTempV = new Vector3();
	private mTempV1 = new Vector3();
	private mFpns = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
	private mFpds = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

	near = 0.1;
	far = 5000;
	aspect = 1;
	/**
	 * fov radian value
	 */
	fov = Math.PI * 0.25;

	perspective = true;

	viewWidth = 800;
	viewHeight = 600;
	viewHalfWidth = 400;
	viewHalfHeight = 300;

	readonly bounds = new AABB();

	nearHalfWidth = 0.5;
	nearHalfHeight = 0.5;

	nearWidth = 1;
	nearHeight = 1;

	readonly worldDirec = new Vector3();
	readonly nearWorldCenter = new Vector3();
	readonly farWorldCenter = new Vector3();
	/**
	 * eight vertices: 4 far points, 4 near points
	 */
	readonly vertices = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
	// world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
	readonly planes = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
	constructor() {}
	setParam(fov: number, near: number, far: number, aspect: number): void {
		this.fov = fov;
		this.near = near;
		this.far = far;
		this.aspect = aspect;
	}
	setViewSize(pw: number, ph: number): void {
		this.viewWidth = pw;
		this.viewHeight = ph;
		this.viewHalfWidth = pw * 0.5;
		this.viewHalfHeight = ph * 0.5;
	}
	update(invViewMat: Matrix4): void {
		this.calcParam(invViewMat);
	}
	/**
	 * @param w_cv 世界坐标位置
	 * @param radius 球体半径
	 * @returns 0表示完全不会再近平面内, 1表示完全在近平面内, 2表示和近平面相交
	 */
	visiTestNearPlaneWithSphere(w_cv: Vector3, radius: number): number {
		const ps = this.mFpns;
		const v = ps[1].dot(w_cv) - this.mFpds[1];
		if (v - radius > minv) {
			// 表示完全在近平面之外，也就是前面
			return 0;
		} else if (v + radius < maxv) {
			// 表示完全在近平面内, 也就是后面
			return 1;
		}
		// 表示和近平面相交
		return 2;
	}
	visiTestSphere2(w_cv: Vector3, radius: number): boolean {
		const ps = this.mFpns;
		let boo = ps[0].dot(w_cv) - this.mFpds[0] - radius > minv;
		if (boo) return false;
		boo = ps[1].dot(w_cv) - this.mFpds[1] - radius > minv;
		if (boo) return false;
		boo = ps[2].dot(w_cv) - this.mFpds[2] - radius > minv;
		if (boo) return false;
		boo = ps[3].dot(w_cv) - this.mFpds[3] - radius > minv;
		if (boo) return false;
		boo = ps[4].dot(w_cv) - this.mFpds[4] - radius > minv;
		if (boo) return false;
		boo = ps[5].dot(w_cv) - this.mFpds[5] - radius > minv;
		if (boo) return false;
		return true;
	}

	visiTestSphere3(w_cv: Vector3, radius: number, farROffset: number): boolean {
		const ps = this.mFpns;
		let boo = ps[0].dot(w_cv) - this.mFpds[0] + farROffset - radius > minv;
		if (boo) return false;
		boo = ps[1].dot(w_cv) - this.mFpds[1] - radius > minv;
		if (boo) return false;
		boo = ps[2].dot(w_cv) - this.mFpds[2] - radius > minv;
		if (boo) return false;
		boo = ps[3].dot(w_cv) - this.mFpds[3] - radius > minv;
		if (boo) return false;
		boo = ps[4].dot(w_cv) - this.mFpds[4] - radius > minv;
		if (boo) return false;
		boo = ps[5].dot(w_cv) - this.mFpds[5] - radius > minv;
		if (boo) return false;
		return true;
	}
	visiTestPosition(pv: Vector3): boolean {
		const ps = this.mFpns;
		let boo = ps[0].dot(pv) - this.mFpds[0] > minv;
		if (boo) return false;
		boo = ps[1].dot(pv) - this.mFpds[1] > minv;
		if (boo) return false;
		boo = ps[2].dot(pv) - this.mFpds[2] > minv;
		if (boo) return false;
		boo = ps[3].dot(pv) - this.mFpds[3] > minv;
		if (boo) return false;
		boo = ps[4].dot(pv) - this.mFpds[4] > minv;
		if (boo) return false;
		boo = ps[5].dot(pv) - this.mFpds[5] > minv;
		if (boo) return false;
		return true;
	}
	visiTestPlane(nv: Vector3, distance: number): boolean {
		const ls = this.planes;
		let f0 = nv.dot(ls[0].position) - distance;
		let f1 = f0 * (nv.dot(ls[1].position) - distance);
		if (f1 < minv) return true;
		f1 = f0 * (nv.dot(ls[2].position) - distance);
		if (f1 < minv) return true;
		f1 = f0 * (nv.dot(ls[3].position) - distance);
		if (f1 < minv) return true;
		f1 = f0 * (nv.dot(ls[4].position) - distance);
		if (f1 < minv) return true;
		f1 = f0 * (nv.dot(ls[5].position) - distance);
		if (f1 < minv) return true;
		return false;
	}
	// frustum intersect sphere in wrod space
	visiTestSphere(w_cv: Vector3, radius: number): boolean {
		const ls = this.planes;
		let boo = this.bounds.sphereIntersect(w_cv, radius);
		if (boo) {
			let pf0 = ls[0].intersectSphere(w_cv, radius);
			let pf1 = ls[1].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[0].intersectBoo || ls[1].intersectBoo) {
				} else {
					return false;
				}
			}
			pf0 = ls[2].intersectSphere(w_cv, radius);
			pf1 = ls[3].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[2].intersectBoo || ls[3].intersectBoo) {
				} else {
					return false;
				}
			}
			pf0 = ls[4].intersectSphere(w_cv, radius);
			pf1 = ls[5].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[4].intersectBoo || ls[5].intersectBoo) {
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	// visibility test
	// 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
	// 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
	visiTestAABB(ab: AABB): boolean {

		let w_cv = ab.center;
		let radius = ab.radius;
		let boo = this.bounds.sphereIntersect(w_cv, radius);
		const ls = this.planes;

		if (boo) {
			let pf0 = ls[0].intersectSphere(w_cv, radius);
			let pf1 = ls[1].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[0].intersectBoo || ls[1].intersectBoo) {
				} else {
					return false;
				}
			}
			pf0 = ls[2].intersectSphere(w_cv, radius);
			pf1 = ls[3].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[2].intersectBoo || ls[3].intersectBoo) {
				} else {
					return false;
				}
			}
			pf0 = ls[4].intersectSphere(w_cv, radius);
			pf1 = ls[5].intersectSphere(w_cv, radius);
			if (pf0 * pf1 >= 0) {
				if (ls[4].intersectBoo || ls[5].intersectBoo) {
				} else {
					return false;
				}
			}
			return true;
		}
		return false;
	}
	private calcParam(invViewMat: Matrix4): void {
		let plane: Plane;
		let halfMinH = this.viewHalfHeight;
		let halfMinW = this.viewHalfWidth;
		let halfMaxH = halfMinH;
		let halfMaxW = halfMinW;
		if (this.perspective) {
			const tanv = Math.tan(this.fov * 0.5);
			halfMinH = this.near * tanv;
			halfMinW = halfMinH * this.aspect;
			halfMaxH = this.far * tanv;
			halfMaxW = halfMaxH * this.aspect;
		}

		const frustumPositions = this.vertices;
		const frustumPlanes = this.planes;

		this.nearHalfWidth = halfMinW;
		this.nearHalfHeight = halfMinH;
		this.nearWidth = 2.0 * halfMinW;
		this.nearHeight = 2.0 * halfMinH;
		// inner view space
		this.nearWorldCenter.setXYZ(0, 0, -this.near);
		this.farWorldCenter.setXYZ(0, 0, -this.far);
		invViewMat.transformVectorSelf(this.nearWorldCenter);
		invViewMat.transformVectorSelf(this.farWorldCenter);
		const direc = this.worldDirec.subVecsTo(this.farWorldCenter, this.nearWorldCenter);
		direc.normalize();

		// front face, far plane
		plane = frustumPlanes[0];
		plane.nv.copyFrom( direc );
		plane.distance = plane.nv.dot(this.farWorldCenter);
		plane.position.copyFrom(this.farWorldCenter);
		// back face, near face
		plane = frustumPlanes[1];
		plane.nv.copyFrom(frustumPlanes[0].nv);
		plane.distance = plane.nv.dot(this.nearWorldCenter);
		plane.position.copyFrom(this.nearWorldCenter);

		// far face
		frustumPositions[0].setXYZ(-halfMaxW, -halfMaxH, -this.far);
		frustumPositions[1].setXYZ(halfMaxW, -halfMaxH, -this.far);
		frustumPositions[2].setXYZ(halfMaxW, halfMaxH, -this.far);
		frustumPositions[3].setXYZ(-halfMaxW, halfMaxH, -this.far);
		// near face
		frustumPositions[4].setXYZ(-halfMinW, -halfMinH, -this.near);
		frustumPositions[5].setXYZ(halfMinW, -halfMinH, -this.near);
		frustumPositions[6].setXYZ(halfMinW, halfMinH, -this.near);
		frustumPositions[7].setXYZ(-halfMinW, halfMinH, -this.near);

		const invM = invViewMat;
		invM.transformVectorSelf(frustumPositions[0]);
		invM.transformVectorSelf(frustumPositions[1]);
		invM.transformVectorSelf(frustumPositions[2]);
		invM.transformVectorSelf(frustumPositions[3]);
		invM.transformVectorSelf(frustumPositions[4]);
		invM.transformVectorSelf(frustumPositions[5]);
		invM.transformVectorSelf(frustumPositions[6]);
		invM.transformVectorSelf(frustumPositions[7]);

		this.bounds.reset();
		for (let i = 0; i < 8; ++i) {
			this.bounds.addPosition(frustumPositions[i]);
		}
		this.bounds.updateFast();
		const cross = Vector3.Cross;
		// bottom
		this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
		let v0 = frustumPositions[1];
		this.mTempV1.subVecsTo(frustumPositions[1], frustumPositions[5]);
		plane = frustumPlanes[3];
		cross(this.mTempV1, this.mTempV, plane.nv);
		plane.nv.normalize();
		plane.distance = plane.nv.dot(v0);
		plane.position.copyFrom(v0);
		// top
		this.mTempV.subVecsTo(frustumPositions[3], frustumPositions[7]);
		v0 = frustumPositions[2];
		this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
		plane = frustumPlanes[2];
		cross(this.mTempV1, this.mTempV, plane.nv);
		plane.nv.normalize();
		plane.distance = plane.nv.dot(v0);
		plane.position.copyFrom(v0);
		// left
		this.mTempV.subVecsTo(frustumPositions[0], frustumPositions[4]);
		v0 = frustumPositions[3];
		this.mTempV1.subVecsTo(frustumPositions[3], frustumPositions[7]);
		plane = frustumPlanes[4];
		cross(this.mTempV, this.mTempV1, plane.nv);
		plane.nv.normalize();
		plane.distance = plane.nv.dot(v0);
		plane.position.copyFrom(v0);
		// right
		this.mTempV.subVecsTo(frustumPositions[1], frustumPositions[5]);
		v0 = frustumPositions[2];
		this.mTempV1.subVecsTo(frustumPositions[2], frustumPositions[6]);
		plane = frustumPlanes[5];
		cross(this.mTempV, this.mTempV1, plane.nv);
		plane.nv.normalize();
		plane.distance = plane.nv.dot(v0);
		plane.position.copyFrom(v0);
		const fpna = this.mFpns;
		fpna[0].copyFrom(frustumPlanes[0].nv);
		fpna[1].copyFrom(frustumPlanes[1].nv);
		fpna[1].scaleBy(-1.0);
		fpna[2].copyFrom(frustumPlanes[2].nv);
		fpna[3].copyFrom(frustumPlanes[3].nv);
		fpna[3].scaleBy(-1.0);
		fpna[4].copyFrom(frustumPlanes[4].nv);
		fpna[4].scaleBy(-1.0);
		fpna[5].copyFrom(frustumPlanes[5].nv);

		const fpda = this.mFpds;
		fpda[0] = frustumPlanes[0].distance;
		fpda[1] = -frustumPlanes[1].distance;
		fpda[2] = frustumPlanes[2].distance;
		fpda[3] = -frustumPlanes[3].distance;
		fpda[4] = -frustumPlanes[4].distance;
		fpda[5] = frustumPlanes[5].distance;
	}
}

export { Frustum };

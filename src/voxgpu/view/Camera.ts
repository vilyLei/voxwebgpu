/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import Matrix4 from "../math/Matrix4";

// import Plane from "../cgeom/Plane";
// import AABB from "../cgeom/AABB";
import { IRenderCamera } from "../render/IRenderCamera";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGCameraParam } from "../rscene/WGRendererParam";
import { initializeCamera } from "./CameraUtils";
import { Frustum } from "./Frustum";

// const pmin = MathConst.MATH_MIN_POSITIVE;
class Camera implements IRenderCamera {
	private mTempV = new Vector3();
	private mTempV1 = new Vector3();
	private mInitRV = new Vector3();
	private mInitUp = new Vector3();

	private mMatrix = new Matrix4();
	private mViewMat = new Matrix4();
	private mViewInvMat = new Matrix4();
	private mVPMat = new Matrix4();
	private mTempMat = new Matrix4();
	private mProjMat = new Matrix4();
	private mCamPos = new Vector3();
	private mLookAtPos = new Vector3();
	private mUp = new Vector3();
	private mLookDirectNV = new Vector3();
	private mLookAtDirec = new Vector3();
	private mLookRHand = true;

	private mNearPlaneW = 1.0;
	private mNearPlaneH = 1.0;

	private mViewX = 0;
	private mViewY = 0;
	private mViewW = 800;
	private mViewH = 600;
	private mViewHalfW = 400;
	private mViewHalfH = 300;
	private mFovRadian = 0.0;
	private mAspect = 1.0;
	private mZNear = 0.1;
	private mZFar = 1000.0;
	private mB = 0.0;
	private mT = 0.0;
	private mL = 0.0;
	private mR = 0.0;
	private mPerspective = false;
	private mProject2Enabled = false;
	private mRightHandEnabled = true;
	private mRotV = new Vector3();

	private mViewFieldZoom = 1.0;
	private mChanged = true;
	private mUnlock = true;

	version = 0;
	viewUniformV: WGRUniformValue;
	projUniformV: WGRUniformValue;

	name = "Camera";

	frustum = new Frustum();
	inversePerspectiveZ = false;
	constructor(param?: WGCameraParam) {
		this.viewUniformV = new WGRUniformValue({ data: this.mViewMat.getLocalFS32(), shared: true, shdVarName: "viewMat" });
		this.projUniformV = new WGRUniformValue({ data: this.mProjMat.getLocalFS32(), shared: true, shdVarName: "projMat" });
		if (param) {
			this.initialize(param);
		}
	}
	initialize(param?: WGCameraParam): void {
		initializeCamera(param, this);
	}
	// 不允许外界修改camera数据
	lock(): void {
		this.mUnlock = false;
	}
	// 允许外界修改camera数据
	unlock(): void {
		this.mUnlock = true;
	}
	lookAtLH(camPos: Vector3, lookAtPos: Vector3, up: Vector3): void {
		if (this.mUnlock) {
			this.mCamPos.copyFrom(camPos);
			this.mLookAtPos.copyFrom(lookAtPos);
			this.mUp.copyFrom(up);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = false;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			this.mInitUp.copyFrom(up);
			this.mInitUp.normalize();
			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			this.mInitRV.normalize();
			this.mChanged = true;
		}
	}
	lookAtRH(camPos: Vector3, lookAtPos: Vector3, up: Vector3): void {
		if (this.mUnlock) {
			this.mCamPos.copyFrom(camPos);
			this.mLookAtPos.copyFrom(lookAtPos);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			Vector3.Cross(this.mLookAtDirec, up, this.mInitRV);
			Vector3.Cross(this.mInitRV, this.mLookAtDirec, this.mInitUp);
			this.mInitUp.normalize();
			this.mInitRV.normalize();
			this.mUp.copyFrom(this.mInitUp);
			this.mChanged = true;
		}
	}

	getLookAtLHToCamera(camera: Camera): void {
		camera.lookAtLH(this.mCamPos, this.mLookAtPos, this.mUp);
	}
	getLookAtRHToCamera(camera: Camera): void {
		camera.lookAtRH(this.mCamPos, this.mLookAtPos, this.mUp);
	}
	/**
	 * left-hand axis perspective projection
	 * @param fovRadian radian value
	 * @param aspect the value is the view port width / height
	 * @param zNear the camera near plane distance
	 * @param zFar the camera far plane distance
	 */
	perspectiveLH(fovRadian: number, aspect: number, zNear: number, zFar: number): void {
		if (this.mUnlock) {
			this.mProject2Enabled = false;
			this.mAspect = aspect;
			this.mFovRadian = fovRadian;
			this.mZNear = zNear;
			this.mZFar = zFar;
			this.mProjMat.perspectiveLH(fovRadian, aspect, zNear, zFar);
			this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
			this.mPerspective = true;
			this.mRightHandEnabled = false;
			this.mChanged = true;
		}
	}
	/**
	 * right-hand axis perspective projection
	 * @param fovRadian radian value
	 * @param aspect the value is the view port width / height
	 * @param zNear the camera near plane distance
	 * @param zFar the camera far plane distance
	 */
	perspectiveRH(fovRadian: number, aspect: number, zNear: number, zFar: number): void {
		if (this.mUnlock) {
			this.mAspect = aspect;
			this.mFovRadian = fovRadian;
			this.mZNear = zNear;
			this.mZFar = zFar;
			this.mProjMat.perspectiveRH(fovRadian, aspect, zNear, zFar);
			this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
			this.mProject2Enabled = false;
			this.mPerspective = true;
			this.mRightHandEnabled = true;
			this.mChanged = true;
		}
	}
	perspectiveRH2(fovRadian: number, pw: number, ph: number, zNear: number, zFar: number): void {
		if (this.mUnlock) {
			this.mAspect = pw / ph;
			this.mFovRadian = fovRadian;
			this.mZNear = zNear;
			this.mZFar = zFar;
			this.mProjMat.perspectiveRH2(fovRadian, pw, ph, zNear, zFar);
			this.mViewFieldZoom = Math.tan(fovRadian * 0.5);
			this.mPerspective = true;
			this.mProject2Enabled = true;
			this.mRightHandEnabled = true;
			this.mChanged = true;
		}
	}
	get aspect(): number {
		return this.mAspect;
	}
	get viewFieldZoom(): number {
		return this.mViewFieldZoom;
	}
	orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
		if (this.mUnlock) {
			this.mZNear = zNear;
			this.mZFar = zFar;
			this.mB = b;
			this.mT = t;
			this.mL = l;
			this.mR = r;
			this.mProjMat.orthoRH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
			this.mPerspective = false;
			this.mRightHandEnabled = true;
			this.mChanged = true;
		}
	}
	orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
		if (this.mUnlock) {
			this.mZNear = zNear;
			this.mZFar = zFar;
			this.mB = b;
			this.mT = t;
			this.mL = l;
			this.mR = r;
			this.mProjMat.orthoLH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
			this.mPerspective = false;
			this.mRightHandEnabled = false;
			this.mChanged = true;
		}
	}

	setViewXY(px: number, py: number): void {
		if (this.mUnlock) {
			this.mViewX = px;
			this.mViewY = py;
		}
	}
	setViewSize(pw: number, ph: number): void {
		if (this.mUnlock) {
			if (pw != this.mViewW || ph != this.mViewH) {
				this.mViewW = pw;
				this.mViewH = ph;
				this.mViewHalfW = pw * 0.5;
				this.mViewHalfH = ph * 0.5;

				this.frustum.setViewSize(pw, ph);

				if (this.mPerspective) {
					if (this.mProject2Enabled) {
						if (this.mRightHandEnabled) this.perspectiveRH2(this.mFovRadian, pw, ph, this.mZNear, this.mZFar);
					} else {
						if (this.mRightHandEnabled) this.perspectiveRH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);
						else this.perspectiveLH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);
					}
				} else {
					this.orthoRH(this.mZNear, this.mZFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
				}
			}
		}
	}
	get rightHand(): boolean {
		return this.mRightHandEnabled;
	}
	get viewX(): number {
		return this.mViewX;
	}
	get viewY(): number {
		return this.mViewY;
	}
	get viewWidth(): number {
		return this.mViewW;
	}
	get viewHeight(): number {
		return this.mViewH;
	}
	translation(v3: Vector3): void {
		if (this.mUnlock) {
			this.mCamPos.copyFrom(v3);
			// this.mLookAtPos.x = v3.x + this.mLookAtDirec.x;
			// this.mLookAtPos.y = v3.y + this.mLookAtDirec.y;
			// this.mLookAtPos.z = v3.z + this.mLookAtDirec.z;
			this.mLookAtPos.addVecsTo(v3, this.mLookAtDirec);
			this.mChanged = true;
		}
	}
	translationXYZ(px: number, py: number, pz: number): void {
		this.mTempV.setXYZ(px, py, pz);
		if (this.mUnlock && Vector3.DistanceSquared(this.mCamPos, this.mTempV) > 0.00001) {
			this.mCamPos.setXYZ(px, py, pz);
			this.mLookAtPos.x = px + this.mLookAtDirec.x;
			this.mLookAtPos.y = py + this.mLookAtDirec.y;
			this.mLookAtPos.z = pz + this.mLookAtDirec.z;
			this.mChanged = true;
		}
	}
	forward(dis: number): void {
		if (this.mUnlock) {
			this.mCamPos.x += this.mLookDirectNV.x * dis;
			this.mCamPos.y += this.mLookDirectNV.y * dis;
			this.mCamPos.z += this.mLookDirectNV.z * dis;
			this.mLookAtPos.addVecsTo(this.mCamPos, this.mLookAtDirec);
			this.mChanged = true;
		}
	}
	/**
	 * 在平行于远平面的平面上滑动， 垂直于此平面的方向上不变
	 * @param dx 摄像机 view 空间内 x方向偏移量
	 * @param dy 摄像机 view 空间内 y方向偏移量
	 */
	slideViewOffsetXY(dx: number, dy: number): void {
		if (this.mUnlock) {
			this.mTempV.setXYZ(dx, dy, 0);

			this.mInvViewMat.transformVectorSelf(this.mTempV);

			dx = this.mTempV.x - this.mCamPos.x;
			dy = this.mTempV.y - this.mCamPos.y;
			let dz = this.mTempV.z - this.mCamPos.z;
			this.mCamPos.x += dx;
			this.mCamPos.y += dy;
			this.mCamPos.z += dz;

			this.mLookAtPos.x += dx;
			this.mLookAtPos.y += dy;
			this.mLookAtPos.z += dz;

			this.mChanged = true;
		}
	}

	forwardFixPos(dis: number, pos: Vector3): void {
		if (this.mUnlock) {
			this.mCamPos
				.copyFrom(this.mLookDirectNV)
				.scaleBy(dis)
				.addBy(pos);
			this.mLookAtPos.addVecsTo(this.mCamPos, this.mLookAtDirec);
			this.mChanged = true;
		}
	}

	swingHorizontalWithAxis(rad: number, axis: Vector3): void {
		if (this.mUnlock) {
			this.mTempMat.identity();
			if (axis != null) {
				this.mTempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, axis);
			} else {
				this.mTempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, Vector3.Y_AXIS);
			}
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

			this.mTempMat.transformVectorSelf(this.mLookAtDirec);
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			//
			this.mTempMat.transformVectorSelf(this.mInitRV);
			this.mInitRV.normalize();
			//Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			Vector3.Cross(this.mInitRV, this.mLookAtDirec, this.mUp);
			this.mUp.normalize();
			this.mChanged = true;
		}
	}
	swingHorizontal(degree: number): void {
		if (this.mUnlock) {
			this.mTempMat.identity();
			this.mTempMat.appendRotation(degree * MathConst.MATH_PI_OVER_180, this.mUp);
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

			this.mTempMat.transformVectorSelf(this.mLookAtDirec);
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			this.mInitRV.normalize();
			this.mChanged = true;
		}
	}
	swingVertical(degree: number): void {
		if (this.mUnlock) {
			this.mTempMat.identity();
			this.mTempMat.appendRotation(MathConst.ToRadian(degree), this.mInitRV);
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

			this.mTempMat.transformVectorSelf(this.mLookAtDirec);
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);

			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);

			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mInitRV, this.mLookAtDirec, this.mUp);
			this.mUp.normalize();
			this.mInitUp.copyFrom(this.mUp);
			this.mChanged = true;
		}
	}

	get position(): Vector3 {
		this.m_tempCamPos.copyFrom(this.mCamPos);
		return this.m_tempCamPos;
	}
	set position(v3: Vector3) {
		if (this.mUnlock) {
			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mTempV);
			let dot = this.mTempV.dot(this.mInitUp);
			this.mTempV1.copyFrom(this.mInitUp);
			this.mTempV1.scaleBy(dot);
			this.mTempV.subtractBy(this.mTempV1);

			this.mCamPos.copyFrom(v3);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mTempV, this.mLookAtDirec, this.mUp);
			this.mUp.normalize();
			this.mChanged = true;
		}
	}
	setPositionXYZ(px: number, py: number, pz: number): void {
		if (this.mUnlock) {
			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mTempV);
			var dot = this.mTempV.dot(this.mInitUp);
			this.mTempV1.copyFrom(this.mInitUp);
			this.mTempV1.scaleBy(dot);
			this.mTempV.subtractBy(this.mTempV1);
			this.mCamPos.setXYZ(px, py, pz);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mTempV, this.mLookAtDirec, this.mUp);
			this.mUp.normalize();
			this.mChanged = true;
		}
	}
	setLookPosXYZFixUp(px: number, py: number, pz: number): void {
		if (this.mUnlock) {
			this.mLookAtPos.setXYZ(px, py, pz);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			this.mInitRV.normalize();
			this.mChanged = true;
		}
	}
	setPositionXYZFixUp(px: number, py: number, pz: number): void {
		if (this.mUnlock) {
			this.mCamPos.setXYZ(px, py, pz);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();

			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			this.mInitRV.normalize();
			this.mChanged = true;
		}
	}
	setPositionFixUp(v3: Vector3): void {
		if (this.mUnlock) {
			this.mCamPos.copyFrom(v3);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookRHand = true;
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
			this.mInitRV.normalize();
			this.mChanged = true;
		}
	}
	copyFrom(tarCam: Camera): void {
		let pv = tarCam.position;
		this.mCamPos.copyFrom(pv);
		pv = tarCam.lookPosition;
		this.mLookAtPos.copyFrom(pv);
		this.near = tarCam.near;
		this.far = tarCam.far;
		this.nearPlaneWidth = tarCam.nearPlaneWidth;
		this.nearPlaneHeight = tarCam.nearPlaneHeight;
		this.perspective = tarCam.perspective;
		this.mViewInvMat.copyFrom(tarCam.viewInvertMatrix);
	}
	private m_tempNV = new Vector3();
	private m_tempUPV = new Vector3();
	private m_tempRV = new Vector3();
	private m_tempCamPos = new Vector3();
	private m_tempLookAtPos = new Vector3();
	/**
	 * @returns view space z-axis vector3 value in the world space
	 */
	get nv(): Vector3 {
		this.m_tempNV.copyFrom(this.mLookDirectNV);
		return this.m_tempNV;
	}
	/**
	 * @returns view space y-axis vector3 value in the world space
	 */
	get uv(): Vector3 {
		this.m_tempUPV.copyFrom(this.mUp);
		return this.m_tempUPV;
	}
	/**
	 * @returns view space x-axis vector3 value in the world space
	 */
	get rv(): Vector3 {
		this.m_tempRV.copyFrom(this.mInitRV);
		return this.m_tempRV;
	}
	get lookPosition(): Vector3 {
		this.m_tempLookAtPos.copyFrom(this.mLookAtPos);
		return this.m_tempLookAtPos;
	}
	setLookAtPosition(pv: Vector3): void {
		if (this.mUnlock) {
			this.mLookAtPos.copyFrom(pv);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			this.mChanged = true;
		}
	}
	setLookAtXYZ(px: number, py: number, pz: number): void {
		if (this.mUnlock) {
			this.mLookAtPos.setXYZ(px, py, pz);
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
			this.mLookDirectNV.copyFrom(this.mLookAtDirec);
			this.mLookDirectNV.normalize();
			this.mChanged = true;
		}
	}
	get perspective(): boolean {
		return this.mPerspective;
	}
	set perspective(boo: boolean) {
		this.mPerspective = boo;
	}

	private m_rotDegree = 0.0;
	private m_rotAxis = new Vector3();
	private m_rotPivotPoint: Vector3 = null;
	private m_axisRotEnabled = false;
	appendRotationByAxis(degree: number, axis: Vector3, pivotPoint: Vector3 = null): void {
		if (this.mUnlock) {
			this.m_rotDegree = degree;
			this.mChanged = true;
			this.m_rotAxis.copyFrom(axis);
			this.m_rotPivotPoint = pivotPoint;
			this.m_axisRotEnabled = true;
		}
	}
	setRotationX(degree: number): void {
		this.mRotV.x = degree;
		this.mChanged = true;
		this.m_axisRotEnabled = false;
	}
	getRotationX(): number {
		return this.mRotV.x;
	}
	setRotationY(degree: number): void {
		this.mRotV.y = degree;
		this.mChanged = true;
		this.m_axisRotEnabled = false;
	}
	getRotationY(): number {
		return this.mRotV.y;
	}
	setRotationZ(degree: number): void {
		this.mRotV.z = degree;
		this.mChanged = true;
		this.m_axisRotEnabled = false;
	}
	getRotationZ() {
		return this.mRotV.z;
	}
	setRotationXYZ(rx: number, ry: number, rz: number): void {
		if (this.mUnlock) {
			this.mRotV.setXYZ(rx, ry, rz);
			this.mChanged = true;
			this.m_axisRotEnabled = false;
		}
	}
	screenXYToViewXYZ(px: number, py: number, outV: Vector3): void {
		px -= this.mViewX;
		py -= this.mViewY;
		if (this.mPerspective) {
			px = (this.mNearPlaneW * (px - this.mViewHalfW)) / this.mViewHalfW;
			py = (this.mNearPlaneH * (this.mViewHalfH - py)) / this.mViewHalfH;
		}
		outV.setXYZ(px, py, -this.mZNear);
		//
	}
	screenXYToWorldXYZ(px: number, py: number, outV: Vector3): void {
		px -= this.mViewX;
		py -= this.mViewY;
		if (this.mPerspective) {
			px = (0.5 * this.mNearPlaneW * (px - this.mViewHalfW)) / this.mViewHalfW;
			py = (0.5 * this.mNearPlaneH * (this.mViewHalfH - py)) / this.mViewHalfH;
		}
		outV.setXYZ(px, py, -this.mZNear);
		outV.w = 1.0;
		this.mViewInvMat.transformVectorSelf(outV);
	}
	getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: Vector3, ray_tv: Vector3): void {
		//console.log("screenX,screenY: ",screenX,screenY,this.mViewHalfW,this.mViewHalfH);
		screenX -= this.mViewX;
		screenY -= this.mViewY;
		if (this.mPerspective) {
			screenX = (0.5 * this.mNearPlaneW * (screenX - this.mViewHalfW)) / this.mViewHalfW;
			screenY = (0.5 * this.mNearPlaneH * (screenY - this.mViewHalfH)) / this.mViewHalfH;
			ray_pos.setXYZ(screenX, screenY, -this.mZNear);
			ray_pos.w = 1.0;
			this.mViewInvMat.transformVectorSelf(ray_pos);
			ray_tv.copyFrom(ray_pos);
			ray_tv.subtractBy(this.mCamPos);
			ray_tv.normalize();
		} else {
			screenX -= this.mViewHalfW;
			screenY -= this.mViewHalfH;
			ray_pos.setXYZ(screenX, screenY, -this.mZNear);
			ray_pos.w = 1.0;
			this.mViewInvMat.transformVectorSelf(ray_pos);
			ray_tv.copyFrom(this.mLookDirectNV);
		}
	}
	calcScreenNormalizeXYByWorldPos(pv3: Vector3, scPV3: Vector3): void {
		scPV3.copyFrom(pv3);
		this.mVPMat.transformVectorSelf(scPV3);
		scPV3.x /= scPV3.w;
		scPV3.y /= scPV3.w;
	}
	worldPosToScreen(pv: Vector3): void {
		this.mViewMat.transformVector3Self(pv);
		this.mProjMat.transformVectorSelf(pv);
		pv.x /= pv.w;
		pv.y /= pv.w;
		pv.x *= this.mViewHalfW;
		pv.y *= this.mViewHalfH;
		pv.x += this.mViewX;
		pv.y += this.mViewY;
	}
	// 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值为像素数
	calcViewRectByWorldSphere(pv: Vector3, radius: number, outV: Vector3): void {
		this.mViewMat.transformVector3Self(pv);
		radius *= 1.15;
		outV.x = pv.x - radius;
		outV.y = pv.y - radius;
		outV.z = pv.z;
		pv.x += radius;
		pv.y += radius;
		this.mProjMat.transformPerspV4Self(outV);
		this.mProjMat.transformPerspV4Self(pv);
		pv.z = 1.0 / pv.w;
		outV.z = pv.x * pv.z;
		outV.w = pv.y * pv.z;
		outV.z *= this.mViewHalfW;
		outV.w *= this.mViewHalfH;
		outV.x *= pv.z;
		outV.y *= pv.z;
		outV.x *= this.mViewHalfW;
		outV.y *= this.mViewHalfH;
		outV.z = outV.z - outV.x;
		outV.w = outV.w - outV.y;
		outV.x += this.mViewX;
		outV.y += this.mViewY;
	}

	// 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间
	calcScreenRectByWorldSphere(pv: Vector3, radius: number, outV: Vector3): void {
		this.mViewMat.transformVector3Self(pv);
		radius *= 1.15;
		outV.x = pv.x - radius;
		outV.y = pv.y - radius;
		pv.x += radius;
		pv.y += radius;
		this.mProjMat.transformPerspV4Self(outV);
		this.mProjMat.transformPerspV4Self(pv);
		pv.z = 1.0 / pv.w;
		outV.z = pv.x * pv.z;
		outV.w = pv.y * pv.z;
		outV.x *= pv.z;
		outV.y *= pv.z;
		outV.z = outV.z - outV.x;
		outV.w = outV.w - outV.y;
	}
	private mInvViewMat: Matrix4;
	
	getInvertViewMatrix(): Matrix4 {
		return this.mInvViewMat;
	}
	get near(): number {
		return this.mZNear;
	}
	set near(value: number) {
		this.mZNear = value;
	}
	get far(): number {
		return this.mZFar;
	}
	set far(value: number) {
		this.mZFar = value;
	}
	get nearPlaneWidth(): number {
		return this.mNearPlaneW;
	}
	set nearPlaneWidth(value: number) {
		this.mNearPlaneW = value;
	}
	get nearPlaneHeight(): number {
		return this.mNearPlaneH;
	}
	set nearPlaneHeight(value: number) {
		this.mNearPlaneH = value;
	}
	/**
	 * fov radian value
	 */
	get fov(): number {
		return this.mFovRadian;
	}
	private calcParam(): void {
		if (!this.mInvViewMat) this.mInvViewMat = new Matrix4();
		this.mInvViewMat.copyFrom(this.mViewMat);
		this.mInvViewMat.invert();

		const frustrum = this.frustum;
		frustrum.perspective = this.mPerspective;
		frustrum.setParam(this.mFovRadian, this.mZNear, this.mZFar, this.mAspect);
		frustrum.update(this.mInvViewMat);
	}
	private mViewMatrix: Matrix4 = null;
	setViewMatrix(viewMatrix: Matrix4): void {
		this.mViewMatrix = viewMatrix;
		this.mChanged = true;
	}
	update(): void {
		if (this.mChanged) {
			this.version++;
			this.mChanged = false;
			if (!this.mViewMatrix) {
				if (this.m_axisRotEnabled) {
					this.mMatrix.appendRotationPivot(this.m_rotDegree * MathConst.MATH_PI_OVER_180, this.m_rotAxis, this.m_rotPivotPoint);
				} else {
					this.mMatrix.identity();
					this.mMatrix.appendRotationEulerAngle(
						this.mRotV.x * MathConst.MATH_PI_OVER_180,
						this.mRotV.y * MathConst.MATH_PI_OVER_180,
						this.mRotV.z * MathConst.MATH_PI_OVER_180
					);
				}
				if (this.mLookRHand) {
					this.mViewMat.lookAtRH(this.mCamPos, this.mLookAtPos, this.mUp);
				} else {
					this.mViewMat.lookAtLH(this.mCamPos, this.mLookAtPos, this.mUp);
				}
				this.mViewMat.append(this.mMatrix);
			} else {
				this.mViewMat.copyFrom(this.mViewMatrix);
			}
			if (this.mProject2Enabled) {
				this.mNearPlaneW = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
				this.mNearPlaneH = this.mNearPlaneW / this.mAspect;
			} else {
				this.mNearPlaneH = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
				this.mNearPlaneW = this.mAspect * this.mNearPlaneH;
			}
			this.mViewInvMat.copyFrom(this.mViewMat);
			this.mViewInvMat.invert();

			this.mVPMat.identity();
			this.mVPMat.copyFrom(this.mViewMat);
			this.mVPMat.append(this.mProjMat);

			this.calcParam();
			// very very important !!!
			this.updateUniformData();
		}
	}
	private updateUniformData(): void {
		this.viewUniformV.upate();
		this.projUniformV.upate();
	}
	destroy(): void {}

	get lookRightHand(): boolean {
		return this.mLookRHand;
	}
	get lookLeftHand(): boolean {
		return !this.mLookRHand;
	}
	get viewProjMatrix(): Matrix4 {
		return this.mVPMat;
	}
	get viewMatrix(): Matrix4 {
		return this.mViewMat;
	}
	get viewInvertMatrix(): Matrix4 {
		return this.mViewInvMat;
	}
	get projectMatrix(): Matrix4 {
		return this.mProjMat;
	}
}
export default Camera;

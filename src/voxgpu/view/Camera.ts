/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import Matrix4 from "../math/Matrix4";

import Plane from "../cgeom/Plane";
import AABB from "../cgeom/AABB";
import {IRenderCamera} from "../render/IRenderCamera";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGCameraParam } from "../rscene/WGRendererParam";
import { initializeCamera } from "./CameraUtils";

const pmin = MathConst.MATH_MIN_POSITIVE;
class Camera implements IRenderCamera {

    version = 0;
    viewUniformV: WGRUniformValue;
    projUniformV: WGRUniformValue;

    name = "Camera";

    private mTempV = new Vector3()
    private mTempV1 = new Vector3();
    private mInitRV = new Vector3();
    private mInitUp = new Vector3();
    private mLookRHEnabled = true;

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

    private mNearPlaneW = 1.0;
    private mNearPlaneH = 1.0;

    private mViewX = 0.0;
    private mViewY = 0.0;
    private mViewW = 800.0
    private mViewH = 600.0;
    private mViewHalfW = 400.0
    private mViewHalfH = 300.0;
    private mFovRadian = 0.0;
    private mAspect = 1.0;
    private mZNear = 0.1;
    private mZFar = 1000.0;
    private mB = 0.0;
    private mT = 0.0;
    private mL = 0.0;
    private mR = 0.0;
    private mPerspectiveEnabled = false;
    private mProject2Enabled = false;
    private mRightHandEnabled = true;
    private mRotV = new Vector3();

    private mViewFieldZoom = 1.0;
    private mChanged = true;
    private mUnlock = true;
	inversePerspectiveZ = false;
    constructor(param?: WGCameraParam) {
		this.viewUniformV = new WGRUniformValue({data: this.mViewMat.getLocalFS32(), shared: true, shdVarName: "viewMat"});
		this.projUniformV = new WGRUniformValue({data: this.mProjMat.getLocalFS32(), shared: true, shdVarName: "projMat"});
		if(param) {
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
            this.mLookRHEnabled = false;
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
            this.mLookRHEnabled = true;
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
            this.mPerspectiveEnabled = true;
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
            this.mPerspectiveEnabled = true;
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
            this.mPerspectiveEnabled = true;
            this.mProject2Enabled = true;
            this.mRightHandEnabled = true;
            this.mChanged = true;
        }
    }
	getFOVRandian(): number {
		return this.mFovRadian;
	}
    getAspect(): number { return this.mAspect; }
    getViewFieldZoom(): number { return this.mViewFieldZoom; }
    orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        if (this.mUnlock) {
            this.mZNear = zNear;
            this.mZFar = zFar;
            this.mB = b; this.mT = t; this.mL = l; this.mR = r;
            this.mProjMat.orthoRH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
            this.mPerspectiveEnabled = false;
            this.mRightHandEnabled = true;
            this.mChanged = true;
        }
    }
    orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void {
        if (this.mUnlock) {
            this.mZNear = zNear;
            this.mZFar = zFar;
            this.mB = b; this.mT = t; this.mL = l; this.mR = r;
            this.mProjMat.orthoLH(b, t, l, r, zNear, zFar, this.inversePerspectiveZ ? -1 : 1);
            this.mPerspectiveEnabled = false;
            this.mRightHandEnabled = false;
            this.mChanged = true;
        }
    }
    isPerspectiveEnabled(): boolean {
        return this.mPerspectiveEnabled;
    }
    isRightHandEnabled(): boolean {
        return this.mRightHandEnabled;
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

                if (this.mPerspectiveEnabled) {
                    if (this.mProject2Enabled) {
                        if (this.mRightHandEnabled) this.perspectiveRH2(this.mFovRadian, pw, ph, this.mZNear, this.mZFar);
                    }
                    else {
                        if (this.mRightHandEnabled) this.perspectiveRH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);
                        else this.perspectiveLH(this.mFovRadian, pw / ph, this.mZNear, this.mZFar);
                    }
                }
                else {
                    this.orthoRH(this.mZNear, this.mZFar, -0.5 * ph, 0.5 * ph, -0.5 * pw, 0.5 * pw);
                }
            }
        }
    }
    getViewX(): number {
        return this.mViewX;
    }
    getViewY(): number {
        return this.mViewY;
    }
    getViewWidth(): number {
        return this.mViewW;
    }
    getViewHeight(): number {
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
        this.mTempV.setXYZ(px,py,pz);
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
            // this.mLookAtPos.x = this.mCamPos.x + this.mLookAtDirec.x;
            // this.mLookAtPos.y = this.mCamPos.y + this.mLookAtDirec.y;
            // this.mLookAtPos.z = this.mCamPos.z + this.mLookAtDirec.z;
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
            this.mTempV.setXYZ(dx,dy,0);

            this.m_invViewMat.transformVectorSelf(this.mTempV);

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
			this.mCamPos.copyFrom(this.mLookDirectNV).scaleBy(dis).addBy(pos);
            // this.mCamPos.x = pos.x + this.mLookDirectNV.x * dis;
            // this.mCamPos.y = pos.y + this.mLookDirectNV.y * dis;
            // this.mCamPos.z = pos.z + this.mLookDirectNV.z * dis;
            // this.mLookAtPos.x = this.mCamPos.x + this.mLookAtDirec.x;
            // this.mLookAtPos.y = this.mCamPos.y + this.mLookAtDirec.y;
            // this.mLookAtPos.z = this.mCamPos.z + this.mLookAtDirec.z;
			this.mLookAtPos.addVecsTo(this.mCamPos, this.mLookAtDirec);
            this.mChanged = true;
        }
    }

    swingHorizontalWithAxis(rad: number, axis: Vector3): void {
        if (this.mUnlock) {
            this.mTempMat.identity();
            if (axis != null) {
                this.mTempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, axis);
            }
            else {
                this.mTempMat.appendRotation(rad * MathConst.MATH_PI_OVER_180, Vector3.Y_AXIS);
            }
            // this.mLookAtDirec.x = this.mCamPos.x - this.mLookAtPos.x;
            // this.mLookAtDirec.y = this.mCamPos.y - this.mLookAtPos.y;
            // this.mLookAtDirec.z = this.mCamPos.z - this.mLookAtPos.z;
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

            this.mTempMat.transformVectorSelf(this.mLookAtDirec);
            // this.mCamPos.x = this.mLookAtDirec.x + this.mLookAtPos.x;
            // this.mCamPos.y = this.mLookAtDirec.y + this.mLookAtPos.y;
            // this.mCamPos.z = this.mLookAtDirec.z + this.mLookAtPos.z;
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookRHEnabled = true;
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
            // this.mLookAtDirec.x = this.mCamPos.x - this.mLookAtPos.x;
            // this.mLookAtDirec.y = this.mCamPos.y - this.mLookAtPos.y;
            // this.mLookAtDirec.z = this.mCamPos.z - this.mLookAtPos.z;
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

            this.mTempMat.transformVectorSelf(this.mLookAtDirec);
            // this.mCamPos.x = this.mLookAtDirec.x + this.mLookAtPos.x;
            // this.mCamPos.y = this.mLookAtDirec.y + this.mLookAtPos.y;
            // this.mCamPos.z = this.mLookAtDirec.z + this.mLookAtPos.z;
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookRHEnabled = true;
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
            this.mTempMat.appendRotation(degree * MathConst.MATH_PI_OVER_180, this.mInitRV);
            // this.mLookAtDirec.x = this.mCamPos.x - this.mLookAtPos.x;
            // this.mLookAtDirec.y = this.mCamPos.y - this.mLookAtPos.y;
            // this.mLookAtDirec.z = this.mCamPos.z - this.mLookAtPos.z;
			this.mLookAtDirec.subVecsTo(this.mCamPos, this.mLookAtPos);

            this.mTempMat.transformVectorSelf(this.mLookAtDirec);
            // this.mCamPos.x = this.mLookAtDirec.x + this.mLookAtPos.x;
            // this.mCamPos.y = this.mLookAtDirec.y + this.mLookAtPos.y;
            // this.mCamPos.z = this.mLookAtDirec.z + this.mLookAtPos.z;
			this.mCamPos.addVecsTo(this.mLookAtDirec, this.mLookAtPos);

            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);

            this.mLookRHEnabled = true;
            this.mLookDirectNV.copyFrom(this.mLookAtDirec);
            this.mLookDirectNV.normalize();

            Vector3.Cross(this.mInitRV, this.mLookAtDirec, this.mUp);
            this.mUp.normalize();
            this.mInitUp.copyFrom(this.mUp);
            this.mChanged = true;
        }
    }
    setPosition(v3: Vector3): void {
        if (this.mUnlock) {
            Vector3.Cross(this.mLookAtDirec, this.mUp, this.mTempV);
            let dot = this.mTempV.dot(this.mInitUp);
            this.mTempV1.copyFrom(this.mInitUp);
            this.mTempV1.scaleBy(dot);
            this.mTempV.subtractBy(this.mTempV1);

            this.mCamPos.copyFrom(v3);
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
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
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
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
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookRHEnabled = true;
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
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookRHEnabled = true;
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
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookRHEnabled = true;
            this.mLookDirectNV.copyFrom(this.mLookAtDirec);
            this.mLookDirectNV.normalize();
            Vector3.Cross(this.mLookAtDirec, this.mUp, this.mInitRV);
            this.mInitRV.normalize();
            this.mChanged = true;
        }
    }
    copyFrom(tarCam: Camera): void {
        let pv = tarCam.getPosition();
        this.mCamPos.copyFrom(pv);
        pv = tarCam.getLookAtPosition();
        this.mLookAtPos.copyFrom(pv);
        this.setZNear(tarCam.getZNear());
        this.setZFar(tarCam.getZFar());
        this.setNearPlaneWidth(tarCam.getNearPlaneWidth());
        this.setNearPlaneHeight(tarCam.getNearPlaneHeight());
        this.setPerspectiveEnabled(tarCam.getPerspectiveEnabled());
        this.mViewInvMat.copyFrom(tarCam.getViewInvMatrix());
    }
    private m_tempNV = new Vector3();
    private m_tempUPV = new Vector3();
    private m_tempRV = new Vector3();
    private m_tempCamPos = new Vector3();
    private m_tempLookAtPos = new Vector3();
    // view space axis z
    getNV(): Vector3 { this.m_tempNV.copyFrom(this.mLookDirectNV); return this.m_tempNV;}
    // view space axis y
    getUV(): Vector3 { this.m_tempUPV.copyFrom(this.mUp); return this.m_tempUPV; }
    // view space axis x
    getRV(): Vector3 { this.m_tempRV.copyFrom(this.mInitRV); return this.m_tempRV; }
    getPosition():Vector3 { this.m_tempCamPos.copyFrom(this.mCamPos); return this.m_tempCamPos; }
    getLookAtPosition(): Vector3 { this.m_tempLookAtPos.copyFrom(this.mLookAtPos); return this.m_tempLookAtPos; }
    setLookAtPosition(pv: Vector3): void {
        if (this.mUnlock) {
            this.mLookAtPos.copyFrom(pv);
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookDirectNV.copyFrom(this.mLookAtDirec);
            this.mLookDirectNV.normalize();
            this.mChanged = true;
        }
    }
    setLookAtXYZ(px: number, py: number, pz: number): void {
        if (this.mUnlock) {
            this.mLookAtPos.setXYZ(px, py, pz);
            // this.mLookAtDirec.x = this.mLookAtPos.x - this.mCamPos.x;
            // this.mLookAtDirec.y = this.mLookAtPos.y - this.mCamPos.y;
            // this.mLookAtDirec.z = this.mLookAtPos.z - this.mCamPos.z;
			this.mLookAtDirec.subVecsTo(this.mLookAtPos, this.mCamPos);
            this.mLookDirectNV.copyFrom(this.mLookAtDirec);
            this.mLookDirectNV.normalize();
            this.mChanged = true;
        }
    }
    getPerspectiveEnabled(): boolean { return this.mPerspectiveEnabled; }
    setPerspectiveEnabled(boo: boolean): void { this.mPerspectiveEnabled = boo; }

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
    setRotationX(degree: number): void { this.mRotV.x = degree; this.mChanged = true; this.m_axisRotEnabled = false; }
    getRotationX(): number { return this.mRotV.x; }
    setRotationY(degree: number): void { this.mRotV.y = degree; this.mChanged = true; this.m_axisRotEnabled = false; }
    getRotationY(): number { return this.mRotV.y; }
    setRotationZ(degree: number): void { this.mRotV.z = degree; this.mChanged = true; this.m_axisRotEnabled = false; }
    getRotationZ() { return this.mRotV.z; }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        if (this.mUnlock) {
            this.mRotV.setXYZ(rx,ry,rz);
            this.mChanged = true;
            this.m_axisRotEnabled = false;
        }
    }
    screenXYToViewXYZ(px: number, py: number, outV: Vector3): void {
        px -= this.mViewX;
        py -= this.mViewY;
        if (this.mPerspectiveEnabled) {
            px = this.mNearPlaneW * (px - this.mViewHalfW) / this.mViewHalfW;
            py = this.mNearPlaneH * (this.mViewHalfH - py) / this.mViewHalfH;
        }
        outV.setXYZ(px, py, -this.mZNear);
        //
    }
    screenXYToWorldXYZ(px: number, py: number, outV: Vector3): void {
        px -= this.mViewX;
        py -= this.mViewY;
        if (this.mPerspectiveEnabled) {
            px = 0.5 * this.mNearPlaneW * (px - this.mViewHalfW) / this.mViewHalfW;
            py = 0.5 * this.mNearPlaneH * (this.mViewHalfH - py) / this.mViewHalfH;
        }
        outV.setXYZ(px, py, -this.mZNear);
        outV.w = 1.0;
        this.mViewInvMat.transformVectorSelf(outV);
    }
    getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: Vector3, ray_tv: Vector3): void {
        //console.log("screenX,screenY: ",screenX,screenY,this.mViewHalfW,this.mViewHalfH);
        screenX -= this.mViewX;
        screenY -= this.mViewY;
        if (this.mPerspectiveEnabled) {
            screenX = 0.5 * this.mNearPlaneW * (screenX - this.mViewHalfW) / this.mViewHalfW;
            screenY = 0.5 * this.mNearPlaneH * (screenY - this.mViewHalfH) / this.mViewHalfH;
            ray_pos.setXYZ(screenX, screenY, -this.mZNear);
            ray_pos.w = 1.0;
            this.mViewInvMat.transformVectorSelf(ray_pos);
            ray_tv.copyFrom(ray_pos);
            ray_tv.subtractBy(this.mCamPos);
            ray_tv.normalize();
        }
        else {
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
    private m_frustumWAABB = new AABB();
    private m_invViewMat: Matrix4 = null;
    private m_nearPlaneHalfW = 0.5;
    private m_nearPlaneHalfH = 0.5;
    private m_nearWCV = new Vector3();
    private m_farWCV = new Vector3();
    private m_wNV = new Vector3();
    // 4 far point, 4 near point
    private m_wFrustumVS: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), null, null, null];
    // world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
    private m_wFruPlanes: Plane[] = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
    private m_fpns: Vector3[] = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
    private m_fpds: number[] = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    getFrustumWorldPlantAt(i: number): Plane {
        return this.m_wFruPlanes[i];
    }
    getInvertViewMatrix(): Matrix4 { return this.m_invViewMat; };
    getZNear(): number { return this.mZNear; }
    setZNear(value: number): void { this.mZNear = value; }
    getZFar(): number { return this.mZFar; }
    setZFar(value: number): void { this.mZFar = value; }
    getNearPlaneWidth(): number { return this.mNearPlaneW; }
    setNearPlaneWidth(value: number): void { this.mNearPlaneW = value; }
    getNearPlaneHeight(): number { return this.mNearPlaneH; }
    setNearPlaneHeight(value: number): void { this.mNearPlaneH = value; }
    getFov(): number {
        return this.mFovRadian;
    }
    private __calcTestParam(): void {
        if (this.m_invViewMat == null) this.m_invViewMat = new Matrix4();
        this.m_invViewMat.copyFrom(this.mViewMat);
        this.m_invViewMat.invert();

        let plane: Plane = null;
        let halfMinH = this.mViewHalfH;
        let halfMinW = this.mViewHalfW;
        let halfMaxH = this.mViewHalfH;
        let halfMaxW = this.mViewHalfW;
        if(this.mPerspectiveEnabled) {
            const tanv =  Math.tan(this.mFovRadian * 0.5);
            halfMinH = this.mZNear * tanv;
            halfMinW = halfMinH * this.mAspect;
            halfMaxH = this.mZFar * tanv;
            halfMaxW = halfMaxH * this.mAspect;
        }

		const wfva = this.m_wFrustumVS;
		const wfpa = this.m_wFruPlanes;
        //console.log("Camera::__calcTestParam(), (halfMinW, halfMinH): "+halfMinW+", "+halfMinH);
        this.m_nearPlaneHalfW = halfMinW;
        this.m_nearPlaneHalfH = halfMinH;
        // inner view space
        this.m_nearWCV.setXYZ(0, 0, -this.mZNear);
        this.m_farWCV.setXYZ(0, 0, -this.mZFar);
        this.m_invViewMat.transformVectorSelf(this.m_nearWCV);
        this.m_invViewMat.transformVectorSelf(this.m_farWCV);
		this.m_wNV.subVecsTo(this.m_farWCV, this.m_nearWCV);
        this.m_wNV.normalize();

        // front face, far plane
        plane = wfpa[0];
        plane.nv.copyFrom(this.m_wNV);
        plane.distance = plane.nv.dot(this.m_farWCV);
        plane.position.copyFrom(this.m_farWCV);
        // back face, near face
        plane = wfpa[1];
        plane.nv.copyFrom(wfpa[0].nv);
        plane.distance = plane.nv.dot(this.m_nearWCV);
        plane.position.copyFrom(this.m_nearWCV);

        wfva[8] = this.m_nearWCV;
        wfva[9] = this.m_farWCV;
        wfva[11] = this.m_wNV;
        // far face
        wfva[0].setXYZ(-halfMaxW, -halfMaxH, -this.mZFar);
        wfva[1].setXYZ(halfMaxW, -halfMaxH, -this.mZFar);
        wfva[2].setXYZ(halfMaxW, halfMaxH, -this.mZFar);
        wfva[3].setXYZ(-halfMaxW, halfMaxH, -this.mZFar);
        // near face
        wfva[4].setXYZ(-halfMinW, -halfMinH, -this.mZNear);
        wfva[5].setXYZ(halfMinW, -halfMinH, -this.mZNear);
        wfva[6].setXYZ(halfMinW, halfMinH, -this.mZNear);
        wfva[7].setXYZ(-halfMinW, halfMinH, -this.mZNear);

        const invM = this.m_invViewMat;
        invM.transformVectorSelf(wfva[0]);
        invM.transformVectorSelf(wfva[1]);
        invM.transformVectorSelf(wfva[2]);
        invM.transformVectorSelf(wfva[3]);
        invM.transformVectorSelf(wfva[4]);
        invM.transformVectorSelf(wfva[5]);
        invM.transformVectorSelf(wfva[6]);
        invM.transformVectorSelf(wfva[7]);

        this.m_frustumWAABB.reset();
        for (let i = 0; i < 8; ++i) {
            this.m_frustumWAABB.addPosition(wfva[i]);
        }
        this.m_frustumWAABB.updateFast();

        // bottom
		this.mTempV.subVecsTo(wfva[0], wfva[4]);
        let v0 = wfva[1];
		this.mTempV1.subVecsTo(wfva[1], wfva[5]);
        plane = wfpa[3];
        Vector3.Cross(this.mTempV1, this.mTempV, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // top
		this.mTempV.subVecsTo(wfva[3], wfva[7]);
        v0 = wfva[2];
		this.mTempV1.subVecsTo(wfva[2], wfva[6]);
        plane = wfpa[2];
        Vector3.Cross(this.mTempV1, this.mTempV, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // left
		this.mTempV.subVecsTo(wfva[0], wfva[4]);
        v0 = wfva[3];
		this.mTempV1.subVecsTo(wfva[3], wfva[7]);
        plane = wfpa[4];
        Vector3.Cross(this.mTempV, this.mTempV1, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
        // right
		this.mTempV.subVecsTo(wfva[1], wfva[5]);
        v0 = wfva[2];
		this.mTempV1.subVecsTo(wfva[2], wfva[6]);
        plane = wfpa[5];
        Vector3.Cross(this.mTempV, this.mTempV1, plane.nv);
        plane.nv.normalize();
        plane.distance = plane.nv.dot(v0);
        plane.position.copyFrom(v0);
		const fpna = this.m_fpns;
        fpna[0].copyFrom(wfpa[0].nv);
        fpna[1].copyFrom(wfpa[1].nv);
        fpna[1].scaleBy(-1.0);
        fpna[2].copyFrom(wfpa[2].nv);
        fpna[3].copyFrom(wfpa[3].nv);
        fpna[3].scaleBy(-1.0);
        fpna[4].copyFrom(wfpa[4].nv);
        fpna[4].scaleBy(-1.0);
        fpna[5].copyFrom(wfpa[5].nv);

		const fpda = this.m_fpds;
        fpda[0] = wfpa[0].distance;
        fpda[1] = -wfpa[1].distance;
        fpda[2] = wfpa[2].distance;
        fpda[3] = -wfpa[3].distance;
        fpda[4] = -wfpa[4].distance;
        fpda[5] = wfpa[5].distance;
    }
    getWordFrustumWAABB(): AABB { return this.m_frustumWAABB; }
    getWordFrustumWAABBCenter(): Vector3 { return this.m_frustumWAABB.center; }
    getWordFrustumVtxArr(): Vector3[] { return this.m_wFrustumVS; }
    getWordFrustumPlaneArr(): Plane[] { return this.m_wFruPlanes; }

    /**
     * @param w_cv 世界坐标位置
     * @param radius 球体半径
     * @returns 0表示完全不会再近平面内, 1表示完全在近平面内, 2表示和近平面相交
     */
    visiTestNearPlaneWithSphere(w_cv: Vector3, radius: number): number {
        const v = this.m_fpns[1].dot(w_cv) - this.m_fpds[1];// - radius;
        if((v - radius) > pmin) {
            // 表示完全在近平面之外，也就是前面
            return 0;
        }else if((v + radius) < MathConst.MATH_MAX_NEGATIVE){
            // 表示完全在近平面内, 也就是后面
            return 1;
        }
        // 表示和近平面相交
        return 2;
    }
    visiTestSphere2(w_cv: Vector3, radius: number): boolean {

        let boo = (this.m_fpns[0].dot(w_cv) - this.m_fpds[0] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[1].dot(w_cv) - this.m_fpds[1] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[2].dot(w_cv) - this.m_fpds[2] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[3].dot(w_cv) - this.m_fpds[3] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[4].dot(w_cv) - this.m_fpds[4] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[5].dot(w_cv) - this.m_fpds[5] - radius) > pmin;
        if (boo) return false;
        return true;
    }

    visiTestSphere3(w_cv: Vector3, radius: number, farROffset: number): boolean {

        let boo = (this.m_fpns[0].dot(w_cv) - this.m_fpds[0] + farROffset - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[1].dot(w_cv) - this.m_fpds[1] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[2].dot(w_cv) - this.m_fpds[2] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[3].dot(w_cv) - this.m_fpds[3] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[4].dot(w_cv) - this.m_fpds[4] - radius) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[5].dot(w_cv) - this.m_fpds[5] - radius) > pmin;
        if (boo) return false;
        return true;
    }
    visiTestPosition(pv: Vector3): boolean {
        let boo = (this.m_fpns[0].dot(pv) - this.m_fpds[0]) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[1].dot(pv) - this.m_fpds[1]) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[2].dot(pv) - this.m_fpds[2]) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[3].dot(pv) - this.m_fpds[3]) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[4].dot(pv) - this.m_fpds[4]) > pmin;
        if (boo) return false;
        boo = (this.m_fpns[5].dot(pv) - this.m_fpds[5]) > pmin;
        if (boo) return false;
        return true;
    }
    visiTestPlane(nv: Vector3, distance: number): boolean {
		const ls = this.m_wFruPlanes;
        let f0 = (nv.dot(ls[0].position) - distance);
        let f1 = f0 * (nv.dot(ls[1].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[2].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[3].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[4].position) - distance);
        if (f1 < pmin) return true;
        f1 = f0 * (nv.dot(ls[5].position) - distance);
        if (f1 < pmin) return true;
        return false;
    }
    //this.m_wFruPlanes
    // frustum intersect sphere in wrod space
    visiTestSphere(w_cv: Vector3, radius: number): boolean {
		const ls = this.m_wFruPlanes;
        let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius);
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
                }
                else {
                    return false;
                }
            }
            pf0 = ls[4].intersectSphere(w_cv, radius);
            pf1 = ls[5].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[4].intersectBoo || ls[5].intersectBoo) {
                }
                else {
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
        //trace("ro.bounds.getCenter(): "+ro.bounds.getCenter()+","+ro.bounds.getRadius());
        //return m_frustumWAABB.sphereIntersectFast(ro.bounds.getCenter(),ro.bounds.getRadius());
        let w_cv = ab.center;
        let radius = ab.radius;
        let boo = this.m_frustumWAABB.sphereIntersect(w_cv, radius);
		const ls = this.m_wFruPlanes;

        if (boo) {
            let pf0 = ls[0].intersectSphere(w_cv, radius);
            let pf1 = ls[1].intersectSphere(w_cv, radius);
            if (pf0 * pf1 >= 0) {
                if (ls[0].intersectBoo || ls[1].intersectBoo) {
                }
                else {
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
    private mViewMatrix: Matrix4 = null;
    setViewMatrix(viewMatrix: Matrix4): void {
        this.mViewMatrix = viewMatrix;
        this.mChanged = true;
    }
    update(): void {
        if (this.mChanged) {
            this.version++;
            this.mChanged = false;
            if(!this.mViewMatrix) {

                if (this.m_axisRotEnabled) {
                    this.mMatrix.appendRotationPivot(this.m_rotDegree * MathConst.MATH_PI_OVER_180, this.m_rotAxis, this.m_rotPivotPoint);
                }
                else {
                    this.mMatrix.identity();
                    this.mMatrix.appendRotationEulerAngle(this.mRotV.x * MathConst.MATH_PI_OVER_180, this.mRotV.y * MathConst.MATH_PI_OVER_180, this.mRotV.z * MathConst.MATH_PI_OVER_180);
                }
                if (this.mLookRHEnabled) {
                    this.mViewMat.lookAtRH(this.mCamPos, this.mLookAtPos, this.mUp);
                }
                else {
                    this.mViewMat.lookAtLH(this.mCamPos, this.mLookAtPos, this.mUp);
                }
                this.mViewMat.append(this.mMatrix);
            }
            else {
                this.mViewMat.copyFrom(this.mViewMatrix);
            }
            if (this.mProject2Enabled) {
                this.mNearPlaneW = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
                this.mNearPlaneH = this.mNearPlaneW / this.mAspect;
            }
            else {
                this.mNearPlaneH = this.mZNear * Math.tan(this.mFovRadian * 0.5) * 2.0;
                this.mNearPlaneW = this.mAspect * this.mNearPlaneH;
            }
            this.mViewInvMat.copyFrom(this.mViewMat);
            this.mViewInvMat.invert();
            //
            this.mVPMat.identity();
            this.mVPMat.copyFrom(this.mViewMat);
            this.mVPMat.append(this.mProjMat);

            this.__calcTestParam();
            // very very important !!!
            this.updateUniformData();
        }
    }
    // updateCamMatToUProbe(uniformProbe: IShaderUniformProbe): void {
    //     if (uniformProbe.isEnabled()) {
    //         uniformProbe.update();
    //         uniformProbe.getFS32At(0).set(this.mViewMat.getLocalFS32(), 0);
    //         uniformProbe.getFS32At(1).set(this.mProjMat.getLocalFS32(), 0);
    //     }
    // }
    private updateUniformData(): void {

        // if (this.uniformEnabled) {
        //     this.updateCamMatToUProbe(this.matUProbe);
        //     this.ufrustumProbe.setVec4DataAt(0, this.mZNear, this.mZFar, this.m_nearPlaneHalfW, this.m_nearPlaneHalfH);
        //     this.ufrustumProbe.update();
        //     this.ucameraPosProbe.setVec4DataAt(0, this.mCamPos.x,this.mCamPos.y,this.mCamPos.z,1.0);
        //     this.ucameraPosProbe.update();
        // }
        this.viewUniformV.upate();
        this.projUniformV.upate();
    }
    destroy(): void {
    }
    lookRHEnabled(): boolean {
        return this.mLookRHEnabled;
    }
    lookLHEnabled(): boolean {
        return !this.mLookRHEnabled;
    }
    getVPMatrix(): Matrix4 {
        return this.mVPMat;
    }
    getViewMatrix(): Matrix4 {
        return this.mViewMat;
    }
    getViewInvMatrix(): Matrix4 {
        return this.mViewInvMat;
    }
    getProjectMatrix(): Matrix4 {
        return this.mProjMat;
    }
}
export default Camera;

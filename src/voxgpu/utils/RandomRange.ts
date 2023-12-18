/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import Matrix4 from "../math/Matrix4";
import AABB from "../cgeom/AABB";
class RandomRange {
    constructor() {

    }
    min = 0.0;
    max = 1.0;
    value = 0.5;
    private mRange = 1.0;
    initialize(): void {
        this.mRange = this.max - this.min;
    }
    calc(): void {
        this.value = Math.random() * this.mRange + this.min;
    }
    calcRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
// face order: -y,+y,+x,-z,-x,+z
class CubeOuterRandomRange {
    
    value = new Vector3();
    aabb = new AABB();
    private mSpaceMat = new Matrix4();
    private mSpaceRotBoo = false;
    private mRange = new Vector3();
    private mPos = new Vector3();

    // private mFaces: Vector3[] = [
    //     new Vector3(0,-1,0),
    //     new Vector3(0,1,0),
    //     new Vector3(1, 0,0),
    //     new Vector3(0,0,-1),
    //     new Vector3(-1, 0,0),
    //     new Vector3(0, 0, 1)
    // ];

    set min(v3: Vector3) {
        this.aabb.min.copyFrom(v3);
    }
    get min(): Vector3 {
        return this.aabb.min;
    }
    set max(v3: Vector3) {
        this.aabb.max.copyFrom(v3);
    }
    get max(): Vector3 {
        return this.aabb.max;
    }

    initialize(): void {
        this.mRange.x = this.max.x - this.min.x;
        this.mRange.y = this.max.y - this.min.y;
        this.mRange.z = this.max.z - this.min.z;
        this.aabb.update();
    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        
        this.mSpaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        
        this.mSpaceMat.appendScaleXYZ(sx, sy, sz);
    }

    calc(): void {
        // error function

        let v = this.value;
        let minV = this.min;
        let r = this.mRange;
        v.x = Math.random() * r.x + minV.x;
        v.y = Math.random() * r.y + minV.y;
        v.z = Math.random() * r.z + minV.z;
        
        let pv = this.mPos;
        this.aabb.getClosePosition(v, pv);

        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVector3Self(v);
        }
    }
    calcRange(minV3: Vector3, maxV3: Vector3, outV3: Vector3): void {
        outV3.x = Math.random() * (maxV3.x - minV3.x) + minV3.x;
        outV3.y = Math.random() * (maxV3.y - minV3.y) + minV3.y;
        outV3.z = Math.random() * (maxV3.z - minV3.z) + minV3.z;
        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVectorSelf(outV3);
        }
    }
}
class CubeRandomRange {
    min = new Vector3();
    max = new Vector3(100, 100, 100);
    value = new Vector3();

    private mSpaceMat = new Matrix4();
    private mSpaceRotBoo = false;
    private mRange = new Vector3();
    initialize(): void {
        this.mRange.x = this.max.x - this.min.x;
        this.mRange.y = this.max.y - this.min.y;
        this.mRange.z = this.max.z - this.min.z;
    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        
        this.mSpaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        
        this.mSpaceMat.appendScaleXYZ(sx, sy, sz);
    }

    calc(): void {

        this.value.x = Math.random() * this.mRange.x + this.min.x;
        this.value.y = Math.random() * this.mRange.y + this.min.y;
        this.value.z = Math.random() * this.mRange.z + this.min.z;
        
        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVector3Self(this.value);
        }
    }
    calcRange(minV3: Vector3, maxV3: Vector3, outV3: Vector3): void {
        outV3.x = Math.random() * (maxV3.x - minV3.x) + minV3.x;
        outV3.y = Math.random() * (maxV3.y - minV3.y) + minV3.y;
        outV3.z = Math.random() * (maxV3.z - minV3.z) + minV3.z;
        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVectorSelf(outV3);
        }
    }
}

class CylinderRandomRange {
    constructor() {
    }
    minRadius = 0;
    maxRadius = 50;
    minAzimuthalAngle = 0;
    maxAzimuthalAngle = 360;
    minHeight = -100;
    maxHeight = 100;
    value = new Vector3();
    yToZEnabled = true;

    private mSpaceMat = new Matrix4();
    private mSpaceRotBoo = false;
    private mPR = 0;
    private mRad = 0;
    private mMinAzimuthalRad = 0;
    private mRange = new Vector3();
    
    initialize() {
        this.mRange.x = this.maxRadius - this.minRadius;
        this.mMinAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.mRange.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.mMinAzimuthalRad;
        this.mRange.z = this.maxHeight - this.minHeight;
    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        
        this.mSpaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        this.mSpaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc(): void {
        // (ρ, φ, z)
        // x=ρ*cosφ
        // y=ρ*sinφ
        // z=z
        this.mPR = Math.random() * this.mRange.x + this.minRadius;
        this.mRad = Math.random() * this.mRange.y + this.mMinAzimuthalRad;
        
        this.value.x = this.mPR * Math.cos(this.mRad);
        if (this.yToZEnabled) {
            this.value.y = Math.random() * this.mRange.z + this.minHeight;
            this.value.z = this.mPR * Math.sin(this.mRad);
        } else {
            this.value.z = Math.random() * this.mRange.z + this.minHeight;
            this.value.y = this.mPR * Math.sin(this.mRad);
        }
        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVectorSelf(this.value);
        }
    }
}


class SphereRandomRange {
    private mSpaceMat = new Matrix4();
    private mSpaceRotBoo = false;
    private mPR = 0.0;
    private m_arad = 0.0;
    private m_prad = 0.0;
    private mMinAzimuthalRad = 0.0
    private m_minPolarRad = 0.0;    
    private mRange = new Vector3();
    
    minRadius = 0;
    maxRadius = 50;
    minAzimuthalAngle = 0.0;
    maxAzimuthalAngle = 360.0;
    minPolarAngle = 0.0;
    maxPolarAngle = 180.0;

    yToZEnabled = true;
    value = new Vector3();

    constructor() {
    }
    initialize(): void {
        this.mRange.x = this.maxRadius - this.minRadius;

        this.mMinAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.m_minPolarRad = this.minPolarAngle * MathConst.MATH_PI_OVER_180;

        this.mRange.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.mMinAzimuthalRad;

        this.mRange.z = this.maxPolarAngle * MathConst.MATH_PI_OVER_180 - this.m_minPolarRad;

    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        this.mSpaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.mSpaceRotBoo) {
            this.mSpaceMat.identity();
        }
        this.mSpaceRotBoo = true;
        this.mSpaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc(): void {

        // (r, θ, φ)
        // x=rsinθcosφ
        // y=rsinθsinφ
        // z=rcosθ

        this.mPR = Math.random() * this.mRange.x + this.minRadius;
        this.m_arad = Math.random() * this.mRange.y + this.mMinAzimuthalRad;
        this.m_prad = Math.random() * this.mRange.z + this.m_minPolarRad;

        let sinv = this.mPR * Math.sin(this.m_prad);

        this.value.x = sinv * Math.cos(this.m_arad);
        if (this.yToZEnabled) {
            this.value.z = sinv * Math.sin(this.m_arad);
            this.value.y = this.mPR * Math.cos(this.m_prad);
        } else {
            this.value.y = sinv * Math.sin(this.m_arad);
            this.value.z = this.mPR * Math.cos(this.m_prad);
        }

        if (this.mSpaceRotBoo) {
            this.mSpaceMat.transformVectorSelf(this.value);
        }
    }
}
class CurveRandomRange {
    constructor() {
    }
}
export { CubeOuterRandomRange, RandomRange, CubeRandomRange, CylinderRandomRange, SphereRandomRange, CurveRandomRange };
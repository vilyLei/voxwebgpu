/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import Matrix4 from "../math/Matrix4";
class RandomRange {
    constructor() {

    }
    min = 0.0;
    max = 1.0;
    value = 0.5;
    private m_range: number = 1.0;
    initialize(): void {
        this.m_range = this.max - this.min;
    }
    calc(): void {
        this.value = Math.random() * this.m_range + this.min;
    }
    calcRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}

class CubeRandomRange {
    min = new Vector3();
    max = new Vector3(100, 100, 100);
    value = new Vector3();

    private m_spaceMat = new Matrix4();
    private m_spaceRotBoo = false;
    private m_range = new Vector3();
    initialize(): void {
        this.m_range.x = this.max.x - this.min.x;
        this.m_range.y = this.max.y - this.min.y;
        this.m_range.z = this.max.z - this.min.z;
    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }

    calc(): void {

        this.value.x = Math.random() * this.m_range.x + this.min.x;
        this.value.y = Math.random() * this.m_range.y + this.min.y;
        this.value.z = Math.random() * this.m_range.z + this.min.z;
        
        if (this.m_spaceRotBoo) {
            this.m_spaceMat.transformVector3Self(this.value);
        }
    }
    calcRange(minV3: Vector3, maxV3: Vector3, outV3: Vector3): void {
        outV3.x = Math.random() * (maxV3.x - minV3.x) + minV3.x;
        outV3.y = Math.random() * (maxV3.y - minV3.y) + minV3.y;
        outV3.z = Math.random() * (maxV3.z - minV3.z) + minV3.z;//
        if (this.m_spaceRotBoo) {
            this.m_spaceMat.transformVectorSelf(outV3);
        }
    }
    // need uneven distribution
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
    yToZEnabled: boolean = true;

    private m_spaceMat = new Matrix4();
    private m_spaceRotBoo = false;
    private m_pr = 0.0;
    private m_rad = 0.0;
    private m_minAzimuthalRad = 0.0;
    private m_range = new Vector3();
    
    initialize() {
        this.m_range.x = this.maxRadius - this.minRadius;
        this.m_minAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.m_range.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.m_minAzimuthalRad;
        this.m_range.z = this.maxHeight - this.minHeight;
        //m_range.z = this.max.z - this.min.z;
    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc(): void {
        // (ρ, φ, z)
        // x=ρ*cosφ
        // y=ρ*sinφ
        // z=z
        this.m_pr = Math.random() * this.m_range.x + this.minRadius;
        this.m_rad = Math.random() * this.m_range.y + this.m_minAzimuthalRad;
        
        this.value.x = this.m_pr * Math.cos(this.m_rad);
        if (this.yToZEnabled) {
            this.value.y = Math.random() * this.m_range.z + this.minHeight;
            this.value.z = this.m_pr * Math.sin(this.m_rad);
        } else {
            this.value.z = Math.random() * this.m_range.z + this.minHeight;
            this.value.y = this.m_pr * Math.sin(this.m_rad);
        }
        if (this.m_spaceRotBoo) {
            this.m_spaceMat.transformVectorSelf(this.value);
        }
    }
}


class SphereRandomRange {
    private m_spaceMat = new Matrix4();
    private m_spaceRotBoo = false;
    private m_pr = 0.0;
    private m_arad = 0.0;
    private m_prad = 0.0;
    private m_minAzimuthalRad = 0.0
    private m_minPolarRad = 0.0;    
    private m_range = new Vector3();
    
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
        this.m_range.x = this.maxRadius - this.minRadius;

        this.m_minAzimuthalRad = this.minAzimuthalAngle * MathConst.MATH_PI_OVER_180;
        this.m_minPolarRad = this.minPolarAngle * MathConst.MATH_PI_OVER_180;

        this.m_range.y = this.maxAzimuthalAngle * MathConst.MATH_PI_OVER_180 - this.m_minAzimuthalRad;

        this.m_range.z = this.maxPolarAngle * MathConst.MATH_PI_OVER_180 - this.m_minPolarRad;

    }
    setSpaceRotation(degree_rx: number, degree_ry: number, degree_rz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        this.m_spaceMat.appendRotationEulerAngle(degree_rx * MathConst.MATH_PI_OVER_180, degree_ry * MathConst.MATH_PI_OVER_180, degree_rz * MathConst.MATH_PI_OVER_180);
    }
    setSpaceScale(sx: number, sy: number, sz: number): void {
        if (!this.m_spaceRotBoo) {
            this.m_spaceMat.identity();
        }
        this.m_spaceRotBoo = true;
        this.m_spaceMat.appendScaleXYZ(sx, sy, sz);
    }
    calc(): void {

        // (r, θ, φ)
        // x=rsinθcosφ
        // y=rsinθsinφ
        // z=rcosθ

        this.m_pr = Math.random() * this.m_range.x + this.minRadius;
        this.m_arad = Math.random() * this.m_range.y + this.m_minAzimuthalRad;
        this.m_prad = Math.random() * this.m_range.z + this.m_minPolarRad;

        let sinv = this.m_pr * Math.sin(this.m_prad);

        this.value.x = sinv * Math.cos(this.m_arad);
        if (this.yToZEnabled) {
            this.value.z = sinv * Math.sin(this.m_arad);
            this.value.y = this.m_pr * Math.cos(this.m_prad);
        } else {
            this.value.y = sinv * Math.sin(this.m_arad);
            this.value.z = this.m_pr * Math.cos(this.m_prad);
        }

        if (this.m_spaceRotBoo) {
            this.m_spaceMat.transformVectorSelf(this.value);
        }
    }
}
class CurveRandomRange {
    constructor() {
    }
}
export { RandomRange, CubeRandomRange, CylinderRandomRange, SphereRandomRange, CurveRandomRange };
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
// import IAABB from "../cgeom/IAABB";

import IMatrix4 from "../math/IMatrix4";
import { IRenderFrustum } from "./IRenderFrustum";

interface IRenderCamera {

	inversePerspectiveZ: boolean;
    version: number;
	frustum: IRenderFrustum;

    viewX: number;
    viewY: number;
    viewWidth: number;
    viewHeight: number;
    nearPlaneWidth: number;
    nearPlaneHeight: number;
    near: number;
    far: number;
	/**
	 * fov radian value
	 */
	fov: number;
    aspect: number;
    viewFieldZoom: number;
    perspective: boolean;
    rightHand: boolean;
	position: IVector3;
	/**
	 * @returns view space z-axis vector3 value in the world space
	 */
    nv: IVector3;
	/**
	 * @returns view space y-axis vector3 value in the world space
	 */
    uv: IVector3;
	/**
	 * @returns view space x-axis vector3 value in the world space
	 */
    rv: IVector3;

    lookRightHand: boolean;
    lookLeftHand: boolean;
    lookPosition: IVector3;

    viewMatrix: IMatrix4;
    projectMatrix: IMatrix4;

    // 不允许外界修改camera数据
    lock(): void;
    // 允许外界修改camera数据
    unlock(): void;
    lookAtLH(camPos: IVector3, lookAtPos: IVector3, up: IVector3): void;
    lookAtRH(camPos: IVector3, lookAtPos: IVector3, up: IVector3): void;

    perspectiveLH(fovy: number, aspect: number, zNear: number, zFar: number): void;
    perspectiveRH(fovy: number, aspect: number, zNear: number, zFar: number): void;
    perspectiveRH2(fovy: number, pw: number, ph: number, zNear: number, zFar: number): void;
    orthoRH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void;
    orthoLH(zNear: number, zFar: number, b: number, t: number, l: number, r: number): void;
    setViewXY(px: number, py: number): void;
    setViewSize(pw: number, ph: number): void;

    screenXYToViewXYZ(px: number, py: number, outV: IVector3): void;
    screenXYToWorldXYZ(px: number, py: number, outV: IVector3): void;
    getWorldPickingRayByScreenXY(screenX: number, screenY: number, ray_pos: IVector3, ray_tv: IVector3): void;
    calcScreenNormalizeXYByWorldPos(pv3: IVector3, scPV3: IVector3): void;
    worldPosToScreen(pv: IVector3): void;

    // 计算3D空间的球体在屏幕空间的最小包围矩形, outV的x,y表示矩形的x和y;outV的z和w表示宽和高,取值0.0 - 1.0之间
    calcScreenRectByWorldSphere(pv: IVector3, radius: number, outV: IVector3): void;
    setLookAtPosition(v: IVector3):void;

    // getWordFrustumVtxArr(): IVector3[];
    // getWordFrustumWAABBCenter(): IVector3;
    // visiTestSphere2(w_cv: IVector3, radius: number): boolean;

    // visiTestNearPlaneWithSphere(w_cv: IVector3, radius: number): number;

    // visiTestSphere3(w_cv: IVector3, radius: number, farROffset: number): boolean;
    // visiTestPosition(pv: IVector3): boolean;
    // visiTestPlane(nv: IVector3, distance: number): boolean;
    //this.m_wFruPlaneList
    // frustum intersect sphere in wrod space
    // visiTestSphere(w_cv: IVector3, radius: number): boolean;
    // visibility test
    // 可见性检测这边可以做的更精细，例如上一帧检测过的对象如果摄像机没有移动而且它自身也没有位置等变化，就可以不用检测
    // 例如精细检测可以分类: 圆球，圆柱体，长方体 等不同的检测模型计算方式会有区别
    // visiTestAABB(ab: IAABB): boolean;

    translation(v3: IVector3): void;
    translationXYZ(px: number, py: number, pz: number): void;
    update(): void;
}

export {IRenderCamera};

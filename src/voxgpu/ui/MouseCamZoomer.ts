
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 摄像机拉近拉远的控制(主要是移动端的多点触摸)

import IVector3 from "../math/IVector3";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderCamera } from "../render/IRenderCamera";
// import RendererDevice from "../render/RendererDevice";
import MouseEvent from "../event/MouseEvent";
import Vector3 from "../math/Vector3";

export default class MouseCamZoomer {
    private m_camera: IRenderCamera = null;

    private m_touchZoomBoo = false;
    private m_preDis = 0;
    private m_touchZoomSpd = 2.0;
    private m_slideSpd = 1.0;
    private m_mouseWheelZoomSpd = 6.0;
    private m_tempa: IVector3;
    private m_tempb: IVector3;
    private m_preva: IVector3;
    private m_prevb: IVector3;
    private m_va: IVector3;
    private m_vb: IVector3;
    private m_lookAt: IVector3;
    private m_lookAtPos: IVector3;
    private m_fowardDis = 0;
    private m_initBoo = true;
    private m_lookAtCtrlEnabled = true;
    private m_flagDrag = 0;
    private m_flagZoom = 0;
    private m_windowsEnvFlag = true;

    syncLookAt = false;
    /**
     * 取值为2, 表示相机的拉近拉远
     * 取值为1, 表示相机的拖动
     */
    private m_flagType: number = 2;
    constructor() {
        // this.m_windowsEnvFlag = !(RendererDevice.IsMobileWeb() || RendererDevice.IsSafariWeb());
        this.m_windowsEnvFlag = true;
    }
    setMobileZoomSpeed(spd: number) {
        this.m_touchZoomSpd = spd;
    }
    seSlideSpeed(spd: number) {
        this.m_slideSpd = spd;
    }
    /**
     * set mousewheel zoom camera forward speed
     * @param spd default value is 6.0
     */
    setMouseWheelZoomSpd(spd: number) {
        this.m_mouseWheelZoomSpd = spd;
    }
    bindCamera(camera: IRenderCamera) {
        this.m_camera = camera;
    }
    private createVec3():Vector3 {
        return new Vector3();
    }

    initialize(stage3D: IRenderStage3D): void {
        if (this.m_initBoo) {
            this.m_initBoo = false;

            this.m_tempa = this.createVec3();
            this.m_tempb = this.createVec3();
            this.m_preva = this.createVec3();
            this.m_prevb = this.createVec3();
            this.m_va = this.createVec3();
            this.m_vb = this.createVec3();
            this.m_lookAt = this.createVec3();
            this.m_lookAtPos = this.createVec3();

            stage3D.addEventListener(MouseEvent.MOUSE_WHEEL, this.mouseWheelListener.bind(this), true, true);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_MOVE, this.mouseMultiMoveListener.bind(this), true, true);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_UP, this.mouseMultiUpListener.bind(this), true, true);
        }
    }
    setLookAtCtrlEnabled(enabled: boolean): void {
        this.m_lookAtCtrlEnabled = enabled;
    }
    private mouseWheelListener(evt: any): void {

        if (evt.wheelDeltaY > 0) {
            this.m_fowardDis += this.m_mouseWheelZoomSpd;
        }
        else {
            this.m_fowardDis -= this.m_mouseWheelZoomSpd;
        }
    }
    private mouseMultiMoveListener(evt: any): void {
        this.setTouchPosArray(evt.posArray);
    }
    private mouseMultiUpListener(evt: any): void {
        this.setTouchPosArray(evt.posArray);
    }
    private resetState(): void {
        this.m_flagDrag = 0;
        this.m_flagZoom = 0;
        this.m_flagType = 0;
    }
    private setTouchPosArray(posArray: any[]): void {
        if (posArray != null && posArray.length > 1) {
            let dis = 0;
            this.m_va.setXYZ(posArray[0].x, posArray[0].y, 0);
            this.m_vb.setXYZ(posArray[1].x, posArray[1].y, 0);
            if (this.m_touchZoomBoo) {
                dis = Vector3.Distance(this.m_va, this.m_vb);
                if (this.m_flagType < 1) {

                    this.m_tempa.copyFrom(this.m_va);
                    this.m_tempb.copyFrom(this.m_vb);
                    this.m_tempa.subVecsTo(this.m_va, this.m_preva);
                    this.m_tempb.subVecsTo(this.m_vb, this.m_prevb);
                    this.m_tempa.normalize();
                    this.m_tempb.normalize();
                    if (this.m_tempa.dot(this.m_tempb) > 0.9) {
                        // 可能是拖动
                        this.m_flagDrag++;
                    }
                    else {
                        // 可能是缩放
                        this.m_flagZoom++;
                    }
                    //DivLog.ShowLog("> "+this.m_flagDrag+","+this.m_flagZoom);
                    if (this.m_flagDrag > 3 || this.m_flagZoom > 3) {
                        this.m_flagType = (this.m_flagDrag > this.m_flagZoom) ? 1 : 2;
                    }
                }
                else {
                    this.m_tempa.subVecsTo(this.m_va, this.m_preva);
                }
                let dv = Math.abs(this.m_preDis - dis);
                if (dv > 0.1) {
                    this.m_fowardDis = (dis - this.m_preDis) * this.m_touchZoomSpd;
                    this.m_preDis = dis;
                }
            }
            else {
                this.m_touchZoomBoo = true;
                this.m_preDis = Vector3.Distance(this.m_va, this.m_vb);
                this.resetState();
            }
        }
        else {
            this.resetState();
            this.m_touchZoomBoo = false;
        }
        this.m_preva.copyFrom(this.m_va);
        this.m_prevb.copyFrom(this.m_vb);
    }
    setLookAtPosition(v: IVector3): void {
        if (this.syncLookAt) {
            if (v == null) {
                v = this.m_lookAt;
            }
            let disFunc = Vector3.DistanceSquared;
            let pv = this.m_camera.lookPosition;
            if(disFunc(v, this.m_lookAtPos) > 0.0001 || disFunc(pv, v) > 0.0001) {
                this.m_camera.setLookAtPosition(v);
                this.m_lookAtPos.copyFrom(v);
            }
        }
    }
    run(minDis: number): void {

        let lookAtEnabled = this.m_lookAtCtrlEnabled;

        if (this.m_camera != null) {

            if (this.m_flagType == 2) {
                // camera foward update
                if (Math.abs(this.m_fowardDis) > 0.001) {
                    let dis = Vector3.Distance(this.m_camera.position, this.m_camera.lookPosition);
                    let pd = this.m_fowardDis;
                    if (this.m_fowardDis > 0) {
                        if (dis > minDis) {
                            pd = dis - minDis;
                            if (pd > this.m_fowardDis) pd = this.m_fowardDis;
                        }
                        else {
                            pd = 0;
                        }
                    }
                    if (Math.abs(pd) > 0.1) {
                        (this.m_camera as any).forward(pd);
                        let v = this.m_lookAtPos;
                        if (lookAtEnabled) (this.m_camera as any).setLookPosXYZFixUp(v.x, v.y, v.z);
                    }
                    if (this.m_windowsEnvFlag) {
                        this.m_fowardDis *= 0.95;
                    }
                    else {
                        this.m_fowardDis = 0;
                    }
                }
            }
            else if (this.m_flagType == 1) {
                // drag to slide
                (this.m_camera as any).slideViewOffsetXY(-this.m_tempa.x * this.m_slideSpd, this.m_tempa.y * this.m_slideSpd);
            }
        }
    }
}

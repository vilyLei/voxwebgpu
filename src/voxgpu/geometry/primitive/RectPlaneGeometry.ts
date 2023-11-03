/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../../math/Vector3";
import AABB from "../../cgeom/AABB";
import GeometryBase from "./GeometryBase";

import { AABBCalc } from "../../cgeom/AABBCalc";

export default class RectPlaneGeometry extends GeometryBase {
    constructor() {
        super();
    }

    offsetU = 0.0;
    offsetV = 0.0;
    uScale = 1.0;
    vScale = 1.0;

    flipVerticalUV = false;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType: number = 0;

    private m_polyhedralBoo = true;
    private m_vs: Float32Array = null
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;

    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    setUVS(uvsLen8: Float32Array): void {
        if (uvsLen8 != null && uvsLen8.length == 8) {
            if (this.m_uvs == null) {
                this.m_uvs = uvsLen8.slice(0);
            }
            else {
                this.m_uvs.set(uvsLen8);
            }
        }
    }

    getNVS(): Float32Array { return this.m_nvs; }
    initialize(startX: number, startY: number, pwidth: number, pheight: number): void {

        if (this.m_vs) {
            return;
        }

        let minX: number = startX;
        let minY: number = startY;
        let maxX: number = startX + pwidth;
        let maxY: number = startY + pheight;
        let pz: number = 0.0;
        //
        // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
        this.m_ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
        //this.m_ivs = new Uint32Array([0,1,2,0,2,3]);
        switch (this.axisType) {
            case 0:
                // XOY plane
                this.m_vs = new Float32Array([
                    minX, minY, pz,
                    maxX, minY, pz,
                    maxX, maxY, pz,
                    minX, maxY, pz
                ]);
                break;
            case 1:
                // XOZ plane
                this.m_vs = new Float32Array([
                    maxX, pz, minY,
                    minX, pz, minY,
                    minX, pz, maxY,
                    maxX, pz, maxY
                ]);
                break;
            case 2:
                // YOZ plane
                this.m_vs = new Float32Array([
                    pz, minX, minY,
                    pz, maxX, minY,
                    pz, maxX, maxY,
                    pz, minX, maxY
                ]);
                break;
            default:
                break;
        }
        if (this.bounds == null) this.bounds = new AABB();
        this.bounds.addFloat32Arr(this.m_vs);
        this.bounds.updateFast();

        if (!this.m_uvs) {
            if (this.flipVerticalUV) {
                this.m_uvs = new Float32Array([
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 0.0 * this.vScale
                ]);
            }
            else {
                this.m_uvs = new Float32Array([
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 1.0 * this.vScale
                ]);
            }
        }

        if (true) {
            switch (this.axisType) {
                case 0:
                    this.m_nvs = new Float32Array([
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0
                    ]);
                    break;
                case 1:
                    this.m_nvs = new Float32Array([
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0
                    ]);
                    break;
                case 2:
                    this.m_nvs = new Float32Array([
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0,
                        1.0, 0.0, 0.0
                    ]);
                    break;
                default:
                    break;
            }
        }

        // this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;

        this.vtxTotal = 4;
        this.trisNumber = 2;
        this.vtCount = this.m_ivs.length;

    }
    vsFloat32: Float32Array = null;
    dataStepList: number[] = null;
    // 是否是多面体实体,如果是，则可以进行三角面的相关计算等操作, 如果不是则需要进行相关的几何算法计算
    isPolyhedral(): boolean { return this.m_polyhedralBoo; }
    // 设置自身是否是多面体实体，根据实际需要改变相关的状态值
    setPolyhedral(boo: boolean): void { this.m_polyhedralBoo = boo; }

    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3, rltv: Vector3, outV: Vector3, boundsHit: boolean): number {
        if (this.m_polyhedralBoo) return -1;
        if (boundsHit) {
            let boo: boolean = AABBCalc.IntersectionRL2(rltv, rlpv, this.bounds, outV);
            return boo ? 1 : -1;
        }
        return -1;
    }
    __$destroy(): void {
        if (this.m_ivs) {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;

            super.__$destroy();
        }
    }
}

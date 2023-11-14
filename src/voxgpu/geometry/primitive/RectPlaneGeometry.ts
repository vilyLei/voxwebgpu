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
	/**
	 * flip vertical uv value
	 */
    flipY = false;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;

    private mvs: Float32Array = null
    private muvs: Float32Array = null;
    private mnvs: Float32Array = null;

    getVS(): Float32Array { return this.mvs; }
    getUVS(): Float32Array { return this.muvs; }
    setUVS(uvsLen8: Float32Array): void {
        if (uvsLen8 != null && uvsLen8.length == 8) {
            if (this.muvs == null) {
                this.muvs = uvsLen8.slice(0);
            }
            else {
                this.muvs.set(uvsLen8);
            }
        }
    }

    getNVS(): Float32Array { return this.mnvs; }
    initialize(startX: number, startY: number, pwidth: number, pheight: number): void {

        if (this.mvs) {
            return;
        }

        let minX = startX;
        let minY = startY;
        let maxX = startX + pwidth;
        let maxY = startY + pheight;
        let pz = 0.0;

        // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
        this.mivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
        //this.mivs = new Uint32Array([0,1,2,0,2,3]);
        switch (this.axisType) {
            case 0:
                // XOY plane
                this.mvs = new Float32Array([
                    minX, minY, pz,
                    maxX, minY, pz,
                    maxX, maxY, pz,
                    minX, maxY, pz
                ]);
                break;
            case 1:
                // XOZ plane
                this.mvs = new Float32Array([
                    maxX, pz, minY,
                    minX, pz, minY,
                    minX, pz, maxY,
                    maxX, pz, maxY
                ]);
                break;
            case 2:
                // YOZ plane
                this.mvs = new Float32Array([
                    pz, minX, minY,
                    pz, maxX, minY,
                    pz, maxX, maxY,
                    pz, minX, maxY
                ]);
                break;
            default:
                break;
        }
        if (!this.bounds) this.bounds = new AABB();
        this.bounds.addFloat32Arr(this.mvs);
        this.bounds.updateFast();

        if (!this.muvs) {
            if (this.flipY) {
                this.muvs = new Float32Array([
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 1.0 * this.vScale,
                    this.offsetU + 1.0 * this.uScale, this.offsetV + 0.0 * this.vScale,
                    this.offsetU + 0.0 * this.uScale, this.offsetV + 0.0 * this.vScale
                ]);
            }
            else {
                this.muvs = new Float32Array([
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
                    this.mnvs = new Float32Array([
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0,
                        0.0, 0.0, 1.0
                    ]);
                    break;
                case 1:
                    this.mnvs = new Float32Array([
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0,
                        0.0, 1.0, 0.0
                    ]);
                    break;
                case 2:
                    this.mnvs = new Float32Array([
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

        this.vtxTotal = 4;
        this.trisNumber = 2;
        this.vtCount = this.mivs.length;

    }

    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3, rltv: Vector3, outV: Vector3, boundsHit: boolean): number {
        if (this.mPolyhedral) return -1;
        if (boundsHit) {
            let boo: boolean = AABBCalc.IntersectionRL2(rltv, rlpv, this.bounds, outV);
            return boo ? 1 : -1;
        }
        return -1;
    }
    __$destroy(): void {
        if (this.mivs) {
            this.bounds = null;

            this.mvs = null;
            this.muvs = null;
            this.mnvs = null;

            super.__$destroy();
        }
    }
}

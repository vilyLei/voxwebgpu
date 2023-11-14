/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../../cgeom/AABB";
import Matrix4 from "../../math/Matrix4";
import Vector3 from "../../math/Vector3";

export default class GeometryData {

    protected mvs: Float32Array = null;
    protected muvs: Float32Array = null;
    protected mnvs: Float32Array = null;
    protected mivs: Uint16Array | Uint32Array = null;

    readonly bounds = new AABB();
    vtxTotal = 0;
    trisNumber = 0;
    vtCount = 0;

    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;
    constructor() { }

    clone(): GeometryData {
        let geometry = new GeometryData();
        geometry.copyFrom( this );
        return geometry;
    }

    copyFrom(src: GeometryData): void {

        let geometry = new GeometryData();

        if(src.mvs != null) {
            if(this.mvs != null)
                this.mvs.set(src.mvs);
            else
                this.mvs = src.mvs.slice(0);
        }
        if(src.muvs != null) {
            if(this.muvs != null)
                this.muvs.set(src.muvs);
            else
                this.muvs = src.muvs.slice(0);
        }
        if(src.mnvs != null) {
            if(this.mnvs != null)
                this.mnvs.set(src.mnvs);
            else
                this.mnvs = src.mnvs.slice(0);
        }
        if(src.mivs != null) {
            if(this.mivs != null)
                this.mivs.set(src.mivs);
            else
                this.mivs = src.mivs.slice(0);
        }

        geometry.vtxTotal = this.vtxTotal;
        geometry.trisNumber = this.trisNumber;
        geometry.vtCount = this.vtCount;
        geometry.bounds.copyFrom( this. bounds );
    }
    getCenterAt(i: number, outV: Vector3): void {
    }
    transformAt(i: number, mat4: Matrix4): void {
    }
    getVSSegAt(i: number): Float32Array {
        return null;
    }
    /**
     * @returns vertex position buffer Float32Array
     */
    getVS(): Float32Array { return this.mvs; }

    /**
     * @returns vertex uv buffer Float32Array
     */
    getUVS(): Float32Array { return this.muvs; }

    /**
     * @returns vertex normal buffer Float32Array
     */
    getNVS(): Float32Array { return this.mnvs; }
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array { return this.mivs; }

    reset(): void {

        this.mvs = null;
        this.muvs = null;
        this.mnvs = null;
        this.mivs = null;

        this.vtxTotal = 0;
        this.trisNumber = 0;
        this.vtCount = 0;
    }
}

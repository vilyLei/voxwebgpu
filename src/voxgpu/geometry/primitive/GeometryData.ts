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
    
    protected m_vs: Float32Array = null;
    protected m_uvs: Float32Array = null;
    protected m_nvs: Float32Array = null;
    protected m_ivs: Uint16Array | Uint32Array = null;

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
        
        if(src.m_vs != null) {
            if(this.m_vs != null)
                this.m_vs.set(src.m_vs);
            else
                this.m_vs = src.m_vs.slice(0);
        }
        if(src.m_uvs != null) {
            if(this.m_uvs != null)
                this.m_uvs.set(src.m_uvs);
            else
                this.m_uvs = src.m_uvs.slice(0);
        }
        if(src.m_nvs != null) {
            if(this.m_nvs != null)
                this.m_nvs.set(src.m_nvs);
            else
                this.m_nvs = src.m_nvs.slice(0);
        }
        if(src.m_ivs != null) {
            if(this.m_ivs != null)
                this.m_ivs.set(src.m_ivs);
            else
                this.m_ivs = src.m_ivs.slice(0);
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
    getVS(): Float32Array { return this.m_vs; }

    /**
     * @returns vertex uv buffer Float32Array
     */
    getUVS(): Float32Array { return this.m_uvs; }

    /**
     * @returns vertex normal buffer Float32Array
     */
    getNVS(): Float32Array { return this.m_nvs; }
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    reset(): void {

        this.m_vs = null;
        this.m_uvs = null;
        this.m_nvs = null;
        this.m_ivs = null;

        this.vtxTotal = 0;
        this.trisNumber = 0;
        this.vtCount = 0;
    }
}
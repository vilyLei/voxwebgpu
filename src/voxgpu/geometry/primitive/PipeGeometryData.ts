/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../../math/Vector3";
import Matrix4 from "../../math/Matrix4";
import GeometryData from "./GeometryData";

export default class PipeGeometryData extends GeometryData {

    private m_longitudeNum = 0;
    private m_latitudeNum = 0;

    uScale = 1.0;
    vScale = 1.0;
    constructor() {
        super();
    }

    clone(): GeometryData {

        let geometry = new PipeGeometryData();

        geometry.m_longitudeNum = this.m_longitudeNum;
        geometry.m_latitudeNum = this.m_latitudeNum;
        geometry.uScale = this.uScale;
        geometry.vScale = this.vScale;

        geometry.copyFrom(this);
        return geometry;
    }
    getCenterAt(i: number, outV: Vector3): void {
        if (i >= 0 && i <= this.m_latitudeNum) {
            if (this.mvs != null) {
                outV.setXYZ(0.0, 0.0, 0.0);
                let pvs: Float32Array = this.mvs;
                let end: number = (i + 1) * (this.m_longitudeNum + 1) * 3;
                i = (i * (this.m_longitudeNum + 1)) * 3;
                end -= 3;
                //console.log("i: "+i,end);
                for (; i < end; i += 3) {
                    outV.x += pvs[i];
                    outV.y += pvs[i + 1];
                    outV.z += pvs[i + 2];
                }
                outV.scaleBy(1.0 / this.m_longitudeNum);
            }
        }
    }
    transformAt(i: number, mat4: Matrix4): void {
        if (i >= 0 && i <= this.m_latitudeNum) {
            const n = this.m_longitudeNum + 1;
            let pvs = this.mvs;
            let end = (i + 1) * n * 3;
            i = i * n * 3;
            mat4.transformVectorsRangeSelf(pvs, i, end);
        }
    }

    getRangeAt(i: number, segLen: number = 3): number[] {
        if (i >= 0 && i <= this.m_latitudeNum) {
            let end = (i + 1) * (this.m_longitudeNum + 1) * segLen;
            i = (i * (this.m_longitudeNum + 1)) * segLen;
            return [i, end];
        }
        return [-1, -1];
    }
    getVSSegAt(i: number): Float32Array {
        if (i >= 0 && i <= this.m_latitudeNum) {
            const n = this.m_longitudeNum + 1;
            let pvs = this.mvs;
            let end = (i + 1) * n * 3;
            i = i * n * 3;
            return pvs.subarray(i, end);
            //mat4.transformVectorsRangeSelf(pvs, i, end);
        }
        return null;
    }
    initialize(radius: number, height: number, rings: number, segments: number, uvType: number = 1, alignYRatio: number = -0.5): void {
        let i = 0;
        let j = 0;
        if (radius < 0.01) radius = 0.01;
        if (rings < 2) rings = 2;
        if (segments < 1) segments = 1;
        this.m_longitudeNum = rings;
        this.m_latitudeNum = segments;

        let mRadius = Math.abs(radius);
        let ph = Math.abs(height);

        let yRad = 0;
        let px = 0;
        let py = 0;
        let minY = alignYRatio * ph;

        this.bounds.min.setXYZ(-radius, minY, -radius);
        this.bounds.max.setXYZ(radius, minY + ph, radius);
        this.bounds.updateFast();

        let vtx = new Vector3();
        let srcRow: Vector3[] = [];
        let pv: Vector3;
        let pi2 = Math.PI * 2;
        for (i = 0; i < 1; ++i) {
            for (j = 0; j < rings; ++j) {
                yRad = (pi2 * j) / rings;
                px = Math.sin(yRad);
                py = Math.cos(yRad);
                vtx.x = px * mRadius;
                vtx.z = py * mRadius;
                pv = new Vector3(vtx.x, vtx.y, vtx.z, 1.0);
                srcRow.push(pv);
            }
            srcRow.push(srcRow[0]);
        }
        this.vtxTotal = (rings + 1) * (segments + 1);
        this.mvs = new Float32Array(this.vtxTotal * 3);
        this.muvs = new Float32Array(this.vtxTotal * 2);
        // calc cylinder wall vertexes
        let tot = segments;
        let k = 0;
        let l = 0;

        for (i = 0; i <= tot; ++i) {
            px = i / tot;
            py = minY + ph * px;
            for (j = 0; j <= rings; ++j) {
                if (uvType < 1) {
                    this.muvs[l++] = this.uScale * (j / rings);
                    this.muvs[l++] = this.uScale * px;
                }
                else {
                    this.muvs[l++] = this.uScale * px;
                    this.muvs[l++] = this.uScale * (j / rings);
                }
                const vtx = srcRow[j];
                switch (this.axisType) {
                    case 1:
                        this.mvs[k++] = vtx.x; this.mvs[k++] = py; this.mvs[k++] = vtx.z;
                        break;
                    case 2:
                        this.mvs[k++] = vtx.z; this.mvs[k++] = vtx.x; this.mvs[k++] = py;
                        break;
                    default:
                        this.mvs[k++] = py; this.mvs[k++] = vtx.z; this.mvs[k++] = vtx.x;
                        break;
                }
            }
        }
        let cn = rings + 1;
        let a = 0;
        let b = 0;
        const size = tot * rings * 6;
        this.mivs = size <= 56635 ? new Uint16Array(size) : new Uint32Array(size);
        k = 0;
        for (i = 0; i < tot; ++i) {
            a = i * cn;
            b = (i + 1) * cn;
            for (j = 1; j <= rings; ++j) {
                this.mivs[k++] = a + j; this.mivs[k++] = b + j - 1; this.mivs[k++] = a + j - 1;
                this.mivs[k++] = a + j; this.mivs[k++] = b + j; this.mivs[k++] = b + j - 1;
            }
        }
        this.vtCount = this.mivs.length;
        this.trisNumber = this.vtCount / 3;
    }
}

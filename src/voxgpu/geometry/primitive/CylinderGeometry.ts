/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import SurfaceNormalCalc from "../../cgeom/SurfaceNormalCalc";
import AABB from "../../cgeom/AABB";
import GeometryBase from "./GeometryBase";
import GeometryVertex from "./GeometryVertex";

export default class CylinderGeometry extends GeometryBase {
    constructor() {
        super();
    }

    private mvs: Float32Array = null;
    private muvs: Float32Array = null;
    private mnvs: Float32Array = null;

    inverseUV = false;
    uScale = 1.0;
    vScale = 1.0;

    getVS(): Float32Array { return this.mvs; }
    getUVS(): Float32Array { return this.muvs; }
    getNVS(): Float32Array { return this.mnvs; }
    getIVS(): Uint16Array | Uint32Array { return this.mivs; }

    initialize(radius: number, height: number, segments: number, rings: number, uvType = 1, alignYRatio = -0.5) {
        if (this.vtxTotal < 1) {
            if (radius < 0.01) return;

            if (rings < 2) rings = 2;
            segments = 3;

            let mRadius = Math.abs(radius);
            let m_height = Math.abs(height);

            let plongitudeNumSegments = rings;
            let platitudeNumSegments = segments;

            let i = 1
            let j = 0;
            let trisTot = 0;
            let yRad = 0;
            let px = 0;
            let py = 0;
            let minY = alignYRatio * m_height;
            this.bounds = new AABB();
            this.bounds.min.setXYZ(-radius, minY, -radius);
            this.bounds.max.setXYZ(radius, minY + m_height, radius);
            this.bounds.updateFast();

            let vtx = new GeometryVertex();
            vtx.y = minY;

            // two independent circles and a cylinder wall
            let vtxVec: GeometryVertex[] = [];
            let vtxRows: GeometryVertex[][] = [];
            vtxRows.push([]);
            let vtxRow: GeometryVertex[] = vtxRows[0];
            vtx.u = 0.5; vtx.v = 0.5;
            vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
            vtxRow.push(vtx.cloneVertex());
            vtxVec.push(vtxRow[0]);

            for (; i < platitudeNumSegments; ++i) {

                vtx.y = minY + m_height * (i - 1);
                vtxRows.push([]);
                let row = vtxRows[i];
                for (j = 0; j < plongitudeNumSegments; ++j) {
                    yRad = (Math.PI * 2 * j) / plongitudeNumSegments;
                    ++trisTot;

                    px = Math.sin(yRad);
                    py = Math.cos(yRad);

                    vtx.x = px * mRadius;
                    vtx.z = py * mRadius;
                    vtx.index = trisTot;

                    // calc uv
                    px *= 0.495;
                    py *= 0.495;
                    vtx.u = 0.5 + px;
                    vtx.v = 0.5 + py;

                    if (i < 2) {
                        vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
                    }
                    else {
                        vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
                    }

                    row.push(vtx.cloneVertex());
                    vtxVec.push(row[j]);
                }
                row.push(row[0]);
            }
            ++trisTot;
            vtx.index = trisTot;
            vtx.x = 0; vtx.y = minY + m_height; vtx.z = 0.0;
            vtx.u = 0.5; vtx.v = 0.5;
            vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
            vtxRows.push([]);
            let lastRow: GeometryVertex[] = vtxRows[3];
            lastRow.push(vtx.cloneVertex());
            vtxVec.push(lastRow[0]);
            // two circles's vertexes calc end;
            // calc cylinder wall vertexes
            let f = 1.0 / mRadius;
            for (i = 0; i < 2; ++i) {
                let preRow = vtxRows[i + 1];
                vtxRows.push([]);
                let row = vtxRows[vtxRows.length - 1];
                for (j = 0; j <= plongitudeNumSegments; ++j) {
                    ++trisTot;
                    vtx.copyFrom(preRow[j]);
                    vtx.index = trisTot;
                    if (uvType < 1) {
                        if (i < 1) {
                            vtx.v = 0.0;
                        }
                        else {
                            vtx.v = this.vScale;
                        }
                        vtx.u = this.uScale * (j / plongitudeNumSegments);
                    }
                    else {
                        if (i < 1) {
                            vtx.u = 0.0;
                        }
                        else {
                            vtx.u = this.uScale;
                        }
                        vtx.v = this.vScale * (j / plongitudeNumSegments);
                    }
                    vtx.ny = 0.0;
                    vtx.nx = vtx.x * f;
                    vtx.nz = vtx.z * f;
                    row.push(vtx.cloneVertex());
                    vtxVec.push(row[j]);
                }
            }
            let pvtx: GeometryVertex = null;
            let pivs: number[] = [];
            i = 1;
            let rowa: GeometryVertex[] = null;
            let rowb: GeometryVertex[] = null;
            for (; i <= platitudeNumSegments; ++i) {
                rowa = vtxRows[i - 1];
                rowb = vtxRows[i];
                for (j = 1; j <= plongitudeNumSegments; ++j) {
                    if (i == 1) {
                        pivs.push(rowa[0].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                    else if (i == platitudeNumSegments) {
                        pivs.push(rowa[j].index); pivs.push(rowb[0].index); pivs.push(rowa[j - 1].index);
                    }
                }
            }
            // create cylinder wall triangles
            rowa = vtxRows[vtxRows.length - 2];
            rowb = vtxRows[vtxRows.length - 1];
            for (j = 1; j <= plongitudeNumSegments; ++j) {
                pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
            }

            this.vtxTotal = vtxVec.length;
            this.mvs = new Float32Array(this.vtxTotal * 3);
            i = 0;
            for (j = 0; j < this.vtxTotal; ++j) {
                pvtx = vtxVec[j];
                this.mvs[i] = pvtx.x; this.mvs[i + 1] = pvtx.y; this.mvs[i + 2] = pvtx.z;
                i += 3;
            }
            if (this.mTransMatrix != null) {
                this.mTransMatrix.transformVectorsSelf(this.mvs, this.mvs.length);
                this.bounds.addFloat32Arr(this.mvs);
                this.bounds.updateFast();
            }

            this.mivs = new Uint16Array(pivs);

            this.vtCount = this.mivs.length;
            this.trisNumber = this.vtCount / 3;

            if (true) {
                this.muvs = new Float32Array(this.vtxTotal * 2);
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    pvtx = vtxVec[j];
                    this.muvs[i] = pvtx.u; this.muvs[i + 1] = pvtx.v;
                    i += 2;
                }
            }
            if (true) {
                this.mnvs = new Float32Array(this.vtxTotal * 3);
                if (this.mTransMatrix != null) {
                    SurfaceNormalCalc.ClacTrisNormal(this.mvs, this.mvs.length, this.trisNumber, this.mivs, this.mnvs);
                }
                else {
                    i = 0;
                    for (j = 0; j < this.vtxTotal; ++j) {
                        pvtx = vtxVec[j];
                        this.mnvs[i] = pvtx.nx; this.mnvs[i + 1] = pvtx.ny; this.mnvs[i + 2] = pvtx.nz;
                        i += 3;
                    }
                }
            }

            this.vtCount = this.mivs.length;
            this.trisNumber = this.vtCount / 3;
        }
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

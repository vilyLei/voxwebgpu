/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3 from "../../math/Vector3";
import RadialLine from "../../cgeom/RadialLine";
import AABB from "../../cgeom/AABB";
import GeometryVertex from "./GeometryVertex";
import GeometryBase from "./GeometryBase";

export default class SphereGeometry extends GeometryBase {
    constructor() {
        super();
    }
    private m_longitudeNumSegments = 10;
    private m_latitudeNumSegments = 10;
    private m_radius: number = 50;
    private m_vs: Float32Array = null;
    private m_uvs: Float32Array = null;
    private m_nvs: Float32Array = null;

    inverseUV = false;
    uvScale = 1.0;

	/**
	 *  1: positive half sphere
	 *  0: entire sphere
	 * -1:negative half sphere
	 */
    mode = 0;
    getVS(): Float32Array { return this.m_vs; }
    getUVS(): Float32Array { return this.m_uvs; }
    getNVS(): Float32Array { return this.m_nvs; }
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    initialize(radius: number, longitudeNumSegments: number, latitudeNumSegments: number, doubleTriFaceEnabled: boolean): void {
        if (this.vtxTotal < 1) {
            if (radius < 0.0001) radius = 0.0001;

            this.bounds = new AABB();
            if (longitudeNumSegments < 2) longitudeNumSegments = 2;
            if (latitudeNumSegments < 2) latitudeNumSegments = 2;
            this.m_radius = Math.abs(radius);
            this.m_longitudeNumSegments = longitudeNumSegments;
            this.m_latitudeNumSegments = latitudeNumSegments;

            if ((this.m_latitudeNumSegments + 1) % 2 == 0) {
                this.m_latitudeNumSegments += 1;
            }
            if (this.m_longitudeNumSegments = this.m_latitudeNumSegments) {
                this.m_longitudeNumSegments += 1;
            }

            let i = 1, j = 0, trisTot = 0;
            let xRad = 0.0, yRad = 0.0, px = 0.0, py = 0.0;
            let vtx = new GeometryVertex(0, -this.m_radius, 0, trisTot);

            // 计算绕 y轴 的纬度线上的点
            let vtxVec = [];
            let vtxRows: GeometryVertex[][] = [];
            vtxRows.push([]);
            let vtxRow = vtxRows[0];
            let centerUV = this.inverseUV ? 1.0 : 0.5;

            vtx.u = vtx.v = centerUV;
            vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;

            let v0 = vtx.cloneVertex();
            for (j = 0; j <= this.m_longitudeNumSegments; ++j) {
                vtxRow.push(v0);
            }
            vtxVec.push(v0);

            // console.log("vtxRow first: ", vtxRow);
            let pr = 0.0
            let py2 = 0.0;
            let f = 1.0 / this.m_radius;

            for (i = 1; i < this.m_latitudeNumSegments; ++i) {
                yRad = Math.PI * i / this.m_latitudeNumSegments;
                px = Math.sin(yRad);
                py = Math.cos(yRad);

                vtx.y = -this.m_radius * py;
                pr = this.m_radius * px;

                // py2 = vtx.y;
                // if (py2 < 0) py2 = -py2;
                // uv inverse yes or no
                //if (!this.inverseUV) py2 = this.m_radius - py2;
                //py2 /= pr2;

                if (this.inverseUV) {
                    py2 = Math.abs(yRad / Math.PI - 0.5);
                }
                else {
                    py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                }
                py2 *= this.uvScale;
                vtxRows.push([]);
                let row = vtxRows[i];
                for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                    xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                    ++trisTot;
                    px = Math.sin(xRad);
                    py = Math.cos(xRad);
                    vtx.x = px * pr;
                    vtx.z = py * pr;
                    vtx.index = trisTot;
                    // calc uv
                    vtx.u = 0.5 + px * py2;
                    vtx.v = 0.5 + py * py2;
                    vtx.nx = vtx.x * f; vtx.ny = vtx.y * f; vtx.nz = vtx.z * f;

                    row.push(vtx.cloneVertex());
                    vtxVec.push(row[j]);
                }
                row.push(row[0]);
            }
            ++trisTot;
            vtx.index = trisTot;
            vtx.x = 0; vtx.y = this.m_radius; vtx.z = 0;
            vtx.u = vtx.v = centerUV;
            vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
            vtxRows.push([]);
            let lastRow = vtxRows[this.m_latitudeNumSegments];
            let v1 = vtx.cloneVertex();
            for (j = 0; j <= this.m_longitudeNumSegments; ++j) {
                lastRow.push(v1);
            }
            vtxVec.push(v1);
            // console.log("vtxRows: ", vtxRows);
            let pvtx: GeometryVertex = null;
            ///////////////////////////   ///////////////////////////    ////////////////
            let pivs: number[] = [];

            let rowa = null;
            let rowb = null;
            let layerN = this.m_latitudeNumSegments;
            if (this.mode == 1) {
                let halfN = layerN / 2 + 1;
                for (i = halfN; i <= layerN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                this.bounds.min.setXYZ(-radius, 0, -radius);
                this.bounds.max.setXYZ(radius, radius, radius);

            } else if (this.mode == -1) {
                let halfN = layerN / 2 + 1;
                for (i = 1; i < halfN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                this.bounds.min.setXYZ(-radius, -radius, -radius);
                this.bounds.max.setXYZ(radius, 0, radius);

            } else if (this.mode == 2) {

                let halfN = layerN / 2 + 1;
                let mi = halfN - 1;
                let miRow = vtxRows[mi].slice();
                let n = miRow.length - 1;
                for (i = 0; i < n; ++i) {
                    vtx = miRow[i].cloneVertex();
                    ++trisTot;
                    vtx.index = trisTot;
                    miRow[i] = vtx;
                    vtxVec.push(vtx);
                }
                miRow[miRow.length - 1] = miRow[0];

                let list0: GeometryVertex[][] = [];
                for (i = 0; i < halfN; ++i) {
                    list0.push(vtxRows[i]);
                }
                list0[list0.length - 1] = miRow;

                let list1 = vtxRows;
                let list1_copy: GeometryVertex[][] = [];
                for (i = halfN - 1; i <= layerN; ++i) {
                    list1_copy.push(vtxRows[i]);
                }
                console.log("calc UV_U XXXXX");
                ///*
                for (i = 1; i < halfN; ++i) {
                    yRad = Math.PI * i / this.m_latitudeNumSegments;
                    px = Math.sin(yRad);
                    py = Math.cos(yRad);
                    if (this.inverseUV) {
                        py2 = Math.abs(yRad / Math.PI - 0.5);
                    }
                    else {
                        py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                    }
                    py2 *= this.uvScale;

                    const ls = list0[i];
                    for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                        vtx = ls[j];
                        xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                        // calc uv
                        vtx.u = 0.25 + Math.sin(xRad) * py2 * 0.5;
                        vtx.v = 0.5 + Math.cos(xRad) * py2;
                    }
                }
                vtx = list0[0][0];
                vtx.u = 0.25;
                vtx.v = 0.5;
                //*/
                for (i = halfN - 1; i < layerN; ++i) {
                    yRad = Math.PI * i / this.m_latitudeNumSegments;
                    px = Math.sin(yRad);
                    py = Math.cos(yRad);
                    if (this.inverseUV) {
                        py2 = Math.abs(yRad / Math.PI - 0.5);
                    }
                    else {
                        py2 = 0.5 - Math.abs(yRad / Math.PI - 0.5);
                    }
                    py2 *= this.uvScale;

                    const ls = list1[i];
                    // const n = ls.length;
                    for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                        vtx = ls[j];
                        xRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                        // calc uv
                        vtx.u = 0.75 + Math.sin(xRad) * py2 * 0.5;
                        vtx.v = 0.5 + Math.cos(xRad) * py2;
                    }
                }
                vtx = list1[list1.length - 1][0];
                vtx.u = 0.75;
                vtx.v = 0.5;

                for (i = 1; i < halfN; ++i) {
                    rowa = list0[i - 1];
                    rowb = list0[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                for (i = halfN; i <= layerN; ++i) {
                    rowa = list1[i - 1];
                    rowb = list1[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                this.bounds.min.setXYZ(-radius, -radius, -radius);
                this.bounds.max.setXYZ(radius, radius, radius);
            } else {
                for (i = 1; i <= layerN; ++i) {
                    rowa = vtxRows[i - 1];
                    rowb = vtxRows[i];
                    for (j = 1; j <= this.m_longitudeNumSegments; ++j) {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
                this.bounds.min.setXYZ(-radius, -radius, -radius);
                this.bounds.max.setXYZ(radius, radius, radius);
            }

            this.bounds.updateFast();
            this.vtxTotal = vtxVec.length;
            if (doubleTriFaceEnabled) {
                this.m_ivs = this.createIVSBYSize(pivs.length * 2);
                this.m_ivs.set(pivs, 0);
                pivs.reverse();
                this.m_ivs.set(pivs, pivs.length);
            }
            else {
                this.m_ivs = this.createIVSByArray(pivs);
            }
            this.m_vs = new Float32Array(this.vtxTotal * 3);
            i = 0;
            for (j = 0; j < this.vtxTotal; ++j) {
                pvtx = vtxVec[j];
                this.m_vs[i++] = pvtx.x; this.m_vs[i++] = pvtx.y; this.m_vs[i++] = pvtx.z;
            }
            
            if (true) {
                // uv
                this.m_uvs = new Float32Array(this.vtxTotal * 2);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    pvtx = vtxVec[j];
                    //trace(tri.index0, ",", tri.index1, ",", tri.index2);
                    this.m_uvs[i] = pvtx.u; this.m_uvs[i + 1] = pvtx.v;
                    i += 2;
                }
            }
            if (true) {
                this.m_nvs = new Float32Array(this.vtxTotal * 3);

                i = 0;
                for (j = 0; j < this.vtxTotal; ++j) {
                    pvtx = vtxVec[j];
                    this.m_nvs[i] = pvtx.nx; this.m_nvs[i + 1] = pvtx.ny; this.m_nvs[i + 2] = pvtx.nz;
                    i += 3;
                }
            }
            
            this.vtCount = this.m_ivs.length;
            this.trisNumber = this.vtCount / 3;
        }
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
    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3, rltv: Vector3, outV: Vector3, boundsHit: boolean): number {
        return RadialLine.IntersectioNearSphere2(rlpv, rltv, Vector3.ZERO, this.m_radius, outV);
    }
}

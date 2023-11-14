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
import Vector3 from "../../math/Vector3";

export default class ConeGeometry extends GeometryBase {
	constructor() {
		super();
	}

	private mvs: Float32Array = null;
	private muvs: Float32Array = null;
	private mnvs: Float32Array = null;
	private m_cvs: Float32Array = null;

	inverseUV = false;
	uScale = 1.0;
	vScale = 1.0;
	// normalType = VtxNormalType.FLAT;
	// normalType = VtxNormalType.GOURAND;
	normalType = 1;

	getVS(): Float32Array {
		return this.mvs;
	}
	getUVS(): Float32Array {
		return this.muvs;
	}
	getNVS(): Float32Array {
		return this.mnvs;
	}
	getCVS(): Float32Array {
		return this.m_cvs;
	}
	getIVS(): Uint16Array | Uint32Array {
		return this.mivs;
	}

	initialize(
		radius: number,
		height: number,
		longitudeNumSegments: number,
		latitudeNumSegments: number,
		uvType: number = 1,
		alignYRatio: number = -0.5
	) {
		if (this.vtxTotal < 1) {
			if (radius < 0.01) radius = 0.01;
			if (longitudeNumSegments < 2) longitudeNumSegments = 2;
			let latitudeNumSegments: number = 2;

			let i = 1;
			let j = 0;
			let trisTot = 0;
			let yRad = 0.0;
			let px = 0.0;
			let py = 0.0;
			radius = Math.abs(radius);
			height = Math.abs(height);
			let minY = alignYRatio * height;
			let vtx = new GeometryVertex(0.0, minY, 0.0, trisTot);

			this.bounds = new AABB();
			this.bounds.min.setXYZ(-radius, minY, -radius);
			this.bounds.max.setXYZ(radius, minY + height, radius);
			this.bounds.updateFast();

			// 计算绕 y轴 的纬度线上的点
			let vtxVec: GeometryVertex[] = [];
			let vtxRows: GeometryVertex[][] = [];
			vtxRows.push([]);
			let vtxRow: GeometryVertex[] = vtxRows[0];
            vtx.f = 0;
			vtx.u = 0.5;
			vtx.v = 0.5;
			vtx.nx = 0.0;
			vtx.ny = -1.0;
			vtx.nz = 0.0;

			for (j = 0; j < 1; ++j) {
				vtx.index = trisTot;
				++trisTot;
				vtxRow.push(vtx.cloneVertex());
				vtxVec.push(vtxRow[j]);
			}
			py = minY;
			let py2 = 0.499;
			for (; i < latitudeNumSegments; ++i) {
				yRad = (Math.PI * i) / latitudeNumSegments;
				vtx.y = py;

				vtxRows.push([]);
				let rowa: GeometryVertex[] = vtxRows[i];
				for (j = 0; j < longitudeNumSegments; ++j) {
					yRad = (Math.PI * 2.0 * j) / longitudeNumSegments;

					px = Math.sin(yRad);
					py = Math.cos(yRad);
					vtx.x = px * radius;
					vtx.z = py * radius;
					vtx.index = trisTot;
					++trisTot;

					// calc uv
					px *= py2;
					py *= py2;
					vtx.u = 0.5 + px;
					vtx.v = 0.5 + py;
					vtx.nx = vtx.x;
					vtx.ny = 0.0;
					vtx.nz = vtx.z;
					vtx.f = 0;

					rowa.push(vtx.cloneVertex());
					vtxVec.push(rowa[j]);
				}

				rowa.push(rowa[0]);
			}
			vtxRows.push([]);
			let rowa: GeometryVertex[] = vtxRows[vtxRows.length - 1];
			let rowb: GeometryVertex[] = vtxRows[vtxRows.length - 2];
			for (j = 0; j < longitudeNumSegments; ++j) {

				let pv = rowb[j].cloneVertex();
                pv.f = 1;

				rowa.push(pv);

				rowa[j].index = trisTot;
				++trisTot;
				vtxVec.push(rowa[j]);

                pv = rowb[j];
				pv.nx = 0.0;
				pv.ny = -1.0;
				pv.nz = 0.0;
			}
			rowa.push(rowa[0]);

            vtx.f = 0;
			vtx.x = 0.0;
			vtx.y = minY + height;
			vtx.z = 0.0;
			vtx.u = 0.5;
			vtx.v = 0.5;
            vtx.nx = 0.0;
            vtx.ny = 1.0;
            vtx.nz = 0.0;
			vtxRows.push([]);
			let lastRow: GeometryVertex[] = vtxRows[vtxRows.length - 1];
			for (j = 0; j < longitudeNumSegments; ++j) {
				vtx.index = trisTot;
				++trisTot;
				lastRow.push(vtx.cloneVertex());
				vtxVec.push(lastRow[j]);
			}
			lastRow.push(lastRow[0]);
			let pvtx: GeometryVertex = null;
			///////////////////////////   ///////////////////////////    ////////////////
			let pivs: number[] = [];

			i = 1;
			latitudeNumSegments += 1;
			for (; i <= latitudeNumSegments; ++i) {
				let rowa: GeometryVertex[] = vtxRows[i - 1];
				let rowb: GeometryVertex[] = vtxRows[i];
				for (j = 1; j <= longitudeNumSegments; ++j) {
					if (i == 1) {
						pivs.push(rowa[0].index);
						pivs.push(rowb[j].index);
						pivs.push(rowb[j - 1].index);
					} else if (i == latitudeNumSegments) {
						pivs.push(rowa[j].index);
						pivs.push(rowb[j].index);
						pivs.push(rowa[j - 1].index);
					}
				}
			}

			this.vtxTotal = vtxVec.length;

			this.mvs = new Float32Array(this.vtxTotal * 3);
			i = 0;
			for (j = 0; j < this.vtxTotal; ++j) {
				pvtx = vtxVec[j];
				this.mvs[i] = pvtx.x;
				this.mvs[i + 1] = pvtx.y;
				this.mvs[i + 2] = pvtx.z;
				//trace(pvtx.x+","+pvtx.y+","+pvtx.z);
				i += 3;
			}

			if (this.mTransMatrix != null) {
				this.mTransMatrix.transformVectorsSelf(this.mvs, this.mvs.length);
				this.bounds.addFloat32Arr(this.mvs);
				this.bounds.updateFast();
			}

			this.mivs = new Uint16Array(pivs);
			if (true) {
				this.muvs = new Float32Array(this.vtxTotal * 2);

				i = 0;
				for (j = 0; j < this.vtxTotal; ++j) {
					pvtx = vtxVec[j];
					this.muvs[i] = pvtx.u;
					this.muvs[i + 1] = pvtx.v;
					i += 2;
				}
			}
			if (true) {
				this.mnvs = new Float32Array(this.vtxTotal * 3);
				// i = 0;
				// for (j = 0; j < this.vtxTotal; ++j) {
				//     pvtx = vtxVec[j];
				//     this.mnvs[i] = pvtx.nx; this.mnvs[i + 1] = pvtx.ny; this.mnvs[i + 2] = pvtx.nz;
				//     i += 3;
				// }
				// let nvs = new Float32Array(vtxTotal * 3);
				let trisNumber = this.mivs.length / 3;
				if (this.normalType == 0) {
					SurfaceNormalCalc.ClacTrisNormal(this.mvs, this.mvs.length, trisNumber, this.mivs, this.mnvs);
				} else {
					SurfaceNormalCalc.ClacTrisNormal(this.mvs, this.mvs.length, trisNumber, this.mivs, this.mnvs);
					i = 0;
					let nv = new Vector3();
					for (j = 0; j < this.vtxTotal; ++j) {
						pvtx = vtxVec[j];
						if (pvtx.f > 0) {
							nv.x = pvtx.nx + this.mnvs[i];
							nv.y = pvtx.ny + this.mnvs[i + 1];
							nv.z = pvtx.nz + this.mnvs[i + 2];
                            nv.normalize();
							this.mnvs[i] = nv.x;
							this.mnvs[i + 1] = nv.y;
							this.mnvs[i + 2] = nv.z;
						} else {
							this.mnvs[i] = pvtx.nx;
							this.mnvs[i + 1] = pvtx.ny;
							this.mnvs[i + 2] = pvtx.nz;
						}
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
			this.m_cvs = null;
			super.__$destroy();
		}
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../math/MathConst";
import Vector3 from "../../math/Vector3";
import Matrix4 from "../../math/Matrix4";

import AABB from "../../cgeom/AABB";
import MeshBase from "./GeometryBase";
import { AABBCalc } from "../../cgeom/AABBCalc";
import { WGRNormalType } from "../../render/Define";

export default class BoxGeometry extends MeshBase {
	private mList: number[][] = new Array(8);

	constructor() {
		super();
	}

	private mvs: Float32Array = null;
	private muvs: Float32Array = null;
	private mnvs: Float32Array = null;

	normalType = WGRNormalType.FLAT;
	flipVerticalUV = false;
	uvPartsNumber = 0;
	getVS() {
		return this.mvs;
	}
	getUVS() {
		return this.muvs;
	}
	getNVS() {
		return this.mnvs;
	}

	setPositionAt(i: number, position: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				let arr: number[] = this.mList[i];
				arr[0] = position.x;
				arr[1] = position.y;
				arr[2] = position.z;
			}
		}
	}
	getPositionAt(i: number, position: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				let arr: number[] = this.mList[i];
				position.x = arr[0];
				position.y = arr[1];
				position.z = arr[2];
			}
		}
	}
	setEdgeAt(i: number, lsPA: Vector3, lsPB: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				let arr0: number[] = this.mList[i];
				i++;
				if (i == 3) i = 0;
				else if (i == 7) i = 4;

				let arr1: number[] = this.mList[i];
				arr0[0] = lsPA.x;
				arr0[1] = lsPA.y;
				arr0[2] = lsPA.z;
				arr1[0] = lsPB.x;
				arr1[1] = lsPB.y;
				arr1[2] = lsPB.z;
			}
		}
	}
	getEdgeAt(i: number, lsPA: Vector3, lsPB: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				let arr0: number[] = this.mList[i];
				i++;
				if (i == 3) i = 0;
				else if (i == 7) i = 4;

				let arr1: number[] = this.mList[i];
				lsPA.x = arr0[0];
				lsPA.y = arr0[1];
				lsPA.z = arr0[2];
				lsPB.x = arr1[0];
				lsPB.y = arr1[1];
				lsPB.z = arr1[2];
			}
		}
	}
	// face order: -y,+y,+x,-z,-x,+z
	private static sFacePosIds: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 4, 5, 1, 0, 5, 6, 2, 1, 7, 6, 2, 3, 4, 7, 3, 0];
	setFaceAt(i: number, lsPA: Vector3, lsPB: Vector3, lsPC: Vector3, lsPD: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				i *= 4;
				let posList: Vector3[] = [lsPA, lsPB, lsPC, lsPD];
				let idList: number[] = BoxGeometry.sFacePosIds;
				let list: number[][] = this.mList;
				let arr: number[];
				let pos: Vector3;
				for (let iMax: number = i + 4, j: number = 0; i < iMax; ++i) {
					arr = list[idList[i]];
					pos = posList[j++];
					arr[0] = pos.x;
					arr[1] = pos.y;
					arr[2] = pos.z;
				}
			}
		}
	}
	getFaceAt(i: number, lsPA: Vector3, lsPB: Vector3, lsPC: Vector3, lsPD: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				i *= 4;
				let posList: Vector3[] = [lsPA, lsPB, lsPC, lsPD];
				let idList: number[] = BoxGeometry.sFacePosIds;
				let list: number[][] = this.mList;
				let arr: number[];
				let pos: Vector3;
				for (let iMax: number = i + 4, j: number = 0; i < iMax; ++i) {
					arr = list[idList[i]];
					pos = posList[j++];
					pos.x = arr[0];
					pos.y = arr[1];
					pos.z = arr[2];
				}
			}
		}
	}

	getFaceCenterAt(i: number, outV: Vector3): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				i *= 4;
				let idList: number[] = BoxGeometry.sFacePosIds;
				let list: number[][] = this.mList;
				let arr: number[];
				outV.setXYZ(0.0, 0.0, 0.0);
				for (let iMax: number = i + 4; i < iMax; ++i) {
					arr = list[idList[i]];
					outV.x += arr[0];
					outV.y += arr[1];
					outV.z += arr[2];
				}
				outV.scaleBy(0.33333);
			}
		}
	}
	transformFaceAt(i: number, mat4: Matrix4): void {
		if (i >= 0 && i < 8) {
			if (this.mvs != null) {
				i *= 4;
				let idList: number[] = BoxGeometry.sFacePosIds;
				let list: number[][] = this.mList;
				for (let iMax: number = i + 4; i < iMax; ++i) {
					mat4.transformVectorsSelf(list[idList[i]], 3);
				}
			}
		}
	}
	initializeWithYFace(bottomFaceMinV: Vector3, bottomFaceMaxV: Vector3, topFaceMinV: Vector3, topFaceMaxV: Vector3): void {
		let minV: Vector3 = bottomFaceMinV;
		let maxV: Vector3 = bottomFaceMaxV;
		let minY: number = (minV.y + maxV.y) * 0.5;
		this.mList[0] = [maxV.x, minY, maxV.z];
		this.mList[1] = [maxV.x, minY, minV.z];
		this.mList[2] = [minV.x, minY, minV.z];
		this.mList[3] = [minV.x, minY, maxV.z];

		minV = topFaceMinV;
		maxV = topFaceMaxV;
		let maxY: number = (minV.y + maxV.y) * 0.5;
		this.mList[4] = [maxV.x, maxY, maxV.z];
		this.mList[5] = [maxV.x, maxY, minV.z];
		this.mList[6] = [minV.x, maxY, minV.z];
		this.mList[7] = [minV.x, maxY, maxV.z];

		this.initData();
	}
	private minV = new Vector3();
	private maxV = new Vector3();
	initialize(minV: Vector3DataType, maxV: Vector3DataType): void {

		const min = this.minV;
		const max = this.maxV;
		min.setXYZ(0,0,0).setVector3(minV);
		max.setXYZ(0,0,0).setVector3(maxV);
		// this.mList[0] = [maxV.x, minV.y, maxV.z];
		// this.mList[1] = [maxV.x, minV.y, minV.z];
		// this.mList[2] = [minV.x, minV.y, minV.z];
		// this.mList[3] = [minV.x, minV.y, maxV.z];

		// this.mList[4] = [maxV.x, maxV.y, maxV.z];
		// this.mList[5] = [maxV.x, maxV.y, minV.z];
		// this.mList[6] = [minV.x, maxV.y, minV.z];
		// this.mList[7] = [minV.x, maxV.y, maxV.z];

		this.mList[0] = [max.x, min.y, max.z];
		this.mList[1] = [max.x, min.y, min.z];
		this.mList[2] = [min.x, min.y, min.z];
		this.mList[3] = [min.x, min.y, max.z];

		this.mList[4] = [max.x, max.y, max.z];
		this.mList[5] = [max.x, max.y, min.z];
		this.mList[6] = [min.x, max.y, min.z];
		this.mList[7] = [min.x, max.y, max.z];

		this.initData();
	}

	scaleUVFaceAt(faceI: number, u: number, v: number, du: number, dv: number) {
		if (this.muvs != null && faceI >= 0 && faceI < 6) {
			let i: number = faceI * 8;
			let t: number = i + 8;
			let uvs: Float32Array = this.muvs;
			for (; i < t; i += 2) {
				uvs[i] = u + uvs[i] * du;
				uvs[i + 1] = v + uvs[i + 1] * dv;
			}
		}
	}
	reinitialize(): void {
		this.initData();
	}
	private initData(): void {
		this.vtxTotal = 24;
		let i = 0;
		let k = 0;
		let baseI = 0;

		let newBuild = this.mivs == null;
		if (newBuild) {
			this.mvs = new Float32Array(72);
			this.mivs = new Uint16Array(36);
			let flags = [3, 2, 3, 3, 2, 2];
			for (i = 0; i < 6; ++i) {
				if (flags[i] == 3) {
					this.mivs[baseI] = k + 3;
					this.mivs[baseI + 1] = k + 2;
					this.mivs[baseI + 2] = k + 1;
					this.mivs[baseI + 3] = k + 3;
					this.mivs[baseI + 4] = k + 1;
					this.mivs[baseI + 5] = k;
				} else {
					this.mivs[baseI] = k + 2;
					this.mivs[baseI + 1] = k + 3;
					this.mivs[baseI + 2] = k;
					this.mivs[baseI + 3] = k + 2;
					this.mivs[baseI + 4] = k;
					this.mivs[baseI + 5] = k + 1;
				}
				baseI += 6;
				k += 4;
			}
		}
		let idList: number[] = BoxGeometry.sFacePosIds;
		let list: number[][] = this.mList;
		let arr: number[];
		let pvs: Float32Array = this.mvs;
		k = 0;
		for (i = 0; i < this.vtxTotal; ++i) {
			arr = list[idList[i]];
			pvs.set(arr, k);
			k += 3;
		}
		if (!this.bounds) {
			this.bounds = new AABB();
		} else {
			this.bounds.reset();
		}
		if (this.mTransMatrix != null) {
			this.mTransMatrix.transformVectorsSelf(this.mvs, this.mvs.length);
			this.bounds.addFloat32Arr(this.mvs);
		} else {
			this.bounds.addFloat32Arr(this.mvs);
		}
		this.bounds.updateFast();

		let faceTotal: number = 6;

		if (true) {
			if (this.muvs == null) {
				// uv
				this.muvs = new Float32Array(48);
				this.initUVData(this.vtxTotal * 2);
				if (this.uvPartsNumber == 4) {
					this.scaleUVFaceAt(0, 0.5, 0.5, 0.5, 0.5);
					this.scaleUVFaceAt(1, 0.0, 0.0, 0.5, 0.5);
					this.scaleUVFaceAt(2, 0.5, 0.0, 0.5, 0.5);
					this.scaleUVFaceAt(3, 0.0, 0.5, 0.5, 0.5);
					this.scaleUVFaceAt(4, 0.5, 0.0, 0.5, 0.5);
					this.scaleUVFaceAt(5, 0.0, 0.5, 0.5, 0.5);
				} else if (this.uvPartsNumber == 6) {
					this.scaleUVFaceAt(0, 0.0, 0.0, 0.25, 0.5);
					this.scaleUVFaceAt(1, 0.25, 0.0, 0.25, 0.5);
					this.scaleUVFaceAt(2, 0.5, 0.0, 0.25, 0.5);
					this.scaleUVFaceAt(3, 0.75, 0.0, 0.25, 0.5);
					this.scaleUVFaceAt(4, 0.0, 0.5, 0.25, 0.5);
					this.scaleUVFaceAt(5, 0.25, 0.5, 0.25, 0.5);
				}
			}
		}

		if (true) {
			this.mnvs = new Float32Array(72);
			baseI = 0;
			let nx = 0.0;
			let ny = 0.0;
			let nz = 0.0;
			if (this.normalType == WGRNormalType.FLAT) {
				while (baseI < faceTotal) {
					nx = 0.0;
					ny = 0.0;
					nz = 0.0;
					switch (baseI) {
						case 0:
							ny = -1.0;
							break;
						case 1:
							ny = 1.0;
							break;
						case 2:
							nx = 1.0;
							break;
						case 3:
							nz = -1.0;
							break;
						case 4:
							nx = -1.0;
							break;
						case 5:
							nz = 1.0;
							break;
						default:
							break;
					}

					i = baseI * 12;
					nx *= this.normalScale;
					ny *= this.normalScale;
					nz *= this.normalScale;
					this.mnvs[i] = nx;
					this.mnvs[i + 1] = ny;
					this.mnvs[i + 2] = nz;
					this.mnvs[i + 3] = nx;
					this.mnvs[i + 4] = ny;
					this.mnvs[i + 5] = nz;
					this.mnvs[i + 6] = nx;
					this.mnvs[i + 7] = ny;
					this.mnvs[i + 8] = nz;
					this.mnvs[i + 9] = nx;
					this.mnvs[i + 10] = ny;
					this.mnvs[i + 11] = nz;

					++baseI;
				}
			} else {
				let centV = this.bounds.center;
				let d = 0.0;
				while (baseI < this.vtxTotal) {
					i = baseI * 3;
					nx = this.mvs[i] - centV.x;
					ny = this.mvs[i + 1] - centV.y;
					nz = this.mvs[i + 2] - centV.z;
					d = Math.sqrt(nx * nx + ny * ny + nz * nz);

					if (d > MathConst.MATH_MIN_POSITIVE) {
						this.mnvs[i] = nx / d;
						this.mnvs[i + 1] = ny / d;
						this.mnvs[i + 2] = nz / d;
					}
					++baseI;
				}
			}
		}
		this.vtCount = this.mivs.length;
		this.trisNumber = 12;
	}
	setFaceUVSAt(i: number, uvsLen8: Float32Array, offset: number = 0): void {
		if (this.muvs != null) {
			if (offset < 1) {
				this.muvs.set(uvsLen8, i * 8);
			} else {
				i *= 8;
				if (offset < 0) offset = 0;
				for (let k: number = 0; k < 4; ++k) {
					this.muvs[i++] = uvsLen8[offset * 2];
					this.muvs[i++] = uvsLen8[offset * 2 + 1];
					offset++;
					offset = offset % 4;
				}
			}
		}
	}
	uScale: number = 1.0;
	vScale: number = 1.0;
	private initUVData(baseI: number): void {
		let uScale = this.uScale;
		let vScale = this.vScale;
		let i: number = 0;
		if (this.flipVerticalUV) {
			while (i < baseI) {
				this.muvs[i] = 1.0 * uScale;
				this.muvs[i + 1] = 1.0 * vScale;
				this.muvs[i + 2] = 0.0 * uScale;
				this.muvs[i + 3] = 1.0 * vScale;
				this.muvs[i + 4] = 0.0 * uScale;
				this.muvs[i + 5] = 0.0 * vScale;
				this.muvs[i + 6] = 1.0 * uScale;
				this.muvs[i + 7] = 0.0 * vScale;
				i += 8;
			}
		} else {
			while (i < baseI) {
				this.muvs[i] = 0.0 * uScale;
				this.muvs[i + 1] = 0.0 * vScale;
				this.muvs[i + 2] = 1.0 * uScale;
				this.muvs[i + 3] = 0.0 * vScale;
				this.muvs[i + 4] = 1.0 * uScale;
				this.muvs[i + 5] = 1.0 * vScale;
				this.muvs[i + 6] = 0.0 * uScale;
				this.muvs[i + 7] = 1.0 * vScale;
				i += 8;
			}
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
		let boo: boolean = AABBCalc.IntersectionRL2(rltv, rlpv, this.bounds, outV);
		return boo ? 1 : -1;
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

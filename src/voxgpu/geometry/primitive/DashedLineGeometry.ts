/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3 from "../../math/Vector3";
import RadialLine from "../../cgeom/RadialLine";
import AABB from "../../cgeom/AABB";
import GeometryBase from "./GeometryBase";
import { WGRDrawMode } from "../../render/Define";
import Color4 from "../../material/Color4";

const __$v3 = new Vector3();
const __$c4 = new Color4();
export default class DashedLineGeometry extends GeometryBase {
	constructor() {
		super();
		this.mPolyhedral = false;
		this.drawMode = WGRDrawMode.LINES;
	}
	private static sPv0 = new Vector3();
	private static sPv1 = new Vector3();
	private mLSTotal = 0;

	private mvs: Float32Array;
	private muvs: Float32Array;
	private mcvs: Float32Array;

	dashedData = false;

	getVS(): Float32Array {
		return this.mvs;
	}
	getUVS(): Float32Array {
		return this.muvs;
	}
	getCVS(): Float32Array {
		return this.mcvs;
	}
	getIVS(): IndexArrayViewType {
		return this.mivs;
	}

	/**
	 * line thinkness radius
	 */
	public lineRadius = 2.0;
	initialize(positions: Vector3DataType[], colors?: ColorDataType[]): void {
		const v3 = __$v3;
		const c4 = __$c4;
		let j = 0;
		if (this.dashedData) {
			this.mvs = new Float32Array(positions.length * 3);
			for (let i = 0; i < positions.length; ++i) {
				if (positions[i]) {
					v3.setVector3(positions[i]).toArray3(this.mvs, j++ * 3);
				}
			}
		} else {
			this.mvs = new Float32Array(positions.length > 2 ? ((positions.length - 2) * 2 + 2) * 3 : positions.length * 3);
			for (let i = 0; i < positions.length; ++i) {
				if (positions[i]) {
					v3.setVector3(positions[i]).toArray3(this.mvs, j++ * 3);
					if (i > 0 && i < positions.length - 1) {
						v3.setVector3(positions[i]).toArray3(this.mvs, j++ * 3);
					}
				}
			}
		}

		if (colors) {
			j = 0;
			if (this.dashedData) {
				this.mcvs = new Float32Array(colors.length * 3);
				for (let i = 0; i < colors.length; ++i) {
					if (colors[i]) {
						c4.setColor(colors[i]).toArray3(this.mcvs, j++ * 3);
					}
				}
			} else {
				this.mcvs = new Float32Array(colors.length > 2 ? ((colors.length - 2) * 2 + 2) * 3 : colors.length * 3);
				for (let i = 0; i < colors.length; ++i) {
					if (colors[i]) {
						c4.setColor(colors[i]).toArray3(this.mcvs, j++ * 3);
						if (i > 0 && i < colors.length - 1) {
							c4.setColor(colors[i]).toArray3(this.mcvs, j++ * 3);
						}
					}
				}
			}
		}
		// console.log("this.mvs: ", this.mvs);
		// console.log(this.mcvs);
		if (!this.bounds) this.bounds = new AABB();
		this.bounds.addFloat32Arr(this.mvs);
		this.bounds.updateFast();

		this.trisNumber = 0;
		this.vtCount = Math.floor(this.mvs.length / 3);
		this.mLSTotal = Math.floor(this.vtCount / 2);
	}
	__$destroy(): void {
		if (this.mivs) {
			this.bounds = null;

			this.mvs = null;
			this.muvs = null;
			this.mcvs = null;
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
		const DL = DashedLineGeometry;
		let j = 0;
		const vs = this.mvs;
		let flag = 0;
		const radius = this.lineRadius;
		const pv0 = DL.sPv0;
		const pv1 = DL.sPv1;
		for (let i = 0; i < this.mLSTotal; ++i) {
			pv0.setXYZ(vs[j], vs[j + 1], vs[j + 2]);
			pv1.setXYZ(vs[j + 3], vs[j + 4], vs[j + 5]);
			flag = RadialLine.IntersectionLS(rlpv, rltv, pv0, pv1, outV, radius);
			if (flag > 0) {
				return 1;
			}
			j += 6;
		}
		return 0;
	}
}

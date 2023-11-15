/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../../math/Vector3";
import Matrix4 from "../../math/Matrix4";
import AABB from "../../cgeom/AABB";
import { WGRDrawMode } from "../../render/Define";

export default class GeometryBase {
	protected mPolyhedral = true;

	protected mTransMatrix: Matrix4;
	protected mivs: IndexArrayViewType;

	constructor() {}
	/**
	 * 强制更新 vertex indices buffer 数据, 默认值为false
	 */
	forceUpdateIVS = false;

	/**
	 * 是否启用形状模式数据, 默认值为true
	 */
	shape = true;
	/**
	 * vtx positons bounds AABB in the local space
	 */
	bounds: AABB;
	normalType = 0;
	normalScale = 1.0;
	vtxTotal = 0;
	trisNumber = 0;
	//  vtx postion in data stream used count
	vtCount = 0;
	drawMode = WGRDrawMode.TRIANGLES;

	setTransformMatrix(matrix: Matrix4): void {
		this.mTransMatrix = matrix;
	}
	getTransformMatrix(): Matrix4 {
		return this.mTransMatrix;
	}
	/**
	 * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体).
	 *         如果是多面体实体,则可以进行三角面的相关计算等操作, 如果不是则需要进行相关的几何算法计算.
	 */
	isPolyhedral(): boolean {
		return this.mPolyhedral;
	}
	// 设置自身是否是多面体实体，根据实际需要改变相关的状态值
	setPolyhedral(polyhedral: boolean): void {
		this.mPolyhedral = polyhedral;
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
		return -1;
	}
	// isGeomDynamic(): boolean {
	//     return true;
	// }
	getVSStride(): number {
		return 3;
	}
	getUVSStride(): number {
		return 2;
	}
	getNVSStride(): number {
		return 3;
	}
	/**
	 * @returns vertex position buffer Float32Array
	 */
	getVS(): Float32Array {
		return null;
	}
	/**
	 * @returns vertex uv buffer Float32Array
	 */
	getUVS(): Float32Array {
		return null;
	}
	/**
	 * @returns vertex normal buffer Float32Array
	 */
	getNVS(): Float32Array {
		return null;
	}
	/**
	 * @returns vertex vtx color(r,g,b) buffer Float32Array
	 */
	getCVS(): Float32Array {
		return null;
	}
	/**
	 * @returns vertex indices buffer Uint16Array or Uint32Array
	 */
	getIVS(): IndexArrayViewType {
		return this.mivs;
	}

	/**
	 * @param layoutBit vertex shader vertex attributes layout bit status.
	 *                  the value of layoutBit comes from the material shdder program.
	 */
	setBufSortFormat(layoutBit: number): void {
		if (layoutBit < 1) {
			console.error(
				"vertex layoutBit is the error value(0x" +
					layoutBit.toString(16) +
					") in GeometryBase::setBufSortFormat(), the material instance must initialize."
			);
		}
		// this.m_layoutBit = layoutBit;
	}
	/**
	 * really destroy this instance all data
	 */
	__$destroy(): void {
		if (this.mivs) {
			//console.log("GeometryBase::__$destroy()... this.m_attachCount: "+this.m_attachCount);
			this.mivs = null;
			this.trisNumber = 0;
			this.mTransMatrix = null;
		}
	}
}

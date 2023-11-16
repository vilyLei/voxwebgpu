/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../math/MathConst";
import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";
import Matrix4 from "../math/Matrix4";
import Matrix4Pool from "../math/Matrix4Pool";
import IROTransform from "./IROTransform";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { IdentityMat4Data } from "../math/MatrixUtils";
import Vector3 from "../math/Vector3";
import { TransformParam } from "./TransformParam";

const v3 = new Vector3();
export default class ROTransform implements IROTransform {

	private static sUid = 0;

	static readonly NONE = 0;
	static readonly POSITION = 1;
	static readonly ROTATION = 2;
	static readonly SCALE = 4;
	static readonly TRANSFORM = 7;
	static readonly PARENT_MAT = 8;

	private mUid = ROTransform.sUid++;
	private mFS32: Float32Array | null = null;

	// It is a flag that need inverted mat yes or no
	private mInvMat = false;
	private mRot = false;
	private mDt = 0;

	uniformv: WGRUniformValue;

	version = -1;
	/**
	 * the default value is 0
	 */
	__$transUpdate = 0;

	updatedStatus = ROTransform.POSITION;
	updateStatus = ROTransform.TRANSFORM;

	constructor(fs32?: Float32Array) {

		this.mDt = fs32 ? 1 : 0;
		this.mFS32 = fs32 ? fs32 : new Float32Array(16);
	}
	set transform(t: TransformParam) {
		if (t) {
			this.setScale(t.scale);
			this.setRotation(t.rotation);
			this.setPosition(t.position);
			if(t.matrix && t.matrix.length == 16) {
				this.mFS32.set(t.matrix);
			}
		}
	}
	get transform(): TransformParam {
		return {
			scale: this.getScale(),
			rotation: this.getRotation(),
			position: this.getPosition()
		}
	}
	get uid(): number {
		return this.mUid;
	}
	get fs32Data(): Float32Array {
		return this.mFS32;
	}
	/**
	 * 防止因为共享 fs32 数据带来的逻辑错误
	 */
	rebuildFS32Data(): void {
		if (this.mDt > 0) {
			this.mDt = 0;
			this.mFS32 = new Float32Array(16);
		}
	}
	getRotationFlag(): boolean {
		return this.mRot;
	}
	getX(): number {
		return this.mFS32[12];
	}
	getY(): number {
		return this.mFS32[13];
	}
	getZ(): number {
		return this.mFS32[14];
	}
	setX(p: number): ROTransform {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.mFS32[12] = p;
		this.updateTo();
		return this;
	}
	setY(p: number): ROTransform {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.mFS32[13] = p;
		this.updateTo();
		return this;
	}
	setZ(p: number): ROTransform {
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.mFS32[14] = p;
		this.updateTo();
		return this;
	}
	setXYZ(px: number, py: number, pz: number): ROTransform {
		this.mFS32[12] = px;
		this.mFS32[13] = py;
		this.mFS32[14] = pz;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
		return this;
	}
	offsetPosition(pv: Vector3DataType): ROTransform {
		v3.setXYZ(0, 0, 0).setVector3(pv);
		this.mFS32[12] += v3.x;
		this.mFS32[13] += v3.y;
		this.mFS32[14] += v3.z;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
		return this;
	}
	setPosition(pv: Vector3DataType): ROTransform {
		v3.setXYZ(0, 0, 0).setVector3(pv);
		this.mFS32[12] = v3.x;
		this.mFS32[13] = v3.y;
		this.mFS32[14] = v3.z;
		this.updateStatus |= 1;
		this.updatedStatus |= 1;
		this.updateTo();
		return this;
	}
	getPosition(pv?: Vector3Type): Vector3Type {
		if (!pv) pv = new Vector3();
		pv.x = this.mFS32[12];
		pv.y = this.mFS32[13];
		pv.z = this.mFS32[14];
		return pv;
	}
	copyPositionFrom(t: ROTransform): ROTransform {
		if (t) {
			this.mFS32[12] = t.mFS32[12];
			this.mFS32[13] = t.mFS32[13];
			this.mFS32[14] = t.mFS32[14];
			this.updateStatus |= ROTransform.POSITION;
			this.updatedStatus |= ROTransform.POSITION;
			this.updateTo();
		}
		return this;
	}
	getRotationX(): number {
		return this.mFS32[1];
	}
	getRotationY(): number {
		return this.mFS32[6];
	}
	getRotationZ(): number {
		return this.mFS32[9];
	}
	setRotationX(degrees: number): ROTransform {
		this.mFS32[1] = degrees;
		this.mRot = true;
		this.updateStatus |= ROTransform.ROTATION;
		this.updatedStatus |= ROTransform.ROTATION;
		this.updateTo();
		return this;
	}
	setRotationY(degrees: number): ROTransform {
		this.mFS32[6] = degrees;
		this.mRot = true;
		this.updateStatus |= ROTransform.ROTATION;
		this.updatedStatus |= ROTransform.ROTATION;
		this.updateTo();
		return this;
	}
	setRotationZ(degrees: number): ROTransform {
		this.mFS32[9] = degrees;
		this.mRot = true;
		this.updateStatus |= ROTransform.ROTATION;
		this.updatedStatus |= ROTransform.ROTATION;
		this.updateTo();
		return this;
	}
	setRotationXYZ(rx: number, ry: number, rz: number): ROTransform {
		this.mFS32[1] = rx;
		this.mFS32[6] = ry;
		this.mFS32[9] = rz;
		this.updateStatus |= ROTransform.ROTATION;
		this.updatedStatus |= ROTransform.ROTATION;
		this.mRot = true;
		this.updateTo();
		return this;
	}
	setRotation(pv: Vector3DataType): ROTransform {
		v3.setXYZ(0, 0, 0).setVector3(pv);
		this.setRotationXYZ(v3.x, v3.y, v3.z);
		return this;
	}
	getRotation(pv?: Vector3Type): Vector3Type {
		if (!pv) pv = new Vector3();
		pv.x = this.mFS32[1];
		pv.y = this.mFS32[6];
		pv.z = this.mFS32[9];
		return pv;
	}

	getScaleX(): number {
		return this.mFS32[0];
	}
	getScaleY(): number {
		return this.mFS32[5];
	}
	getScaleZ(): number {
		return this.mFS32[10];
	}
	setScaleX(p: number): ROTransform {
		this.mFS32[0] = p;
		this.updateStatus |= ROTransform.SCALE;
		this.updatedStatus |= ROTransform.SCALE;
		return this;
	}
	setScaleY(p: number): ROTransform {
		this.mFS32[5] = p;
		this.updateStatus |= ROTransform.SCALE;
		this.updatedStatus |= ROTransform.SCALE;
		return this;
	}
	setScaleZ(p: number): ROTransform {
		this.mFS32[10] = p;
		this.updateStatus |= ROTransform.SCALE;
		this.updatedStatus |= ROTransform.SCALE;
		return this;
	}
	setScaleXYZ(sx: number, sy: number, sz: number): ROTransform {
		this.mFS32[0] = sx;
		this.mFS32[5] = sy;
		this.mFS32[10] = sz;

		this.updateStatus |= ROTransform.SCALE;
		this.updatedStatus |= ROTransform.SCALE;
		this.updateTo();
		return this;
	}
	setScale(pv: Vector3DataType): ROTransform {
		v3.setXYZ(1, 1, 1).setVector3(pv);
		this.setScaleXYZ(v3.x, v3.y, v3.z);
		return this;
	}
	getScale(pv?: Vector3Type): Vector3Type {
		if (!pv) pv = new Vector3();
		pv.x = this.mFS32[0];
		pv.y = this.mFS32[5];
		pv.z = this.mFS32[10];
		return pv;
	}

	setScaleAll(s: number): ROTransform {
		this.mFS32[0] = s;
		this.mFS32[5] = s;
		this.mFS32[10] = s;
		this.updateStatus |= ROTransform.SCALE;
		this.updatedStatus |= ROTransform.SCALE;
		this.updateTo();
		return this;
	}

	// local to world space matrix
	private mOMat: Matrix4;
	private mLocalMat: Matrix4;
	private mParentMat: Matrix4;
	private mToParentMat: Matrix4;
	private mToParentMatFlag = true;
	// word to local matrix
	private mInvOmat: Matrix4;

	localToGlobal(pv: IVector3): void {
		this.getMatrix().transformVectorSelf(pv);
	}
	globalToLocal(pv: IVector3): void {
		this.getInvMatrix().transformVectorSelf(pv);
	}
	// maybe need call update function
	getInvMatrix(): Matrix4 {
		if (this.mInvOmat) {
			if (this.mInvMat) {
				this.mInvOmat.copyFrom(this.mOMat);
				this.mInvOmat.invert();
			}
		} else {
			this.mInvOmat = Matrix4Pool.GetMatrix();
			this.mInvOmat.copyFrom(this.mOMat);
			this.mInvOmat.invert();
		}
		this.mInvMat = false;
		return this.mInvOmat;
	}
	getLocalMatrix(): Matrix4 {
		if (this.updateStatus > 0) {
			this.update();
		}
		return this.mLocalMat;
	}
	// get local to world matrix, maybe need call update function
	getMatrix(flag = true): Matrix4 {
		if (this.updateStatus > 0 && flag) {
			this.update();
		}
		return this.mOMat;
	}
	// get local to parent space matrix, maybe need call update function
	getToParentMatrix(): Matrix4 {
		if (this.mToParentMat) {
			//  if(this.mToParentMatFlag)
			//  {
			//      console.log("....");
			//      this.mToParentMat.invert();
			//  }
			return this.mToParentMat;
		}
		return this.mOMat;
	}
	// local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
	setParentMatrix(matrix: Matrix4): ROTransform {
		//  console.log("sTOTransform::etParentMatrix(), this.mParentMat != matrix: ",(this.mParentMat != matrix),this.mUid);

		this.mParentMat = matrix;
		this.mInvMat = true;
		if (this.mParentMat) {
			if (this.mLocalMat == this.mOMat) {
				this.updateStatus = ROTransform.TRANSFORM;
				this.updatedStatus = this.updateStatus;
				this.mLocalMat = Matrix4Pool.GetMatrix();
			} else {
				this.updateStatus |= ROTransform.PARENT_MAT;
				this.updatedStatus = this.updateStatus;
			}
			this.updateTo();
		}
		return this;
	}
	getParentMatrix(): Matrix4 {
		return this.mParentMat;
	}
	updateMatrixData(matrix: Matrix4): ROTransform {
		if (matrix) {
			this.updateStatus = ROTransform.NONE;
			this.mInvMat = true;
			this.mOMat.copyFrom(matrix);
			this.updateTo();
		}
		return this;
	}
	__$setMatrix(matrix: Matrix4): void {
		if (matrix != null) {
			this.updateStatus = ROTransform.NONE;
			this.mInvMat = true;
			if (this.mLocalMat == this.mOMat) {
				this.mLocalMat = matrix;
			}
			if (this.mOMat) {
				Matrix4Pool.RetrieveMatrix(this.mOMat);
			}
			this.mOMat = matrix;
			this.updateTo();
		}
	}
	private destroy(): void {
		// 当自身被完全移出RenderWorld之后才能执行自身的destroy
		if (this.mInvOmat) Matrix4Pool.RetrieveMatrix(this.mInvOmat);
		if (this.mLocalMat) {
			Matrix4Pool.RetrieveMatrix(this.mLocalMat);
		}
		if (this.mOMat && this.mOMat != this.mLocalMat) {
			Matrix4Pool.RetrieveMatrix(this.mOMat);
		}
		this.mInvOmat = null;
		this.mLocalMat = null;
		this.mOMat = null;
		this.mParentMat = null;
		this.updateStatus = ROTransform.TRANSFORM;
		this.mFS32 = null;
		// this.wrapper = null;
	}

	copyFrom(src: ROTransform): ROTransform {
		this.mFS32.set(src.mFS32, 0);
		this.updatedStatus |= 1;
		this.updateStatus |= ROTransform.TRANSFORM;
		this.mRot = src.mRot;
		this.updateTo();
		return;
	}
	forceUpdate(): ROTransform {
		this.updateStatus |= ROTransform.TRANSFORM;
		this.update();
		return;
	}
	private updateTo(): void {
		// if (this.wrapper) this.wrapper.updateTo();
	}
	// setUpdater(updater: ITransUpdater): void {
	// 	// if (this.wrapper) this.wrapper.setUpdater(updater);
	// }
	isDirty(): boolean {
		return this.updateStatus != ROTransform.NONE;
	}
	update(): void {
		let st = this.updateStatus;
		if (st > 0) {
			this.mInvMat = true;
			st = st | this.updatedStatus;
			if ((st & ROTransform.TRANSFORM) > 0) {
				const factor = MathConst.MATH_PI_OVER_180;
				this.mLocalMat.getLocalFS32().set(this.mFS32, 0);
				if (this.mRot) {
					this.mLocalMat.setRotationEulerAngle(this.mFS32[1] * factor, this.mFS32[6] * factor, this.mFS32[9] * factor);
				}
				if (this.mParentMat) {
					st = st | ROTransform.PARENT_MAT;
				}
			}
			if (this.mOMat != this.mLocalMat) {
				this.mOMat.copyFrom(this.mLocalMat);
			}
			if ((st & ROTransform.PARENT_MAT) == ROTransform.PARENT_MAT) {
				if (this.mToParentMat) {
					this.mToParentMat.copyFrom(this.mOMat);
				} else {
					this.mToParentMat = Matrix4Pool.GetMatrix();
					this.mToParentMat.copyFrom(this.mOMat);
				}
				this.mToParentMatFlag = true;
				this.mOMat.append(this.mParentMat);
			}

			st = ROTransform.NONE;

			this.version++;
			this.uniformv.upate();
		}
		this.updateStatus = st;
		this.__$transUpdate = 0;
	}
	getMatrixFS32(): Float32Array {
		return this.getMatrix().getLocalFS32();
	}

	private static sFBUSY = 1;
	private static sFFREE = 0;
	private static sFlags: number[] = [];
	private static sUList: ROTransform[] = [];
	private static sFreeIds: number[] = [];

	private static GetFreeId(): number {
		if (ROTransform.sFreeIds.length > 0) {
			return ROTransform.sFreeIds.pop();
		}
		return -1;
	}
	static Create(param?: { matrix?: IMatrix4, fs32?: Float32Array }): ROTransform {
		param = param ? param : {};
		let unit: ROTransform;
		const index = param.fs32 ? -1 : ROTransform.GetFreeId();
		if (index >= 0) {
			unit = ROTransform.sUList[index];
			ROTransform.sFlags[index] = ROTransform.sFBUSY;
			unit.rebuildFS32Data();
		} else {
			unit = new ROTransform(param.fs32);
			ROTransform.sUList.push(unit);
			ROTransform.sFlags.push(ROTransform.sFBUSY);
		}
		if (param.matrix) {
			unit.mOMat = param.matrix as Matrix4;
		} else {
			unit.mOMat = Matrix4Pool.GetMatrix();
		}
		unit.mLocalMat = unit.mOMat;

		if (!param.fs32) {
			const ida = IdentityMat4Data;
			if (unit.mFS32) {
				unit.mFS32.set(ida, 0);
			} else {
				unit.mFS32 = ida.slice(0);
			}
		}
		unit.uniformv = new WGRUniformValue({ data: unit.mOMat.getLocalFS32(), shdVarName: "objMat" });
		return unit;
	}

	static Restore(pt: ROTransform): void {

		if (pt && ROTransform.sFlags[pt.uid] == ROTransform.sFBUSY) {

			const uid = pt.uid;
			ROTransform.sFreeIds.push(uid);
			ROTransform.sFlags[uid] = ROTransform.sFFREE;

			pt.destroy();
		}
	}
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "./IVector3";
import Float32Data from "../base/Float32Data";

interface IMatrix4 extends Float32Data {
	/**
	 * @param array matrix4 data, 16 number elements
	 * @param offset the default value is 0
	 */
	fromArray(array: number[] | ArrayLike<number>, offset?: number): IMatrix4;
	setData(array16: number[] | ArrayLike<number>): IMatrix4;
	getCapacity(): number;
	getUid(): number;
	getLocalFS32(): Float32Array;
	getFS32(): Float32Array;
	getFSIndex(): number;
	identity(): void;
	determinant(): number;
	append(lhs: IMatrix4): void;
	append3x3(lhs: IMatrix4): void;
	/**
	 * @param radian rotation angle radian
	 * @param axis rotation axis, it is a normalized IVector3 instance
	 * @param pivotPoint the default value is null
	 */
	appendRotationPivot(radian: number, axis: IVector3, pivotPoint?: IVector3): void;
	appendRotation(radian: number, axis: IVector3): void;
	appendRotationX(radian: number): void;
	appendRotationY(radian: number): void;
	appendRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	appendRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	setScale(v3: IVector3): IMatrix4;
	setScaleXYZ(xScale: number, yScale: number, zScale: number): void;
	setRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	setRotationEulerAngle2(cosX: number, sinX: number, cosY: number, sinY: number, cosZ: number, sinZ: number): void;
	setTranslationXYZ(px: number, py: number, pz: number): void;
	setTranslation(v3: IVector3): void;
	appendScaleXYZ(xScale: number, yScale: number, zScale: number): void;

	appendScaleXY(xScale: number, yScale: number): void;
	appendTranslationXYZ(px: number, py: number, pz: number): void;
	appendTranslation(v3: IVector3): void;
	copyColumnFrom(column_index: number, v3: IVector3): void;
	copyColumnTo(column_index: number, v3: IVector3): void;
	/**
	 * @param fs32Arr src data
	 * @param index the default value is 0
	 */
	setF32ArrAndIndex(fs32Arr: Float32Array, index?: number): void;
	/**
	 * @param index the default value is 0
	 */
	setF32ArrIndex(index: number): void;
	setF32Arr(fs32Arr: Float32Array): void;
	/**
	 *
	 * @param fs32Arr src data
	 * @param index the default value is 0
	 */
	copyFromF32Arr(fs32Arr: Float32Array, index?: number): void;
	/**
	 *
	 * @param fs32Arr dst data
	 * @param index the default value is 0
	 */
	copyToF32Arr(fs32Arr: Float32Array, index?: number): void;
	copyFrom(smat: IMatrix4): void;
	copyTo(dmat: IMatrix4): void;
	/**
	 *
	 * @param float_rawDataArr src data
	 * @param rawDataLength the default value is 16
	 * @param index  the default value is 0
	 * @param transpose  the default value is false
	 */
	copyRawDataFrom(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, transpose?: Boolean): void;
	/**
	 *
	 * @param float_rawDataArr dst data
	 * @param rawDataLength the default value is 16
	 * @param index  the default value is 0
	 * @param transpose  the default value is false
	 */
	copyRawDataTo(float_rawDataArr: Float32Array, rawDataLength?: number, index?: number, transpose?: boolean): void;
	copyRowFrom(row_index: number, v3: IVector3): void;
	copyRowTo(row_index: number, v3: IVector3): void;
	/**
	 * @param orientationStyle the default value is OrientationType.EULER_ANGLES
	 * @returns [position, rotation, scale]
	 */
	decompose(orientationStyle?: number): IVector3[];
	invert(): boolean;
	pointAt(pos: IVector3, at: IVector3, up: IVector3): void;
	prepend(rhs: IMatrix4): void;
	prepend3x3(rhs: IMatrix4): void;
	prependRotationPivot(radian: number, axis: IVector3, pivotPoint: IVector3): void;
	prependRotation(radian: number, axis: IVector3): void;
	prependRotationX(radian: number): void;
	prependRotationY(radian: number): void;
	prependRotationZ(radian: number): void;
	// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
	prependRotationEulerAngle(radianX: number, radianY: number, radianZ: number): void;
	prependScale(xScale: number, yScale: number, zScale: number): void;
	prependScaleXY(xScale: number, yScale: number): void;
	prependTranslationXYZ(px: number, py: number, pz: number): void;
	prependTranslation(v3: IVector3): void;
	recompose(components: IVector3[], orientationStyle: number): boolean;
	setThreeAxes(x_axis: IVector3, y_axis: IVector3, z_axis: IVector3,): void;
	deltaTransformVector(v3: IVector3): IVector3;

	deltaTransformVectorSelf(v3: IVector3): void;
	deltaTransformOutVector(v3: IVector3, out_v3: IVector3): void;
	transformVector(v3: IVector3): IVector3;
	transformOutVector(v3: IVector3, out_v3: IVector3): void;
	transformOutVector3(v3: IVector3, out_v3: IVector3): void;
	transformVector3Self(v3: IVector3): void;
	transformVectorSelf(v3: IVector3): void;
	transformVectors(float_vinArr: Float32Array | number[], vinLength: number, float_voutArr: Float32Array): void;
	transformVectorsSelf(float_vinArr: Float32Array | number[], vinLength: number): void;
	transformVectorsRangeSelf(float_vinArr: Float32Array | number[], begin: number, end: number): void;
	transpose(): void;
	interpolateTo(toMat: IMatrix4, float_percent: number): void;
	rotationX(radian: number): void;
	rotationY(radian: number): void;
	rotationZ(radian: number): void;

	copyTranslation( m: IMatrix4 ): IMatrix4;

	transformPerspV4Self(v4: IVector3): void;

	premultiply(m: IMatrix4): IMatrix4;
	multiply(m: IMatrix4): IMatrix4;
	invertThis(): IMatrix4;


	lookAtRH(eyePos: IVector3, atPos: IVector3, up: IVector3): void;
	lookAtLH(eyePos: IVector3, atPos: IVector3, up: IVector3): void;

	clone(): IMatrix4;
	destroy(): void;
}

export default IMatrix4;

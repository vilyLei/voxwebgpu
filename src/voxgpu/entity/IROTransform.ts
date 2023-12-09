/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";
import { TransformParam } from "./TransformParam";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
// import ITransUpdater from "../../vox/scene/ITransUpdater";
// import IROTransUpdateWrapper from "./IROTransUpdateWrapper";
export default interface IROTransform {
    updateStatus: number;
    updatedStatus: number;
    version: number;

    uid: number;

    fs32Data: Float32Array;
    transform: TransformParam;
    uniformv: WGRUniformValue;
    
    getRotationFlag(): boolean;
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(p: number): IROTransform;
    setY(p: number): IROTransform;
    setZ(p: number): IROTransform;
    setXYZ(px: number, py: number, pz: number): IROTransform;
    offsetPosition(pv?: Vector3DataType): IROTransform;
    setPosition(pv: Vector3DataType): IROTransform;
    getPosition(pv?: Vector3Type): Vector3Type;

    copyPositionFrom(t: IROTransform): IROTransform;

    getRotationX(): number;
    getRotationY(): number;
    getRotationZ(): number;
    setRotationX(degrees: number): IROTransform;
    setRotationY(degrees: number): IROTransform;
    setRotationZ(degrees: number): IROTransform;
    setRotationXYZ(rx: number, ry: number, rz: number): IROTransform;
    setRotation(pv: Vector3DataType): IROTransform;
    getRotation(pv?: Vector3Type): Vector3Type;

    getScaleX(): number;
    getScaleY(): number;
    getScaleZ(): number;
    setScaleX(p: number): IROTransform;
    setScaleY(p: number): IROTransform;
    setScaleZ(p: number): IROTransform;
    setScaleXYZ(sx: number, sy: number, sz: number): IROTransform;
    setScale(pv: Vector3DataType): IROTransform;
    getScale(pv?: Vector3Type): Vector3Type;
    setScaleAll(s: number): IROTransform;

    localToGlobal(pv: IVector3): void;
    globalToLocal(pv: IVector3): void;

    // maybe need call update function
    getInvMatrix(): IMatrix4;
    getLocalMatrix(): IMatrix4;
    /**
     *
     * @param updateEnabled the default value is false
     */
    getMatrix(updateEnabled?: boolean): IMatrix4;
    // get local to parent space matrix, maybe need call update function
    getToParentMatrix(): IMatrix4;
    // local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
    setParentMatrix(matrix: IMatrix4): IROTransform;
    getParentMatrix(): IMatrix4;
    updateMatrixData(matrix: IMatrix4): IROTransform;


    copyFrom(src: IROTransform): IROTransform;
    forceUpdate(): IROTransform;
    update(): void;
    getMatrixFS32(): Float32Array;
	isDirty(): boolean;

//     wrapper: IROTransUpdateWrapper;
//     setUpdater(updater: ITransUpdater): void;
}

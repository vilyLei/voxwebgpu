/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";
// import ITransUpdater from "../../vox/scene/ITransUpdater";
// import IROTransUpdateWrapper from "./IROTransUpdateWrapper";
export default interface IROTransform {
    updateStatus: number;
    updatedStatus: number;
    version: number;
    getUid(): number;
    getFS32Data(): Float32Array;
    getRotationFlag(): boolean;
    getX(): number;
    getY(): number;
    getZ(): number;
    setX(p: number): void;
    setY(p: number): void;
    setZ(p: number): void;
    setXYZ(px: number, py: number, pz: number): void;
    offsetPosition(pv: IVector3): void;
    setPosition(pv: IVector3): void;
    getPosition(pv: IVector3): void;

    copyPositionFrom(t: IROTransform): void;

    getRotationX(): number;
    getRotationY(): number;
    getRotationZ(): number;
    setRotationX(degrees: number): void;
    setRotationY(degrees: number): void;
    setRotationZ(degrees: number): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setRotation(pv: IVector3): void;
    getRotation(pv: IVector3): void;

    getScaleX(): number;
    getScaleY(): number;
    getScaleZ(): number;
    setScaleX(p: number): void;
    setScaleY(p: number): void;
    setScaleZ(p: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    setScale(pv: IVector3): void;
    getScale(pv: IVector3): void;
    setScaleAll(s: number): void;

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
    setParentMatrix(matrix: IMatrix4): void;
    getParentMatrix(): IMatrix4;
    updateMatrixData(matrix: IMatrix4): void;


    copyFrom(src: IROTransform): void;
    forceUpdate(): void;
    update(): void;
    getMatrixFS32(): Float32Array;
	isDirty(): boolean;

//     wrapper: IROTransUpdateWrapper;
//     setUpdater(updater: ITransUpdater): void;
}

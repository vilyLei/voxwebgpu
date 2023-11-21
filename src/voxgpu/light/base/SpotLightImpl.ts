/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../material/IColor4";
import IVector3 from "../../math/IVector3";
export interface SpotLightImpl {

    readonly position: IVector3;
    readonly direction: IVector3;
    readonly color: IColor4;
    /**
     * spot light 椎体夹角角度值
     */
    angleDegree: number;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number;

    setParams(pos: Vector3DataType, direc: Vector3DataType, color: ColorDataType, degree: number, f1: number, f2: number): void;
}

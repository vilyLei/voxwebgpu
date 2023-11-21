/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../material/IColor4";
import IVector3 from "../../math/IVector3";

export interface PointLightImpl {

    readonly position: IVector3;
    readonly color: IColor4;

    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number;
    setParams(pos: Vector3DataType, color: ColorDataType, f1: number, f2: number): void;

}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../material/IColor4";
import IVector3 from "../../math/IVector3";
type PointLightParam = { color?: ColorDataType, position?: Vector3DataType, factor1?: number, factor2?: number };
interface PointLightImpl {

    readonly position: IVector3;
    readonly color: IColor4;

    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    factor1: number;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    factor2: number;
    setParam(param: PointLightParam): void;

}
export { PointLightParam, PointLightImpl }

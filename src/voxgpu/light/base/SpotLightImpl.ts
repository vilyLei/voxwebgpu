/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../material/IColor4";
import IVector3 from "../../math/IVector3";
type SpotLightParam = { color?: ColorDataType, position?: Vector3DataType, direction?: Vector3DataType, factor1?: number, factor2?: number };
interface SpotLightImpl {

    position: IVector3;
    direction: IVector3;
    color: IColor4;
    /**
     * spot light 椎体夹角角度值
     */
    degree: number;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    factor1: number;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    factor2: number;

    setParam(param: SpotLightParam): void;
}
export {SpotLightParam, SpotLightImpl};

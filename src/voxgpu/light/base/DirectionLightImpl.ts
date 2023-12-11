/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColor4 from "../../material/IColor4";
import IVector3 from "../../math/IVector3";

type DirectionLightParam = { color?: ColorDataType, direction?: Vector3DataType };
interface DirectionLightImpl {

    readonly direction: IVector3;
    readonly color: IColor4;

    setParam(param: DirectionLightParam): void;
}
export {DirectionLightImpl, DirectionLightParam}

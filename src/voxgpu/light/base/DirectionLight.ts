/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import { DirectionLightParam, DirectionLightImpl } from "./DirectionLightImpl";

export class DirectionLight implements DirectionLightImpl {
    direction = new Vector3(0.0, -1.0, 0.0, 0.0);
    color = new Color4(1.0, 1.0, 1.0, 1.0);
    constructor(param: DirectionLightParam) {
        this.setParam(param);
    }

    setParam(param?: DirectionLightParam): void {
        if (param) {
            if (param.color) this.color.setColor(param.color);
            if (param.direction) this.direction.setVector3(param.direction);
        }
    }
    applyTo(dfs: Float32Array, cfs: Float32Array, offset = 0): void {

        this.direction.toArray3(dfs, offset);
        this.color.toArray3(cfs, offset);
    }
}

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import { SpotLightParam, SpotLightImpl } from "./SpotLightImpl";

export class SpotLight implements SpotLightImpl {

    position = new Vector3(0, 100, 0);
    direction = new Vector3(0, -1, 0, 0);
    color = new Color4(1, 1, 1, 1);
    /**
     * spot light 椎体夹角角度值
     */
    degree = 30;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    factor1 = 0.0001;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    factor2 = 0.0005;

    constructor(param?: SpotLightParam) {
        this.setParam(param)
    }

    setParam(param: SpotLightParam): void {
        if (param) {
            if (param.color) this.color.setColor(param.color);
            if (param.direction) this.direction.setVector3(param.direction);
            if (param.position) this.position.setVector3(param.position);
            if (param.factor1 !== undefined) this.factor1 = param.factor1;
            if (param.factor2 !== undefined) this.factor1 = param.factor2;
            if (param.degree !== undefined) this.degree = param.degree;
        }
    }
    applyTo(pfs: Float32Array, cfs: Float32Array, offset0 = 0, offset1 = 0): void {
        this.position.w = this.factor1;
        this.direction.w = Math.PI * this.degree / 180.0;
        this.color.a = this.factor2;
        this.position.toArray4(pfs, offset0);
        this.direction.toArray4(pfs, offset0 + 4);
        this.color.toArray4(cfs, offset1);
    }
}

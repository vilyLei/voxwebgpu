/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import { PointLightParam, PointLightImpl } from "./PointLightImpl";

export class PointLight implements PointLightImpl {

    position = new Vector3(0.0, 100.0, 0.0);
    color = new Color4(1.0, 1.0, 1.0, 1.0);

    /**
     * attenuation factor1
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    factor1 = 0.0001;
    /**
     * attenuation factor2
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    factor2 = 0.0005;

    constructor(param: PointLightParam) {
        this.setParam( param );
    }
    setParam(param: PointLightParam): void {
        if (param) {
            if (param.color) this.color.setColor(param.color);
            if (param.position) this.position.setVector3(param.position);
            if (param.factor1 !== undefined) this.factor1 = param.factor1;
            if (param.factor2 !== undefined) this.factor2 = param.factor2;
        }
    }
    applyTo(pfs: Float32Array, cfs: Float32Array, offset = 0): void {
        this.position.w = this.factor1;
        this.color.a = this.factor2;
        this.position.toArray4(pfs, offset);
        this.color.toArray4(cfs, offset);
    }

}

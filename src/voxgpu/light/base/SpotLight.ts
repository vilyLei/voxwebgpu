/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import { SpotLightImpl } from "./SpotLightImpl";

export class SpotLight implements SpotLightImpl {

    readonly position = new Vector3(0.0, 100.0, 0.0);
    readonly direction = new Vector3(0.0, -1.0, 0.0, 0.0);
    readonly color = new Color4(1.0, 1.0, 1.0, 1.0);
    /**
     * spot light 椎体夹角角度值
     */
    angleDegree = 30.0;
    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1 = 0.0001;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2 = 0.0005;

    constructor() { }

    setParams(pos: Vector3DataType, direc: Vector3DataType, color: ColorDataType, degree: number, f1: number, f2: number): void {

        this.position.setVector3(pos);
        this.direction.setVector3(direc);
        this.color.setColor(color);
        this.angleDegree = degree;
        this.attenuationFactor1 = f1;
        this.attenuationFactor2 = f2;
    }
}

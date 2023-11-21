/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/


import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import {PointLightImpl} from "./PointLightImpl";

export class PointLight implements PointLightImpl {

    readonly position = new Vector3(0.0, 100.0, 0.0);
    readonly color = new Color4(1.0, 1.0, 1.0, 1.0);

    /**
     * 顶点与点光源之间距离的一次方因子, default value is 0.0001
     */
    attenuationFactor1: number = 0.0001;
    /**
     * 顶点与点光源之间距离的二次方因子, default value is 0.0005
     */
    attenuationFactor2: number = 0.0005;
    constructor(rgbUint24: number = 0xffffff, pos: Vector3 = null) {
        this.color.setRGBUint24(rgbUint24);
        if (pos != null) this.position.copyFrom(pos);
    }
	setParams(pos: Vector3DataType, color: ColorDataType, f1: number, f2: number): void {
        this.position.setVector3( pos );
        this.color.setColor(color);
        this.attenuationFactor1 = f1;
        this.attenuationFactor2 = f2;
    }

}

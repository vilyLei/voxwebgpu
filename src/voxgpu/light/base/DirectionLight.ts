/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";
import { DirectionLightImpl } from "./DirectionLightImpl";

export class DirectionLight implements DirectionLightImpl {
	readonly direction = new Vector3(0.0, -1.0, 0.0, 0.0);
	readonly color = new Color4(1.0, 1.0, 1.0, 1.0);

	/**
	 * 顶点与点光源之间距离的一次方因子, default value is 0.0001
	 */
	attenuationFactor1 = 0.0;
	/**
	 * 顶点与点光源之间距离的二次方因子, default value is 0.0005
	 */
	attenuationFactor2 = 0.0;

	constructor(rgbUint24 = 0xffffff, direction?: Vector3) {
		this.color.setRGBUint24(rgbUint24);
		if (direction) this.direction.copyFrom(direction);
	}

	setParams(direc: Vector3DataType, color: ColorDataType, f1: number, f2: number): void {
		this.direction.setVector3(direc);
		this.color.setColor(color);
		this.attenuationFactor1 = f1;
		this.attenuationFactor2 = f2;
	}
}

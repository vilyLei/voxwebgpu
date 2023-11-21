/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";

export class SkyLight {
	readonly position = new Vector3();
	readonly color = new Color4(1.0, 1.0, 1.0, 1.0);

	/**
	 * 顶点与点光源之间距离的一次方因子, default value is 0.0001
	 */
	attenuationFactor1 = 0.0001;
	/**
	 * 顶点与点光源之间距离的二次方因子, default value is 0.0005
	 */
	attenuationFactor2 = 0.0005;

	constructor() {}
}

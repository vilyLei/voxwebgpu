/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import IAABB from "../cgeom/IAABB";

interface IRenderFrustum {
	near: number;
	far: number;
	aspect: number;
	/**
	 * fov radian
	 */
	fov: number;

	perspective: boolean

	viewWidth: number;
	viewHeight: number;
	viewHalfWidth: number;
	viewHalfHeight: number;

	readonly bounds: IAABB;

	nearHalfWidth: number;
	nearHalfHeight: number;
	nearWidth: number;
	nearHeight: number;

	readonly worldDirec: IVector3;
	readonly nearWorldCenter: IVector3;
	readonly farWorldCenter: IVector3;
	/**
	 * eight vertices: 4 far points, 4 near points
	 */
	readonly vertices: IVector3[];
	// world space front,back ->(view space -z,z), world space left,right ->(view space -x,x),world space top,bottm ->(view space y,-y)
	// readonly planes = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];
}

export {IRenderFrustum};

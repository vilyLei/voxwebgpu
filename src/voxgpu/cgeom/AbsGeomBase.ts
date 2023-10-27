/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../math/Vector3";

export class AbsGeomBase {
	constructor() {
	}
	static __tV0 = new Vector3();
	static __tV1 = new Vector3();
	static __tV2 = new Vector3();

	// unique id
	id = -1;
	position = new Vector3();

	update(): void { };
	updateFast(): void { };
}

export default AbsGeomBase;
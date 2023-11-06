import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";

import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGMaterial } from "./WGMaterial";
import { IWGCompMaterial } from "./IWGCompMaterial";

class WGCompMaterial extends WGMaterial implements IWGCompMaterial {

	/**
	 * for compute shader computing process
	 */
	workcounts?: Uint16Array;

	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
		// workgroupCountX: number, workgroupCountY?: number, workgroupCountZ?: number
		this.workcounts = new Uint16Array([1, 1, 0, 0]);
	}
	setWorkcounts(x: number, y?: number, z?: number): WGCompMaterial {
		const ts = this.workcounts;
		ts[0] = x;
		ts[1] = y !== undefined ? y : 0;
		ts[2] = z !== undefined ? z : 0;
		return this;
	}
}
export { WGTextureDataDescriptor, WGCompMaterial };

import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";

import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGMaterial } from "./WGMaterial";
import { IWGCompMaterial } from "./IWGCompMaterial";
interface WGCompMaterialDescripter extends WGMaterialDescripter {
	workcounts?: Uint16Array | number[];
}
class WGCompMaterial extends WGMaterial implements IWGCompMaterial {
	/**
	 * for compute shader computing process
	 */
	workcounts?: Uint16Array;

	exclueukeys = ['objMat', 'viewMat', 'projMat'];
	constructor(descriptor?: WGCompMaterialDescripter) {
		super(descriptor);
		if (descriptor) {
			const wts = descriptor.workcounts;
			if (wts) {
				this.setWorkcounts(wts[0], wts.length > 1 ? wts[1] : 0, wts.length > 2 ? wts[2] : 0);
			}
		}
	}
	/**
	 * @param x workgroupCountX
	 * @param y workgroupCountY
	 * @param z workgroupCountZ
	 */
	setWorkcounts(x: number, y?: number, z?: number): WGCompMaterial {
		if (!this.workcounts) {
			this.workcounts = new Uint16Array([1, 1, 0, 0]);
		}
		const ts = this.workcounts;
		ts[0] = x;
		ts[1] = y !== undefined ? y : 0;
		ts[2] = z !== undefined ? z : 0;
		return this;
	}
}
export { WGTextureDataDescriptor, WGCompMaterial };

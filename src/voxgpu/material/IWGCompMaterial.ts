import { IWGMaterial } from "./IWGMaterial";
interface IWGCompMaterial extends IWGMaterial {
	/**
	 * for compute shader computing process
	 */
	workcounts?: Uint16Array;
	setWorkcounts(x: number, y?: number, z?: number): IWGCompMaterial;

}
export { IWGCompMaterial };

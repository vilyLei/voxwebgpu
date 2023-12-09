import IROTransform from "../entity/IROTransform";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { WGRUnitState } from "../render/WGRUnitState";

interface WGREntityParam {
	/**
	 * this destination renderer process id, the default value is 0
	 */
	processIndex?:number,
	/**
	 * if the value is true,the entity will not to be immediately add to the renderer process by its id, the defaule value is true
	 */
	deferred?: boolean
	transform?: IROTransform;
	rstate?: WGRUnitState;
	materials?: WGMaterial[];
	geometry?: WGGeometry;
	textures?: WGTextureDataDescriptor[];
	phase?: string;
}

export { WGREntityParam };

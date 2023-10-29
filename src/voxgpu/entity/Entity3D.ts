import ROTransform from "./ROTransform";
import AABB from "../Cgeom/AABB";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";

class Entity3D {

	uuid?: string;
	materials: WGMaterial[];
	geometry: WGGeometry;

	bounds: AABB;
	transform: ROTransform;

	cameraViewing = true;

	constructor(transformEnabled = true) {
		this.init(transformEnabled);
	}
	protected init(transformEnabled: boolean): void {
		if (transformEnabled) {
			this.transform = ROTransform.Create();
		}
	}

	isREnabled(): boolean {
		const ms = this.materials;
		if (ms) {
			for (let i = 0; i < ms.length; ++i) {
				if (!ms[i].isREnabled()) {
					return false;
				}
			}
		} else {
			return false;
		}
		const g = this.geometry;
		if (g) {
			if(!g.isREnabled()) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	update(): void {
		if(this.transform) {
			this.transform.update();
		}
	}
	destroy(): void {}
}
export { Entity3D };

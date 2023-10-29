import ROTransform from "./ROTransform";
import AABB from "../Cgeom/AABB";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";

class Entity3D {
	private static sUid = 0;
	private mUid = Entity3D.sUid++;
	private mVisible = true;

	uuid?: string;
	materials: WGMaterial[];
	geometry: WGGeometry;

	bounds: AABB;
	transform: ROTransform;

	cameraViewing = true;

	readonly rflags = new Uint16Array([0, 0, 0, 0]);

	/**
	 * mouse interaction enabled
	 */
	mouseEnabled = false;

	constructor(transformEnabled = true) {
		this.init(transformEnabled);
	}
	protected init(transformEnabled: boolean): void {
		if (transformEnabled) {
			this.transform = ROTransform.Create();
		}
	}
	getUid(): number {
		return this.mUid;
	}
	isVisible(): boolean {
		return this.mVisible;
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
			if (!g.isREnabled()) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	update(): void {
		if (this.transform) {
			this.transform.update();
		}
	}
	destroy(): void { }
}
export { Entity3D };

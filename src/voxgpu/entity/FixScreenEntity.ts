import { Entity3D } from "./Entity3D";
class FixScreenEntity extends Entity3D {
	constructor() {
		super({ transformEnabled: false });
		this.cameraViewing = false;
	}
	update(): FixScreenEntity {
		return this;
	}
}
export { FixScreenEntity };

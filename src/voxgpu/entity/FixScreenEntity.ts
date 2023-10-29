import { Entity3D } from "./Entity3D";
class FixScreenEntity extends Entity3D {

	constructor() {
		super( false );
		this.cameraViewing = false;
	}	
}
export { FixScreenEntity };

import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
class AxisEntity extends Entity3D {
	constructor(param?: Entity3DParam) {
		param = param ? param : { transformEnabled: false };
		param.transformEnabled = false;
		super(param);
		this.cameraViewing = false;
	}
	update(): AxisEntity {
		return this;
	}
}
export { Entity3DParam, getUniformValueFromParam, AxisEntity };

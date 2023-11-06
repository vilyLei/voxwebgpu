import { WGMaterial } from "../material/WGMaterial";
import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
class ComputeEntity extends Entity3D {
	constructor(param?: Entity3DParam) {
		param = param ? param : { transformEnabled: false };
		param.transformEnabled = false;
		super(param);
		this.cameraViewing = false;
		this.workcounts = new Uint16Array([1, 1, 0, 0]);
		this.createMaterial(param);
	}
	setWorkcounts(x: number, y?: number, z?: number): ComputeEntity {
		const ts = this.workcounts;
		ts[0] = x;
		ts[1] = y !== undefined ? y : 0;
		ts[2] = z !== undefined ? z : 0;
		return this;
	}
	protected createMaterial(param: Entity3DParam): void {
		if (!param) param = {};
		if (param.materials) {
			this.materials = param.materials;
		} else {
			const shaderCodeSrc = param.shaderSrc;
			const material = new WGMaterial({
				shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "ComputeEntity-material",
				shaderCodeSrc
			});
			if (param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues;
			this.materials = [material];
		}
	}
	isREnabled(): boolean {
		return true;
	}
	update(): ComputeEntity {
		return this;
	}
}
export { Entity3DParam, getUniformValueFromParam, ComputeEntity };

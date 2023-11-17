import { WGCompMaterial } from "../material/WGCompMaterial";
import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
interface ComputeEntityParam extends Entity3DParam {
	workcounts?: Uint16Array | number[];
}
class ComputeEntity extends Entity3D {
	constructor(param?: ComputeEntityParam) {
		param = param ? param : { transformEnabled: false };
		param.transformEnabled = false;
		super(param);
		this.cameraViewing = false;
		const wts = param.workcounts;
		if(wts) {
			this.setWorkcounts(wts[0], wts.length > 1 ? wts[1] : 0, wts.length > 2 ? wts[2] : 0);
		}
		this.createMaterial(param);
	}
	/**
	 * @param x workgroupCountX
	 * @param y workgroupCountY
	 * @param z workgroupCountZ
	 */
	setWorkcounts(x: number, y?: number, z?: number): ComputeEntity {
		if(!this.workcounts){
			this.workcounts = new Uint16Array([1, 1, 0, 0]);
		}
		const ts = this.workcounts;
		ts[0] = x;
		ts[1] = y !== undefined ? y : 0;
		ts[2] = z !== undefined ? z : 0;
		return this;
	}
	protected createMaterial(param: ComputeEntityParam): void {
		if (!param) param = {};
		if (param.materials) {
			this.materials = param.materials;
		} else {
			const shaderSrc = param.shaderSrc;
			const material = new WGCompMaterial({
				shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "ComputeEntity-material",
				shaderSrc
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

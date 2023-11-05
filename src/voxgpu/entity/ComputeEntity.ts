import { WGMaterial } from "../material/WGMaterial";
import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
class ComputeEntity extends Entity3D {
	constructor(param?: Entity3DParam) {
		param = param ? param : { transformEnabled: false };
		param.transformEnabled = false;
		super(param);
		this.cameraViewing = false;
		this.workgcounts = new Uint16Array([1,1,0,0]);
		this.createMaterial(param);
	}
	
	protected createMaterial(param: Entity3DParam): void {
		if (!param) param = {};
		if (param.materials) {
			this.materials = param.materials;
		} else {
			
			let shdSrc = param.shaderSrc;
			let depthWriteEnabled = param.depthWriteEnabled === false ? false : true;
			let pipelineDefParam = {
				depthWriteEnabled: depthWriteEnabled,
				faceCullMode: param.faceCullMode ? param.faceCullMode : "back",
				blendModes: param.blendModes ? param.blendModes : ["solid"]
			};
			const material = new WGMaterial({
				shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "ComputeEntity-material",
				shaderCodeSrc: shdSrc,
				pipelineDefParam
			});
			
			if(param.instanceCount !== undefined) {
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

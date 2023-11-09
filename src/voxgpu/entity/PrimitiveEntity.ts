import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
import { WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import Color4 from "../material/Color4";

import vertWGSL from "../material/shader/wgsl/primitive.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/primitive.frag.wgsl";
import texFragWGSL from "../material/shader/wgsl/primitiveTex.frag.wgsl";

import GeometryBase from "../geometry/primitive/GeometryBase";
import { WGGeometry } from "../geometry/WGGeometry";

class PrimitiveEntity extends Entity3D {
	private mColor = new Color4();
	protected albedoV: WGRUniformValue;
	protected armV: WGRUniformValue;
	constructor(param?: Entity3DParam) {
		super(param);
		this.createGeometry(param);
		this.createMaterial(param);
	}
	setAlbedo(c: ColorDataType): PrimitiveEntity {
		if (this.albedoV) {
			if (c) {
				this.mColor.setColor(c).toArray4(this.albedoV.data as Float32Array);
				this.albedoV.upate();
			}
		}
		return this;
	}
	setARM(ao: number, roughness: number, metallic: number): PrimitiveEntity {
		if (this.armV) {
			const vs = this.armV.data as Float32Array;
			vs[0] = ao;
			vs[1] = roughness;
			vs[2] = metallic;
		}
		return this;
	}
	protected getGeometryData(param: Entity3DParam): GeometryBase {
		return null;
	}
	private createGeometry(param: Entity3DParam): void {

		if (param && param.geometry) {
			this.geometry = param.geometry;
		} else {
			const geom = this.getGeometryData(param);
			if(geom) {
				this.geometry = new WGGeometry()
					.addAttribute({ position: geom.getVS() })
					.addAttribute({ uv: geom.getUVS() })
					.addAttribute({ normal: geom.getNVS() })
					.setIndices(geom.getIVS());
			}
		}
	}
	protected createMaterial(param: Entity3DParam): void {
		if (!param) param = {};
		if (param.materials) {
			this.materials = param.materials;
		} else {
			const texs = param.textures;
			const texTotal = texs ? texs.length : 0;
			if (!param.uniformValues) {
				this.albedoV = getUniformValueFromParam("albedo", param, new WGRUniformValue({ data: new Float32Array([0.5, 0.5, 0.5, 1]), shdVarName: 'albedo' }));
				this.armV = getUniformValueFromParam("arm", param, new WGRUniformValue({ data: new Float32Array([1, 0.1, 0.1, 1]), shdVarName: 'arm' }));
			}
			let shdSrc = param.shaderSrc
				? param.shaderSrc
				: {
					vertShaderSrc: { code: vertWGSL, uuid: "primitiveVertShdCode" },
					fragShaderSrc: {
						code: texTotal > 0 ? texFragWGSL : fragWGSL,
						uuid: texTotal > 0 ? "primitiveTexFragShdCode" : "primitiveFragShdCode"
					}
				};
			let depthWriteEnabled = param.depthWriteEnabled === false ? false : true;
			let pipelineDefParam = {
				depthWriteEnabled: depthWriteEnabled,
				faceCullMode: param.faceCullMode ? param.faceCullMode : "back",
				blendModes: param.blendModes ? param.blendModes : ["solid"]
			};
			const material = new WGMaterial({
				shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "PrimitiveEntity-material-tex" + texTotal,
				shaderCodeSrc: shdSrc,
				pipelineDefParam
			});
			material.addTextures(texs);
			if(param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues;
			if(!material.uniformValues) {
				material.uniformValues = [this.albedoV, this.armV];
				this.albedoV = material.uniformValues[0];
				this.armV = material.uniformValues[1];
			}
			this.materials = [material];
		}
		const rpasses = param.rpasses;
		if(rpasses) {
			const ms = this.materials;
			// 这里的实现需要优化, 因为一个material实际上可以加入到多个rpass中去
			let len = Math.min(rpasses.length, ms.length);
			for(let i = 0; i < len; ++i) {
				const rpass = ms[i].rpass;
				if(!rpass || !rpass.rpass.node) {
					ms[i].rpass = rpasses[i];
				}
			}
		}
	}
	destroy(): void {
		this.albedoV = null;
		this.armV = null;
		super.destroy();
	}
}
export { Entity3DParam, PrimitiveEntity };

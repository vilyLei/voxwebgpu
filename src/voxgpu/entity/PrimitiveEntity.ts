import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
import { checkMaterialRPasses, WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Color4 from "../material/Color4";

import vertWGSL from "../material/shader/wgsl/primitive.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/primitive.frag.wgsl";
import texFragWGSL from "../material/shader/wgsl/primitiveTex.frag.wgsl";

import GeometryBase from "../geometry/primitive/GeometryBase";
import { WGGeometry } from "../geometry/WGGeometry";
import Arms from "../material/Arms";
interface PrimitiveEntityParam extends Entity3DParam {
	albedo?: ColorDataType;
	arm?: ArmsDataType;
	arms?: ArmsDataType;
}
class PrimitiveEntity extends Entity3D {
	private mColor = new Color4();
	private mArms = new Arms();
	protected albedoV: WGRBufferData;
	protected armV: WGRBufferData;
	constructor(param?: PrimitiveEntityParam) {
		super(param);
		if (!param) param = {};
		if (!(param.building === false)) {
			this.createGeometry(param);
			this.createMaterial(param);
		}
		this.mDescParam = param;
	}
	clone(param?: PrimitiveEntityParam): PrimitiveEntity {
		if(param) {
			if(!param.geometry) param.geometry = this.geometry;
		}else {
			param = this.mDescParam;
			param.materials = this.materials;
			param.geometry = this.geometry;
		}
		let p = new PrimitiveEntity( param  );
		p.arm = this.arm;
		p.color = this.color;
		return p;
	}
	setColor(c: ColorDataType): PrimitiveEntity {
		return this.setAlbedo( c );
	}
	set color(c: ColorDataType) {
		this.setColor(c);
	}
	get color(): ColorDataType {
		return this.mColor;
	}
	setAlbedo(c: ColorDataType): PrimitiveEntity {
		// console.log("c: ", c);
		// console.log("this.albedoV: ", this.albedoV);
		if (this.albedoV) {
			if (c) {
				this.mColor.setColor(c).toArray4(this.albedoV.data as Float32Array);
				// console.log("this.mColor: ", this.mColor);
				this.albedoV.version++;
				// console.log("this.albedoV.data: ", this.albedoV.data);
			}
		}
		return this;
	}
	set albedo(c: ColorDataType) {
		this.setAlbedo( c );
	}
	get albedo(): ColorDataType {
		return this.mColor;
	}
	setARM(p: ArmsDataType): PrimitiveEntity {
		this.arm = p;
		return this;
	}
	set arm(p: ArmsDataType) {
		const t = this.mArms;
		t.setArms(p);
		if (this.armV) {
			t.toArray3(this.armV.data as Float32Array);
			this.armV.version++;
		}
	}
	get arm(): ArmsDataType {
		return this.mArms;
	}
	protected getGeometryData(param: PrimitiveEntityParam): GeometryBase {
		return null;
	}
	protected createGeometry(param: PrimitiveEntityParam): void {
		if (param && param.geometry) {
			this.geometry = param.geometry;
		} else {
			const geom = this.getGeometryData(param);
			if (geom) {
				const g = new WGGeometry()
					.addAttribute({ position: geom.getVS() })
					.addAttribute({ uv: geom.getUVS() })
					.addAttribute({ normal: geom.getNVS() })
					.setIndices(geom.getIVS());
				g.bounds = geom.bounds;
				g.drawMode = geom.drawMode;
				g.geometryData = geom;
				this.geometry = g;
			}
		}
	}
	protected createMaterial(param: PrimitiveEntityParam): void {
		if (!param) param = {};
		if (param.materials) {
			this.materials = param.materials;
		} else {
			const texs = param.textures;
			const texTotal = texs ? texs.length : 0;
			if (!param.uniformValues) {
				this.albedoV = getUniformValueFromParam(
					"albedo",
					param,
					new WGRUniformValue({ data: new Float32Array([0.5, 0.5, 0.5, 1]), shdVarName: "albedo" })
				);
				this.armV = getUniformValueFromParam(
					"arm",
					param,
					new WGRUniformValue({ data: new Float32Array([1, 0.1, 0.1, 1]), shdVarName: "arm" })
				);
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
			let b = param.depthWriteEnabled;
			b = b === false ? false : true;
			let f = param.faceCullMode;
			f = f ? f : "back";
			let bl = param.blendModes;
			bl = bl ? bl : ["solid"];

			let pipelineDefParam = {
				depthWriteEnabled: b,
				faceCullMode: f,
				blendModes: bl
			};
			const material = new WGMaterial({
				shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "PrimitiveEntity-material-tex" + texTotal,
				shaderSrc: shdSrc,
				pipelineDefParam
			});
			material.addTextures(texs);
			if (param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues;
			if (!material.uniformValues) {
				material.uniformValues = [this.albedoV, this.armV];
				this.albedoV = material.uniformValues[0];
				this.armV = material.uniformValues[1];
			}
			this.materials = [material];
		}
		const ms = this.materials;

		if(param.doubleFace !== undefined) {
			let flag = param.doubleFace === true;
			for(let i = 0; i < ms.length; ++i) {
				if(ms[i].doubleFace === undefined && flag) {
					ms[i].doubleFace = flag;
					ms[i].shadinguuid += '-dface';
				}
			}
		}
		if(param.wireframe !== undefined) {
			let flag = param.wireframe === true;
			for(let i = 0; i < ms.length; ++i) {
				if(ms[i].wireframe === undefined && flag) {
					ms[i].wireframe = flag;
					ms[i].shadinguuid += '-wframe';
				}
			}
		}
		// console.log("param: ", param);
		// console.log("param.albedo: ", param.albedo);
		if(param.albedo) {
			this.albedo = param.albedo;
		}
		if(param.arm) {
			this.arm = param.arm;
		}
		checkMaterialRPasses(this.materials, param.rpasses);
	}
	destroy(): void {
		this.albedoV = null;
		this.armV = null;
		super.destroy();
	}
}
export { PrimitiveEntityParam, PrimitiveEntity };

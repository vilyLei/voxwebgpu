import Arms from "../Arms";
import Color4 from "../Color4";

import MathConst from "../../math/MathConst";
import Vector3 from "../../math/Vector3";

import {
	MaterialUniformDataImpl,
	MaterialUniformData,
	MaterialUniformVec4Wrapper,
} from "./MaterialUniformData";
import { FogDataWrapper } from "./FogDataWrapper";
import { VSMUniformData } from "./VSMUniformData";
import { LightShaderDataParam, LightParamData, BaseLightData } from "./LightUniformData";
import { NumberArrayDataImpl } from "../../base/NumberArrayDataImpl";

class BasePBRArmsData implements MaterialUniformDataImpl {
	version = -1;
	storage: MaterialUniformData;
	arms = new Arms();
	base = new Arms();
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		this.storage = new MaterialUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';
		this.arms.fromArray4(data);
		this.base.fromArray4(data, 4);
	}
	update(): void {
		const data = this.storage.data;
		this.arms.toArray4(data as NumberArrayType);
		this.base.toArray4(data as NumberArrayType, 4);
		this.version++;
	}
}

class ArmsDataWrapper {
	property: Arms;
	private target: MaterialUniformDataImpl;
	constructor(property: Arms, target: MaterialUniformDataImpl) {
		this.property = property;
		this.target = target;
	}
	set ao(v: number) {
		this.property.a = v;
		this.update();
	}
	get ao(): number {
		return this.property.a;
	}
	set roughness(v: number) {
		this.property.r = v;
		this.update();
	}
	get roughness(): number {
		return this.property.r;
	}
	set metallic(v: number) {
		this.property.m = v;
		this.update();
	}
	get metallic(): number {
		return this.property.m;
	}

	set specular(v: number) {
		this.property.s = v;
		this.update();
	}
	get specular(): number {
		return this.property.s;
	}
	set value(v: ArmsDataType) {
		this.property.setArms(v);
		this.update();
	}
	get value(): ArmsDataType {
		return this.property;
	}
	update(): void {
		this.target.update();
	}
}


class PBRParamsVec4Data implements MaterialUniformDataImpl {
	version = -1;
	storage: MaterialUniformData;
	albedo = new Color4();
	fresnel = new Color4();
	toneParam = new Vector3();
	param = new Vector3();
	specularFactor = new Color4();
	arms = new Arms();
	armsBase = new Arms();
	ambient = new Color4();
	uvParam = new Vector3();
	private mls: NumberArrayDataImpl[];
	constructor(shdVarName: string, visibility?: string, data?: Float32Array) {
		if (!data) {
			
			/**
			 * albedo: [1, 1, 1, 1],
			 * fresnel: [0, 0, 0, 0],
			 * toneParam: [1, 0.1, 1, 1],
			 * param: [0, 0, 0.07, 1],
			 * specularFactor: [1,1,1, 1],
			 * arms: [1,1,1,1],
			 * armsBase: [0,0,0,0],
			 * ambient: [0.1,0.1,0.1,1],
			 * uvParam: [1,1,0,0],
			 */
			data = new Float32Array([
				1, 1, 1, 1,
				0, 0, 0, 0,
				1, 0.1, 1, 1,
				0, 0, 0.07, 1,
				1, 1, 1, 1,
		
				1, 1, 1, 0,	// arms
				0, 0, 0, 0, // armsBase
				0.1, 0.1, 0.1, 1, // ambient
				1, 1, 0, 0, // uvParam
			]);
		};
		this.storage = new MaterialUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';

		this.mls = [
			this.albedo,
			this.fresnel,
			this.toneParam,
			this.param,
			this.specularFactor,
			this.arms,
			this.armsBase,
			this.ambient,
			this.uvParam
		];

		let pos = 0;
		for(let i = 0; i < this.mls.length; ++i) {
			this.mls[i].fromArray4(data, pos);
			pos += 4;
		}
	}
	update(): void {
		const data = this.storage.data;
		let pos = 0;
		for(let i = 0; i < this.mls.length; ++i) {
			this.mls[i].toArray4(data as NumberArrayType, pos);
			pos += 4;
		}
		this.version++;
		this.storage.update();
	}
}

class ToneParamDataWrapper extends MaterialUniformVec4Wrapper {
	set toneExposure(v: number) {
		this.property.x = v;
		this.update();
	}
	get toneExposure(): number {
		return this.property.x;
	}
	set frontIntensity(v: number) {
		this.property.z = v;
		this.update();
	}
	get frontIntensity(): number {
		return this.property.z;
	}
	set sideIntensity(v: number) {
		this.property.w = v;
		this.update();
	}
	get sideIntensity(): number {
		return this.property.w;
	}
}
class PBRParamDataWrapper extends MaterialUniformVec4Wrapper {
	set scatterIntensity(v: number) {
		this.property.w = v;
		this.update();
	}
	get scatterIntensity(): number {
		return this.property.w;
	}
	/**
	 * (lod mipmap level) = base + (maxMipLevel - k * maxMipLevel)
	 * @param maxMipLevel envmap texture lod max mipmap level, the vaue is a int number
	 * @param base envmap texture lod max mipmap level base, value range: -7.0 -> 12.0
	 */
	setEnvMapLodMipMapLevel(maxMipLevel: number, base: number = 0.0): void {
		maxMipLevel = Math.min(Math.max(maxMipLevel, 0.0), 14.0);
		base = Math.min(Math.max(base, -7.0), 12.0);
		this.property.z = Math.round(maxMipLevel) * 0.01 + base;
		this.update();
	}
	setEnvMapLodMipMapLevelWithSize(envMapWidth: number, envMapHeight: number, base: number = 0.0): void {
		base = Math.min(Math.max(base, -7.0), 12.0);
		this.property.z = MathConst.GetMaxMipMapLevel(envMapWidth, envMapHeight) * 0.01 + base;
		this.update();
	}
}

export { FogDataWrapper, VSMUniformData, BaseLightData, ToneParamDataWrapper, PBRParamDataWrapper, ArmsDataWrapper, BasePBRArmsData, PBRParamsVec4Data, LightShaderDataParam, LightParamData };

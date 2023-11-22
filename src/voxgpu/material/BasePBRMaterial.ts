import Vector4 from "../math/Vector4";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Arms from "./Arms";
import Color4 from "./Color4";
import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";

import basePBRVertWGSL from "./shader/wgsl/pbr.vert.wgsl";
import basePBRFragWGSL from "./shader/wgsl/pbr.frag.wgsl";
import basePBRWholeWGSL from "./shader/wgsl/pbr.wgsl";
import basePBRWholeInitWGSL from "./shader/wgsl/pbrInit.wgsl";
import MathConst from "../math/MathConst";
import Vector3 from "../math/Vector3";
import { WGShaderConstructor } from "./shader/WGShaderConstructor";

const basePBRShaderSrc = {
	vert: { code: basePBRVertWGSL, uuid: "vertBasePBRShdCode" },
	frag: { code: basePBRFragWGSL, uuid: "fragBasePBRShdCode" }
};

// const basePBRShaderSrc = {
// 	// shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
// 	shaderSrc: { code: basePBRWholeWGSL, uuid: "wholeBasePBRShdCode" },
// 	// shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
// };
interface BasePBRUniformDataImpl extends WGRBufferData {
	update(): void;
}
class BasePBRUniformData implements BasePBRUniformDataImpl {
	stride = 4;
	data: NumberArrayDataType;
	shared = false;
	arraying = false;
	shdVarName: string;
	version = -1;
	layout = { visibility: "all" };
	shdVarFormat = 'vec4<f32>';
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		this.data = data as NumberArrayDataType;
		this.shdVarName = shdVarName;
		if (visibility) {
			this.layout.visibility = visibility;
		}
	}
	update(): void {
		this.version++;
	}
}
class BasePBRColor4Data extends BasePBRUniformData {
	property = new Color4();
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.property.fromArray4(this.data as NumberArrayType);
	}
	set value(v: ColorDataType) {
		this.property.setColor(v).toArray4(this.data as NumberArrayType);
		this.version++;
	}
	get value(): ColorDataType {
		return this.property;
	}
	update(): void {
		this.property.toArray4(this.data as NumberArrayType);
		this.version++;
	}
}
class BasePBRVec4Data extends BasePBRUniformData {
	property = new Vector4();
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.property.fromArray4(this.data as NumberArrayType);
	}
	set value(v: Vector3DataType) {
		this.property.setVector4(v).toArray4(this.data as NumberArrayType);
		this.version++;
	}
	get value(): Vector3DataType {
		return this.property;
	}
	update(): void {
		this.property.toArray4(this.data as NumberArrayType);
		this.version++;
	}
}

class BasePBRArmsData implements BasePBRUniformDataImpl {
	version = -1;
	storage: BasePBRUniformData;
	arms = new Arms();
	base = new Arms();
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		this.storage = new BasePBRUniformData(data, shdVarName, visibility);
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
	private target: BasePBRUniformDataImpl;
	constructor(property: Arms, target: BasePBRUniformDataImpl) {
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

/**
 * albedo: [1, 1, 1, 1],
 * fresnel: [0, 0, 0, 0],
 * toneParam: [1, 0.1, 1, 1],
 * param: [0, 0, 0.07, 1],
 * specularFactor: [1,1,1, 1],
 */
class PBRParamsVec4Data implements BasePBRUniformDataImpl {
	version = -1;
	storage: BasePBRUniformData;
	albedo = new Color4();
	fresnel = new Color4();
	toneParam = new Vector3();
	param = new Vector3();
	specularFactor = new Color4();
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		this.storage = new BasePBRUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';
		this.albedo.fromArray4(data);
		this.fresnel.fromArray4(data, 4);
		this.toneParam.fromArray4(data, 8);
		this.param.fromArray4(data, 12);
		this.specularFactor.fromArray4(data, 16);
	}
	update(): void {
		const data = this.storage.data;
		this.albedo.toArray4(data as NumberArrayType);
		this.fresnel.toArray4(data as NumberArrayType, 4);
		this.toneParam.toArray4(data as NumberArrayType, 8);
		this.param.toArray4(data as NumberArrayType, 12);
		this.specularFactor.toArray4(data as NumberArrayType, 16);
		this.version++;
	}
}

class Color4ShdDataWrapper {
	property: Color4;
	private target: BasePBRUniformDataImpl;
	constructor(property: Color4, target: BasePBRUniformDataImpl) {
		this.property = property;
		this.target = target;
	}
	set value(v: ColorDataType) {
		this.property.setColor(v);
		this.update();
	}
	get value(): ColorDataType {
		return this.property;
	}
	update(): void {
		this.target.update();
	}
}
class Vec4ShdDataWrapper {
	property: Vector3;
	private target: BasePBRUniformDataImpl;
	constructor(property: Vector3, target: BasePBRUniformDataImpl) {
		this.property = property;
		this.target = target;
	}
	set value(v: Vector3DataType) {
		this.property.setVector4(v);
		this.update();
	}
	get value(): Vector3DataType {
		return this.property;
	}
	update(): void {
		this.target.update();
	}
}
class ToneParamDataWrapper extends Vec4ShdDataWrapper {
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
class PBRParamDataWrapper extends Vec4ShdDataWrapper {
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

class BaseLightData implements WGRBufferData {
	version = -1;
	storage: BasePBRUniformData;
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		this.storage = new BasePBRUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';
	}
	set shared(b: boolean) {
		this.storage.shared = b;
	}
	get shared(): boolean {
		return this.storage.shared === true;
	}
	set data(d: Float32Array) {
		this.storage.data = d;
		this.update();
	}
	get data(): Float32Array {
		return this.storage.data as Float32Array;
	}
	update(): void {
		this.version++;
		if (this.storage && this.storage.update !== undefined) {
			this.storage.update();
		}
	}
}
type LightShaderDataParam = {
	lights?: Float32Array;
	colors?: Float32Array;
	pointLightsTotal?: number;
	directLightsTotal?: number;
	spotLightsTotal?: number;
};
class LightParamData extends BasePBRVec4Data {
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.shdVarFormat = 'vec4<u32>';
	}
	set param(param: LightShaderDataParam) {
		if (param) {
			if (param.pointLightsTotal !== undefined) {
				this.property.x = param.pointLightsTotal;
			}
			if (param.directLightsTotal !== undefined) {
				this.property.y = param.directLightsTotal;
			}
			if (param.spotLightsTotal !== undefined) {
				this.property.z = param.spotLightsTotal;
			}
			this.update();
		}
	}
	set pointLightsTotal(n: number) {
		this.property.x = n;
		this.update();
	}
	set directLightsTotal(n: number) {
		this.property.y = n;
		this.update();
	}
	set spotLightsTotal(n: number) {
		this.property.z = n;
		this.update();
	}
}
class BasePBRProperty {
	ambient = new BasePBRColor4Data(new Float32Array([0.1, 0.1, 0.1, 1]), "ambient", "frag");
	/**
	 * default values, arms: [1, 1, 1, 0], armsBase: [0, 0, 0, 0]
	 */
	private armsParams = new BasePBRArmsData(new Float32Array([1, 1, 1, 0, 0, 0, 0, 0]), "armsParams", "frag");
	uvParam = new BasePBRVec4Data(new Float32Array([1, 1, 0, 0]), "uvParam", "frag");
	/**
	 * albedo: [1, 1, 1, 1],
	 * fresnel: [0, 0, 0, 0],
	 * toneParam: [1, 0.1, 1, 1],
	 * param: [0, 0, 0.07, 1],
	 * specularFactor: [1,1,1, 1],
	 */
	private params = new PBRParamsVec4Data(new Float32Array([1, 1, 1, 1, 0, 0, 0, 0, 1, 0.1, 1, 1, 0, 0, 0.07, 1, 1, 1, 1, 1]), "params", "frag");

	lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
	lights = new BaseLightData(new Float32Array([0.0, 200.0, 0, 0.0001]), "lights", "frag");
	lightColors = new BaseLightData(new Float32Array([5.0, 5.0, 5.0, 0.0001]), "lightColors", "frag");

	albedo: Color4ShdDataWrapper;
	fresnel: Color4ShdDataWrapper;
	toneParam: ToneParamDataWrapper;
	param: PBRParamDataWrapper;
	specularFactor: Color4ShdDataWrapper;

	arms: ArmsDataWrapper;
	armsBase: ArmsDataWrapper;

	glossiness = true;
	toneMapping = true;
	metallicCorrection = true;
	constructor() {
		let armsSrc = this.armsParams;
		this.arms = new ArmsDataWrapper(armsSrc.arms, armsSrc);
		this.armsBase = new ArmsDataWrapper(armsSrc.base, armsSrc);
		let params = this.params;
		this.albedo = new Color4ShdDataWrapper(params.albedo, params);
		this.fresnel = new Color4ShdDataWrapper(params.fresnel, params);
		this.toneParam = new ToneParamDataWrapper(params.toneParam, params);
		this.param = new PBRParamDataWrapper(params.toneParam, params);
		this.specularFactor = new Color4ShdDataWrapper(params.specularFactor, params);
	}
	get uniformValues(): WGRBufferData[] {
		return [this.ambient, this.armsParams, this.uvParam, this.params, this.lightParam, this.lights, this.lightColors];
	}
	setLightParam(param: LightShaderDataParam): void {
		if (param) {
			if (param.lights) {
				this.lights.data = param.lights;
			}
			if (param.colors) {
				this.lightColors.data = param.colors;
			}
			this.lightParam.param = param;
		}
	}
	setLightData(lightsData: Float32Array, lightColorsData: Float32Array): void {
		this.lights.data = lightsData;
		this.lightColors.data = lightColorsData;
	}
}
const preDefCode = `
#define USE_GLOSSINESS 1
#define USE_TONE_MAPPING
#define USE_METALLIC_CORRECTION
`;
class BasePBRMaterial extends WGMaterial {
	private mShdBuilder = new WGShaderConstructor();
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setLightParam(param: LightShaderDataParam): BasePBRMaterial {
		this.property.setLightParam( param );
		return this;
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (!descriptor || descriptor.shaderSrc === undefined) {
			if (!descriptor) descriptor = { shadinguuid: "BasePBRMaterial" };
			// descriptor.shaderSrc = basePBRShaderSrc;
			// descriptor.shaderSrc = {
			// 	shaderSrc: { code: "", uuid: "wholeBasePBRShdCode-test01" }
			// }
		}
		super.setDescriptor(descriptor);
	}
	get uniformValues(): WGRBufferData[] {
		if (!this.mUniformValues) {
			this.mUniformValues = this.property.uniformValues;
		}
		return this.mUniformValues;
	}
	
	__$build(): void {
		let preCode = preDefCode;
		preCode = '';
		let ts = this.textures;
		let ppt = this.property;
		if(ppt.glossiness) {
			preCode += '#define USE_GLOSSINESS 1\n';
		}
		if(ppt.toneMapping) {
			preCode += '#define USE_TONE_MAPPING\n';
		}
		if(ppt.metallicCorrection) {
			preCode += '#define USE_METALLIC_CORRECTION\n';
		}
		if(ts) {
			for(let i = 0; i < ts.length; ++i) {
				console.log('ts[i].texture.shdVarName: ', ts[i].texture.shdVarName);
				switch(ts[i].texture.shdVarName) {
					case 'normal':
						preCode += '#define USE_NORMAL_MAP\n';
						break;
					case 'albedo':
						preCode += '#define USE_ALBEDO\n';
						break;
					case 'ao':
						preCode += '#define USE_AO\n';
						break;
					case 'roughness':
						preCode += '#define USE_ROUGHNESS\n';
						break;
					case 'metallic':
						preCode += '#define USE_METALLIC\n';
						break;
					case 'specularEnv':
						preCode += '#define USE_SPECULAR_ENV\n';
						break;
					default:
						break;
				}
			}
		}

		console.log('BasePBRMaterial::__$build() preCode: \n',preCode);
		// console.log('BasePBRMaterial::__$build() ...');
		let shaderCode = this.mShdBuilder.build(preCode);
		let shaderSrc = {
			shaderSrc: { code: shaderCode, uuid: "wholeBasePBRShdCode-ins01" }
		}
		this.shaderSrc = shaderSrc;
		// this.shaderSrc = basePBRShaderSrc;
	}
}
export { LightShaderDataParam, BasePBRMaterial };

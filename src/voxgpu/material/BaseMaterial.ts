
import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";

import { WGShaderConstructor } from "./shader/WGShaderConstructor";

import {
	MaterialUniformMat44Data,
	MaterialUniformVec4Wrapper,
	MaterialUniformColor4Wrapper,
	WGRBufferData
} from "./mdata/MaterialUniformData";

import {
	BasePBRArmsData,
	LightParamData,
	ArmsDataWrapper,
	PBRParamsVec4Data,
	ToneParamDataWrapper,
	PBRParamDataWrapper,
	FogDataWrapper,
	LightShaderDataParam,
	VSMUniformData,
	BaseLightData

} from "./mdata/PBRParamsData";

class BasePBRProperty {
	// ambient = new MaterialUniformColor4Data(new Float32Array([0.1, 0.1, 0.1, 1]), "ambient", "frag");
	/**
	 * default values, arms: [1, 1, 1, 0], armsBase: [0, 0, 0, 0]
	 */
	private armsParams = new BasePBRArmsData(new Float32Array([1, 1, 1, 0, 0, 0, 0, 0]), "armsParams", "frag");
	// uvParam = new MaterialUniformVec4Data(new Float32Array([1, 1, 0, 0]), "uvParam", "frag");
	/**
	 * albedo: [1, 1, 1, 1],
	 * fresnel: [0, 0, 0, 0],
	 * toneParam: [1, 0.1, 1, 1],
	 * param: [0, 0, 0.07, 1],
	 * specularFactor: [1,1,1, 1],
	 * fogParam: [100, 1000, 0, 0.0005],
	 * fogColor: [1.0, 1.0, 1.0, 1.0],
	 */
	private params = new PBRParamsVec4Data(new Float32Array([
		1, 1, 1, 1,
		0, 0, 0, 0,
		1, 0.1, 1, 1,
		0, 0, 0.07, 1,
		1, 1, 1, 1,

		600, 3500, 0, 0.0005,	// fogParam
		1.0, 1.0, 1.0, 1.0,	// fogColor
		0.1, 0.1, 0.1, 1, // ambient
		1, 1, 0, 0, // uvParam
	]), "params", "frag");
	// vsmParams = new MaterialUniformVec4ArrayData(new Float32Array([
	vsmParams = new VSMUniformData(null, "vsmParams", "frag");
	shadowMatrix = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");

	lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
	lights = new BaseLightData(new Float32Array([0.0, 200.0, 0, 0.0001]), "lights", "frag");
	lightColors = new BaseLightData(new Float32Array([5.0, 5.0, 5.0, 0.0001]), "lightColors", "frag");

	albedo: MaterialUniformColor4Wrapper;
	fresnel: MaterialUniformColor4Wrapper;
	toneParam: ToneParamDataWrapper;
	param: PBRParamDataWrapper;
	specularFactor: MaterialUniformColor4Wrapper;
	fogParam: FogDataWrapper;
	fogColor: MaterialUniformColor4Wrapper;
	ambient: MaterialUniformColor4Wrapper;
	uvParam: MaterialUniformVec4Wrapper;

	arms: ArmsDataWrapper;
	armsBase: ArmsDataWrapper;

	glossiness = true;
	toneMapping = true;
	metallicCorrection = true;
	inverseMask = false;
	fogEnabled = false;
	fogExp2Enabled = false;
	shadowReceived = false;
	constructor() {
		let armsSrc = this.armsParams;
		this.arms = new ArmsDataWrapper(armsSrc.arms, armsSrc);
		this.armsBase = new ArmsDataWrapper(armsSrc.base, armsSrc);
		let params = this.params;
		this.albedo = new MaterialUniformColor4Wrapper(params.albedo, params);
		this.fresnel = new MaterialUniformColor4Wrapper(params.fresnel, params);
		this.toneParam = new ToneParamDataWrapper(params.toneParam, params);
		this.param = new PBRParamDataWrapper(params.toneParam, params);
		this.specularFactor = new MaterialUniformColor4Wrapper(params.specularFactor, params);
		this.fogParam = new FogDataWrapper(params.fogParam, params);
		this.fogColor = new MaterialUniformColor4Wrapper(params.fogColor, params);
		this.ambient = new MaterialUniformColor4Wrapper(params.ambient, params);
		this.uvParam = new MaterialUniformVec4Wrapper(params.uvParam, params);
	}
	get uniformValues(): WGRBufferData[] {
		if (this.shadowReceived) {
			return [this.vsmParams, this.shadowMatrix, this.armsParams, this.params, this.lightParam, this.lights, this.lightColors];
		}
		return [this.armsParams, this.params, this.lightParam, this.lights, this.lightColors];
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
	getLightParam(): LightShaderDataParam {
		return this.lightParam.param;
	}
}
class BaseMaterial extends WGMaterial {
	private mShdBuilder = new WGShaderConstructor();
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setLightParam(param: LightShaderDataParam): BaseMaterial {
		this.property.setLightParam(param);
		return this;
	}
	getLightParam(): LightShaderDataParam {
		return this.property.getLightParam();
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (!descriptor || descriptor.shaderSrc === undefined) {
			if (!descriptor) descriptor = { shadinguuid: "BaseMaterial" };
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
		let preCode = '';
		let ts = this.textures;
		let ppt = this.property;
		if (ppt.glossiness) {
			preCode += '#define USE_GLOSSINESS 1\n';
		}
		if (ppt.toneMapping) {
			preCode += '#define USE_TONE_MAPPING\n';
		}
		if (ppt.metallicCorrection) {
			preCode += '#define USE_METALLIC_CORRECTION\n';
		}
		if (ppt.inverseMask) {
			preCode += '#define USE_INVERSE_MASK\n';
		}
		if (ppt.fogExp2Enabled) {
			ppt.fogEnabled = true;
			preCode += '#define USE_FOG_EXP2\n';
		}
		if (ppt.fogEnabled) {
			preCode += '#define USE_FOG\n';
		}
		if (ppt.shadowReceived) {
			preCode += '#define USE_VSM_SHADOW\n';
		}
		if (ts) {
			for (let i = 0; i < ts.length; ++i) {
				console.log('ts[i].texture.shdVarName: ', ts[i].texture.shdVarName);
				switch (ts[i].texture.shdVarName) {
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
					case 'arm':
						preCode += '#define USE_ARM_MAP\n';
						break;
					case 'emissive':
						preCode += '#define USE_EMISSIVE_MAP\n';
						break;
					case 'opacity':
						preCode += '#define USE_OPACITY_MAP\n';
						break;
					default:
						break;
				}
			}
		}

		console.log('BaseMaterial::__$build() preCode: \n', preCode);
		// console.log('BaseMaterial::__$build() ...');
		let uuid = preCode + "-ins01";
		let pdp = this.pipelineDefParam;
		if (pdp) {
			uuid += pdp.faceCullMode + pdp.blendModes;
			// console.log("pdp.faceCullMode: ", pdp.faceCullMode);
		}
		let shaderCode = this.mShdBuilder.build(preCode);
		let shaderSrc = {
			shaderSrc: { code: shaderCode, uuid }
		}
		this.shadinguuid = uuid + '-material';
		this.shaderSrc = shaderSrc;
		// this.shaderSrc = basePBRShaderSrc;
	}
}
export { LightShaderDataParam, BaseMaterial };

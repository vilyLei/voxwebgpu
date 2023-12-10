
import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";
import { WGShaderConstructor } from "./shader/WGShaderConstructor";

import {
	MaterialUniformVec4Wrapper,
	MaterialUniformColor4Wrapper,
	WGRBufferData
} from "./mdata/MaterialUniformData";

import {
	ArmsDataWrapper,
	PBRParamsVec4Data,
	ToneParamDataWrapper,
	PBRParamDataWrapper,
	FogDataWrapper

} from "./mdata/PBRParamsData";
import { MaterialProperty } from "./pipeline/MaterialProperty";

class BasePBRProperty implements MaterialProperty {
	// /**
	//  * default values, fogParam: [600, 3500, 0, 0.0005], fogColor: [1, 1, 1, 1]
	//  */
	// private fogParams = new FogUniformData(new Float32Array([600, 3500, 0, 0.0005, 1, 1, 1, 1]), "fogParams", "frag");
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
	private mPBRParams = new PBRParamsVec4Data(new Float32Array([
		1, 1, 1, 1,
		0, 0, 0, 0,
		1, 0.1, 1, 1,
		0, 0, 0.07, 1,
		1, 1, 1, 1,

		// 600, 3500, 0, 0.0005,	// fogParam
		// 1.0, 1.0, 1.0, 1.0,	// fogColor
		1, 1, 1, 0,	// arms
		0, 0, 0, 0, // armsBase
		0.1, 0.1, 0.1, 1, // ambient
		1, 1, 0, 0, // uvParam
	]), "pbrParams", "frag");

	// vsmParams = new VSMUniformData(null, "vsmParams", "frag");
	// shadowMatrix = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");

	// lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
	// lights = new BaseLightData(new Float32Array([0.0, 200.0, 0, 0.0001]), "lights", "frag");
	// lightColors = new BaseLightData(new Float32Array([5.0, 5.0, 5.0, 0.0001]), "lightColors", "frag");

	albedo: MaterialUniformColor4Wrapper;
	fresnel: MaterialUniformColor4Wrapper;
	toneParam: ToneParamDataWrapper;
	param: PBRParamDataWrapper;
	specularFactor: MaterialUniformColor4Wrapper;
	ambient: MaterialUniformColor4Wrapper;
	uvParam: MaterialUniformVec4Wrapper;

	arms: ArmsDataWrapper;
	armsBase: ArmsDataWrapper;

	glossiness = true;
	toneMapping = true;
	metallicCorrection = true;

	inverseMask = false;

	fogging = false;
	private mExp2Fogging = false;

	/**
	 * make shadow or not
	 */
	shadow = true;
	shadowReceived = false;
	/**
	 * lighting enabled or not
	 */
	lighting = true;
	
	set exp2Fogging(enabled: boolean) {
		this.mExp2Fogging = enabled;
		if(enabled) this.fogging = enabled;
	}
	get exp2Fogging(): boolean {
		return this.mExp2Fogging;
	}
	constructor() {

		
		// let fogSrc = this.fogParams;
		// this.fogParam = new FogDataWrapper(fogSrc.fogParam, fogSrc);
		// this.fogColor = new MaterialUniformColor4Wrapper(fogSrc.fogColor, fogSrc);

		let params = this.mPBRParams;
		this.albedo = new MaterialUniformColor4Wrapper(params.albedo, params);
		this.fresnel = new MaterialUniformColor4Wrapper(params.fresnel, params);
		this.toneParam = new ToneParamDataWrapper(params.toneParam, params);
		this.param = new PBRParamDataWrapper(params.toneParam, params);
		this.specularFactor = new MaterialUniformColor4Wrapper(params.specularFactor, params);
		this.ambient = new MaterialUniformColor4Wrapper(params.ambient, params);
		this.uvParam = new MaterialUniformVec4Wrapper(params.uvParam, params);

		this.arms = new ArmsDataWrapper(params.arms, params);
		this.armsBase = new ArmsDataWrapper(params.armsBase, params);
	}

	get uniformValues(): WGRBufferData[] {

		let vs = [this.mPBRParams] as WGRBufferData[];
		return vs;
	}
}
class BaseMaterial extends WGMaterial {
	private mShdBuilder = new WGShaderConstructor();
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		// if (!descriptor || descriptor.shaderSrc === undefined) {
		// 	if (!descriptor) descriptor = { shadinguuid: "BaseMaterial" };
		// }
		super.setDescriptor(descriptor);
		if (!this.pipeline) {
			this.pipeline = { uid: 0 };
		}
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
		if (ppt.exp2Fogging) {
			ppt.fogging = true;
			preCode += '#define USE_FOG_EXP2\n';
		}
		if (ppt.fogging) {
			preCode += '#define USE_FOG\n';
		}
		if (ppt.shadowReceived) {
			preCode += '#define USE_VSM_SHADOW\n';
		}
		if (ppt.lighting) {
			preCode += '#define USE_LIGHT\n';
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
export { BaseMaterial };

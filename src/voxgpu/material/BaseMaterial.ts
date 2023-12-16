
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
	PBRParamDataWrapper

} from "./mdata/PBRParamsData";
import { MaterialProperty } from "./pipeline/MaterialProperty";

class BasePBRProperty implements MaterialProperty {

	private mPBRParams = new PBRParamsVec4Data();

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
	
    getUniqueKey(): string {
		let ppt = this;
		let uk = '';
		if (ppt.glossiness) {
			uk += '-GLOSSINESS';
		}
		if (ppt.toneMapping) {
			uk += '-TONE_MAPPING';
		}
		if (ppt.metallicCorrection) {
			uk += '-METALLIC_CORRECTION';
		}
		if (ppt.inverseMask) {
			uk += '-INVERSE_MASK';
		}
		if (ppt.exp2Fogging) {
			uk += '-FOG_EXP2';
		}
		return uk;
	}
	getPreDef(): string {
		let ppt = this;
		let preCode = '';
		if (ppt.glossiness) {
			preCode += '#define USE_GLOSSINESS\n';
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
			preCode += '#define USE_FOG_EXP2\n';
		}
		return preCode;
	}
}
class BaseMaterial extends WGMaterial {
	private mShdBuilder = new WGShaderConstructor();
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if(!descriptor) {
			descriptor = {};
		}
		if(descriptor.shadinguuid === undefined) {
			descriptor.shadinguuid = "base-material";
		}
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

	__$build(preCode?: string, uniqueKey?: string): void {

		// console.log('BaseMaterial::__$build() preCode: \n', preCode);
		// console.log('BaseMaterial::__$build() ...');
		let uuid = "base-material";
		let shaderCode = this.mShdBuilder.build(preCode);
		let shaderSrc = {
			shaderSrc: { code: shaderCode, uuid }
		}
		this.shaderSrc = shaderSrc;
	}
}
export { BaseMaterial };

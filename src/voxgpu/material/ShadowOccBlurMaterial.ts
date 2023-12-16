import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";
import { ShadowOccBlurShdCtor } from "./shader/ShadowOccBlurShdCtor";
import {
	MaterialUniformVec4Data,
	WGRBufferData
} from "./mdata/MaterialUniformData";
import { MaterialProperty } from "./pipeline/MaterialProperty";

class BasePBRProperty implements MaterialProperty {
	param = new MaterialUniformVec4Data(new Float32Array([1,1,1, 2]), "param", "frag");
	viewParam = new MaterialUniformVec4Data(new Float32Array([0, 0, 512, 512]), "viewParam", "frag");

	uuid = "property";
	private mType = 1;
	toVerticalBlur(): BasePBRProperty {
		this.mType = 1;
		return this;
	}
	toHorizonalBlur(): BasePBRProperty {
		this.mType = 0;
		return this;
	}
	isHorizonalBlur(): boolean {
		return this.mType == 0;
	}
	setShadowRadius(r: number): BasePBRProperty {
		let vs = this.param.data as Float32Array;
		vs[3] = r;
		this.param.update();
		return this;
	}
	setViewSize(pw: number, ph: number): BasePBRProperty {
		let vs = this.viewParam.data as Float32Array;
		vs[2] = pw;
		vs[3] = ph;
		this.viewParam.update();
		return this;
	}
	constructor() {
	}
	get uniformValues(): WGRBufferData[] {
		return [this.param, this.viewParam];
	}
}
class ShadowOccBlurMaterial extends WGMaterial {
	private mShdBuilder = new ShadowOccBlurShdCtor();
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		// if (!descriptor || descriptor.shaderSrc === undefined) {
		// 	if (!descriptor) descriptor = { shadinguuid: "ShadowOccBlurMaterial" };
		// }
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
		// let ts = this.textures;
		let ppt = this.property;
		let uuid = "ShadowOccBlur";
		if (ppt.isHorizonalBlur()) {
			preCode += '#define USE_HORIZONAL_PASS\n';
			uuid += '-H_PASS';
		}

		// console.log('ShadowOccBlurMaterial::__$build() preCode: \n', preCode);;
		let shaderCode = this.mShdBuilder.build(preCode);
		let shaderSrc = {
			shaderSrc: { code: shaderCode, uuid }
		}
		this.shadinguuid = uuid + '-material';
		this.shaderSrc = shaderSrc;
	}
}
export { ShadowOccBlurMaterial };

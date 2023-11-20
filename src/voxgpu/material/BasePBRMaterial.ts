import Vector4 from "../math/Vector4";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Arms from "./Arms";
import Color4 from "./Color4";
import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";

import basePBRVertWGSL from "./shader/wgsl/pbr.vert.wgsl";
import basePBRFragWGSL from "./shader/wgsl/pbr.frag.wgsl";

const basePBRShaderSrc = {
	vert: { code: basePBRVertWGSL, uuid: "vertBasePBRShdCode" },
	frag: { code: basePBRFragWGSL, uuid: "fragBasePBRShdCode" }
};

class BasePBRUniformData implements WGRBufferData {
	data: Float32Array;
	shdVarName: string;
	version = -1;
	constructor(data: Float32Array, shdVarName: string) {
		this.data = data;
		this.shdVarName = shdVarName;
	}
	update(): void {
		this.version++;
	}
}
class BasePBRColor4Data extends BasePBRUniformData {
	property = new Color4();
	constructor(data: Float32Array, shdVarName: string) {
		super(data, shdVarName);
		this.property.fromArray4(this.data);
	}
	set value(v: ColorDataType) {
		this.property.setColor(v).toArray4(this.data);
		this.version++;
	}
	get value(): ColorDataType {
		return this.property;
	}
	update(): void {
		this.property.toArray4(this.data);
		this.version++;
	}
}
class BasePBRVec4Data extends BasePBRUniformData {
	property = new Vector4();
	constructor(data: Float32Array, shdVarName: string) {
		super(data, shdVarName);
		this.property.fromArray4(this.data);
	}
	set value(v: Vector3DataType) {
		this.property.setVector3(v).toArray4(this.data);
		this.version++;
	}
	get value(): Vector3DataType {
		return this.property;
	}
	update(): void {
		this.property.toArray4(this.data);
		this.version++;
	}
}

class BasePBRArmsData extends BasePBRUniformData {
	property = new Arms();
	constructor(data: Float32Array, shdVarName: string) {
		super(data, shdVarName);
		this.property.fromArray4(this.data);
	}
	set value(v: ArmsDataType) {
		this.property.setArms(v).toArray4(this.data);
		this.version++;
	}
	get value(): ArmsDataType {
		return this.property;
	}
	update(): void {
		this.property.toArray4(this.data);
		this.version++;
	}
}

class ToneVec4Data extends BasePBRVec4Data {
	set tone(v: number) {
		this.property.x = v;
		this.update();
	}
	get tone(): number {
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

/*
let uniformValues = [
	{ data: new Float32Array([0.9, 1.0, 0.1, 1]), shdVarName: "ambient" },
	{ data: new Float32Array([1, 1.0, 1, 1]), shdVarName: "albedo" },
	{ data: new Float32Array([1, 0.7, 1, 0]), shdVarName: "arms" },
	{ data: new Float32Array([0, 0.0, 0, 0]), shdVarName: "armsBase" },
	{ data: new Float32Array([0.0, 0.0, 0.0, 1]), shdVarName: "fresnel" },
	{ data: new Float32Array([1.0, 0.1, 1, 1]), shdVarName: "toneParam" },
	{ data: new Float32Array([2.0, 2.0, 0, 0]), shdVarName: "uvParam" },
	{ data: new Float32Array([0.0, 0.0, 0, 1.0]), shdVarName: "param" }, // w(scatterIntensity)
	lightData.lights,
	lightData.lightColors
];
let lights = { storage: { data: new Float32Array([0.0, 200.0, 0, 0.0001]), shdVarName: "lights" } };
		let lightColors = { storage: { data: new Float32Array([5.0, 5.0, 5.0, 0.0001]), shdVarName: "lightColors" } };
*/

class BaseLightData implements WGRBufferData {
	version = -1;
	storage: BasePBRUniformData;
	constructor(data: Float32Array, shdVarName: string) {
		this.storage = new BasePBRUniformData(data, shdVarName);
	}
	set data(d: Float32Array) {
		this.storage.data = d;
		this.update();
	}
	get data(): Float32Array {
		return this.storage.data;
	}
	update(): void {
		this.version++;
		if (this.storage && this.storage.update !== undefined) {
			this.storage.update();
		}
	}
}
class BasePBRProperty {
	ambient = new BasePBRColor4Data(new Float32Array([0.1, 0.1, 0.1, 1]), "ambient");
	albedo = new BasePBRColor4Data(new Float32Array([1, 1, 1, 1]), "albedo");
	arms = new BasePBRArmsData(new Float32Array([1, 1, 1, 0]), "arms");
	armsBase = new BasePBRArmsData(new Float32Array([0, 0, 0, 0]), "armsBase");
	fresnel = new BasePBRVec4Data(new Float32Array([0, 0, 0, 0]), "fresnel");
	toneParam = new ToneVec4Data(new Float32Array([1.0, 0.1, 1, 1]), "toneParam");
	uvParam = new BasePBRVec4Data(new Float32Array([1, 1, 0, 0]), "uvParam");
	param = new BasePBRVec4Data(new Float32Array([1, 1, 0, 0]), "param");
	lights = new BaseLightData(null, "lights");
	lightColors = new BaseLightData(null, "lightColors");

	get uniformValues(): WGRBufferData[] {
		return [
			this.ambient,
			this.albedo,
			this.arms,
			this.armsBase,
			this.fresnel,
			this.toneParam,
			this.uvParam,
			this.param,
			this.lights,
			this.lightColors
		];
	}
	setLightData(lightsData: Float32Array, lightColorsData: Float32Array): void {
		this.lights.data = lightsData;
		this.lightColors.data = lightColorsData;
	}
}
class BasePBRMaterial extends WGMaterial {
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (!descriptor || descriptor.shaderSrc === undefined) {
			if (!descriptor) descriptor = { shadinguuid: "BasePBRMaterial" };
			descriptor.shaderSrc = basePBRShaderSrc;
		}
		super.setDescriptor(descriptor);
	}
	get uniformValues(): WGRBufferData[] {
		if (!this.mUniformValues) {
			this.mUniformValues = this.property.uniformValues;
		}
		return this.mUniformValues;
	}
}
export { BasePBRMaterial };

import Vector4 from "../../math/Vector4";
import { WGRBufferData } from "../../render/buffer/WGRBufferData";
import Color4 from "../Color4";
import Vector3 from "../../math/Vector3";
import IMatrix4 from "../../math/IMatrix4";

interface MaterialUniformDataImpl extends WGRBufferData {
	update(): void;
}
class MaterialUniformData implements MaterialUniformDataImpl {
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
class MaterialUniformColor4Data extends MaterialUniformData {
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
class MaterialUniformVec4Data extends MaterialUniformData {
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

class MaterialUniformMat44Data extends MaterialUniformData {
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.shdVarFormat = 'mat4x4<f32>';
		this.stride = 16;
		this.shared = true;
	}
	set value(v: Float32Array) {
		this.data = v;
		this.version++;
	}
	get value(): Float32Array {
		return this.data as Float32Array;
	}

	set shadowMatrix(mat4: IMatrix4) {
		this.data = mat4.getLocalFS32();
		this.update();
	}
	update(): void {
		this.version++;
	}
}

class MaterialUniformVec4ArrayData implements MaterialUniformDataImpl {
	version = -1;
	storage: MaterialUniformData;
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {

		this.storage = new MaterialUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';
	}
	set shared(b: boolean) {
		this.storage.shared = b;
	}
	get shared(): boolean {
		return this.storage.shared === true;
	}
	set data(ds: NumberArrayDataType) {
		this.storage.data = ds;
	}
	get data(): NumberArrayDataType {
		return this.storage.data;
	}
	update(): void {
		// const data = this.storage.data;
		this.version++;
		this.storage.update();
	}
}


class MaterialUniformVec4Wrapper {
	property: Vector3;
	private target: MaterialUniformDataImpl;
	constructor(property: Vector3, target: MaterialUniformDataImpl) {
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

class MaterialUniformColor4Wrapper {
	property: Color4;
	private target: MaterialUniformDataImpl;
	constructor(property: Color4, target: MaterialUniformDataImpl) {
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

export {
	MaterialUniformDataImpl,
	MaterialUniformData,
	MaterialUniformColor4Data,
	MaterialUniformVec4Data,
	MaterialUniformMat44Data,
	MaterialUniformVec4ArrayData,
	MaterialUniformVec4Wrapper,
	MaterialUniformColor4Wrapper,
	WGRBufferData
};

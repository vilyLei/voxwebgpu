import Vector4 from "../math/Vector4";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Color4 from "./Color4";
import Vector3 from "../math/Vector3";

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
	MaterialUniformVec4Wrapper,
	MaterialUniformColor4Wrapper,
	WGRBufferData
};

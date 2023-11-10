import { WGRUniformValueParam, WGRUniformValue } from "../uniform/WGRUniformValue";

class WGRStorageValue extends WGRUniformValue {

	constructor(param: WGRUniformValueParam) {
		super(param);
		this.toStorage();
		this.visibility.toBufferForReadOnlyStorage();
	}
	clone(data: NumberArrayDataType): WGRStorageValue {

		// const u = new WGRUniformValue({data: data, index: this.index});
		const u = new WGRUniformValue({data: data});
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;

		return u;
	}
}
export { WGRStorageValue }

import { WGRUniformValue } from "./WGRUniformValue";

class WGRStorageValue extends WGRUniformValue {
	
	constructor(data: NumberArrayDataType, bufferIndex = 0, uniformIndexInRUnit = 0) {
		super(data, bufferIndex, uniformIndexInRUnit);
		this.toStorage();
	}
	toStorage(): void {
		this.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
	}
	upate(): void {
		this.version ++;
	}
	clone(data: NumberArrayDataType): WGRStorageValue {

		const u = new WGRStorageValue(data, this.bufferIndex, this.index);
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;

		return u;
	}
}
export { WGRStorageValue }

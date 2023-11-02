import BitConst from "../../utils/BitConst";
class WGRUniformValue {

	private static sUid = 0;
	private mUid = WGRUniformValue.sUid++;

	name?: string;
	/**
	 * Uniform index of RUnit instance uniforms array
	 */
	index = 0;

	version = -1;
	bufferIndex: number;
	data?: NumberArrayDataType;

	byteOffset = 0;
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
	shared = false;

	shdVarName?: string;
	constructor(data: NumberArrayDataType, bufferIndex = 0, uniformIndexInRUnit = 0) {
		this.data = data;
		this.bufferIndex = bufferIndex;
		this.index = uniformIndexInRUnit;
		if (data.byteLength <= 64) this.arrayStride = data.byteLength;
		this.upate();
	}
	getUid(): number {
		return this.mUid;
	}
	toShared(): WGRUniformValue {
		this.shared = true;
		return this;
	}
	toUniform(): void {
		this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
	}
	toStorage(): void {
		this.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
	}
	isUniform(): boolean {
		return BitConst.containsBit(this.usage, GPUBufferUsage.UNIFORM);
	}
	isStorage(): boolean {
		return BitConst.containsBit(this.usage, GPUBufferUsage.STORAGE);
	}
	upate(): void {
		this.version++;
	}

	clone(data: NumberArrayDataType): WGRUniformValue {

		const u = new WGRUniformValue(data, this.bufferIndex, this.index);
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;

		return u;
	}
}
export { WGRUniformValue }

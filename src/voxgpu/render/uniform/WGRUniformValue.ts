import BitConst from "../../utils/BitConst";
import { WGRShaderVisibility } from "./WGRShaderVisibility";
interface WGRUniformValueParam {
	data: NumberArrayDataType;
	bufferIndex?: number;
	/**
	 * uniform index in RUnit instance
	 */
	index?: number;
	usage?: number;
	shared?: boolean;
	shdVarName?: string;
	arrayStride?: number;
	/**
	 * data element stride
	 */
	stride?: number;
}
class WGRUniformValue {
	private static sUid = 0;
	private mUid = WGRUniformValue.sUid++;

	name?: string;
	/**
	 * Uniform index of RUnit instance uniforms array
	 */
	index = 0;

	version = -1;
	bufferIndex = 0;
	data: NumberArrayDataType;

	byteOffset = 0;
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
	shared = false;

	shdVarName?: string;

	readonly visibility = new WGRShaderVisibility();
	
	constructor(param: WGRUniformValueParam) {
		const d = param.data;
		this.data = d;
		this.bufferIndex = param.bufferIndex !== undefined ? param.bufferIndex : 0;
		this.index = param.index !== undefined ? param.index : 0;
		if (param.usage !== undefined) this.usage = param.usage;
		if (param.shared !== undefined) this.shared = param.shared;
		if (param.shdVarName !== undefined) this.shdVarName = param.shdVarName;
		this.arrayStride = param.arrayStride !== undefined ? param.arrayStride : 1;
		const bpe = (d as Float32Array).BYTES_PER_ELEMENT;
		if(this.arrayStride < 2 && param.stride !== undefined && bpe !== undefined) {
			this.arrayStride = bpe * param.stride;
		}
		if (d && this.arrayStride < 2) {
			if (d.byteLength <= 64) this.arrayStride = d.byteLength;
		}
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
		const u = new WGRUniformValue({data: data, bufferIndex: this.bufferIndex, index: this.index});
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;

		return u;
	}
}
export { WGRUniformValueParam, WGRUniformValue };

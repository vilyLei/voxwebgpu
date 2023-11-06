import { GPUBuffer } from "../../gpu/GPUBuffer";
import BitConst from "../../utils/BitConst";
import { WGRShaderVisibility } from "./WGRShaderVisibility";
import { WGRUniformSharedData, WGRUniformValueParam } from "./WGRUniformValueParam";

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
	sharedData?: WGRUniformSharedData;

	shdVarName?: string;
	__$gbuf: GPUBuffer;

	visibility = new WGRShaderVisibility();

	constructor(param: WGRUniformValueParam) {
		let d = param.data;
		this.data = d;
		this.bufferIndex = param.bufferIndex !== undefined ? param.bufferIndex : 0;
		this.index = param.index !== undefined ? param.index : 0;
		if (param.usage !== undefined) this.usage = param.usage;
		if (param.shared !== undefined) this.shared = param.shared;
		if (param.sharedData !== undefined) {
			this.sharedData = param.sharedData;
			d = this.sharedData.data;
			this.data = d;
		}
		if (param.shdVarName !== undefined) this.shdVarName = param.shdVarName;
		this.arrayStride = param.arrayStride !== undefined ? param.arrayStride : 1;
		const bpe = (d as Float32Array).BYTES_PER_ELEMENT;
		if (this.arrayStride < 2 && param.stride !== undefined && bpe !== undefined) {
			this.arrayStride = bpe * param.stride;
		} else if (d && this.arrayStride < 2) {
			if (d.byteLength <= 64) this.arrayStride = d.byteLength;
		}
		this.upate();
	}
	// swapBuffer(v: WGRUniformValue): void {
	// 	if(v && v.__$gbuf && this.__$gbuf) {
	// 		if(v.__$gbuf !== this.__$gbuf) {
	// 			const buf = v.__$gbuf;
	// 			v.__$gbuf = this.__$gbuf;
	// 			this.__$gbuf = buf;
	// 			// this.upate();
	// 		}
	// 	}
	// }
	getUid(): number {
		return this.mUid;
	}
	toShared(): WGRUniformValue {
		this.shared = true;
		return this;
	}
	toVisibleAll(): WGRUniformValue {
		this.visibility.toVisibleAll();
		return this;
	}
	toVisibleVertComp(): WGRUniformValue {
		this.visibility.toVisibleVertComp();
		return this;
	}
	toVisibleComp(): WGRUniformValue {
		this.visibility.toVisibleComp();
		return this;
	}
	toBufferForStorage(): WGRUniformValue {
		this.visibility.toBufferForStorage();
		return this;
	}
	toBufferForReadOnlyStorage(): WGRUniformValue {
		this.visibility.toBufferForReadOnlyStorage();
		return this;
	}

	toUniform(): WGRUniformValue {
		this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
		return this;
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
		const u = new WGRUniformValue({ data: data, bufferIndex: this.bufferIndex, index: this.index });
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;
		return u;
	}
	destroy(): void {
		this.data = null;
		this.sharedData = null;
		this.shared = null;
		this.visibility = null;
	}
}
export { WGRUniformValueParam, WGRUniformValue };

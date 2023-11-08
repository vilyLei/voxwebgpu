import BitConst from "../../utils/BitConst";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
import { WGRBufferData, WGRBufferValueParam } from "./WGRBufferValueParam";

class WGRBufferValue {
	private static sUid = 0;
	private mUid = WGRBufferValue.sUid++;

	name?: string;
	/**
	 * Uniform index of RUnit instance uniforms array
	 */
	index = 0;

	version = -1;
	data: NumberArrayDataType;

	byteOffset = 0;
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
	shared = false;
	sharedData?: WGRBufferData;

	shdVarName?: string;

	visibility: WGRBufferVisibility;

	constructor(param: WGRBufferValueParam) {
		let d = param.data;
		this.data = d;
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
	get byteLength(): number {
		return this.data.byteLength;
	}
	getUid(): number {
		return this.mUid;
	}
	toShared(): WGRBufferValue {
		this.shared = true;
		return this;
	}
	toVisibleAll(): WGRBufferValue {
		this.visibility.toVisibleAll();
		return this;
	}
	toVisibleVertComp(): WGRBufferValue {
		this.visibility.toVisibleVertComp();
		return this;
	}
	toVisibleComp(): WGRBufferValue {
		this.visibility.toVisibleComp();
		return this;
	}
	toBufferForStorage(): WGRBufferValue {
		this.visibility.toBufferForStorage();
		return this;
	}
	toBufferForReadOnlyStorage(): WGRBufferValue {
		this.visibility.toBufferForReadOnlyStorage();
		return this;
	}

	toUniform(): WGRBufferValue {
		this.usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;
		return this;
	}
	toStorage(): void {
		this.usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
	}
	toVertex(): void {
		this.usage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
	}
	isUniform(): boolean {
		return BitConst.containsBit(this.usage, GPUBufferUsage.UNIFORM);
	}
	isStorage(): boolean {
		return BitConst.containsBit(this.usage, GPUBufferUsage.STORAGE);
	}
	isVertex(): boolean {
		return BitConst.containsBit(this.usage, GPUBufferUsage.VERTEX);
	}
	upate(): void {
		this.version++;
	}

	clone(data: NumberArrayDataType): WGRBufferValue {
		const u = new WGRBufferValue({ data: data, index: this.index });
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
export { WGRBufferData, WGRBufferValueParam, WGRBufferValue };

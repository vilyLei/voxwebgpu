import BitConst from "../../utils/BitConst";
import { WGRBufferView } from "./WGRBufferView";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
import { WGRBufferData, WGRBufferValueParam } from "./WGRBufferValueParam";

class WGRBufferValue extends WGRBufferView {

	name?: string;
	// /**
	//  * Uniform index of RUnit instance uniforms array
	//  */
	// index = 0;

	byteOffset = 0;
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

	bufData?: WGRBufferData;

	shdVarName?: string;

	visibility: WGRBufferVisibility;

	constructor(param: WGRBufferValueParam) {
		super();
		this.shared = false;
		let d = param.data;
		this.data = d;
		// this.index = param.index !== undefined ? param.index : 0;
		if (param.usage !== undefined) this.usage = param.usage;
		if (param.shared !== undefined) this.shared = param.shared;
		if (param.bufData) {
			const bd = param.bufData;
			this.bufData = bd;
			d = bd.data;
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
		// const u = new WGRBufferValue({ data: data, index: this.index });
		const u = new WGRBufferValue({ data: data});
		u.name = this.name;
		u.byteOffset = this.byteOffset;
		u.arrayStride = this.arrayStride;
		u.usage = this.usage;
		return u;
	}
	destroy(): void {
		this.data = null;
		this.bufData = null;
		this.shared = null;
		this.visibility = null;
		if(this.buffer) {
			this.buffer = null;
		}
	}
}
export { WGRBufferData, WGRBufferValueParam, WGRBufferValue };

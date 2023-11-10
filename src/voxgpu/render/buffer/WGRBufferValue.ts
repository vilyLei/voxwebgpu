import BitConst from "../../utils/BitConst";
import { WGRBufferView } from "./WGRBufferView";
import { applyParamToBufferData, WGRBufferData, WGRBufferValueParam } from "./WGRBufferValueParam";

class WGRBufferValue extends WGRBufferView {

	name?: string;
	constructor(param: WGRBufferValueParam) {
		super();
		// this.shared = false;
		// let d = param.data;
		// this.data = d;
		// if (param.usage !== undefined) this.usage = param.usage;
		// if (param.shared !== undefined) this.shared = param.shared;
		// if (param.bufData) {
		// 	const bd = param.bufData;
		// 	this.bufData = bd;
		// 	d = bd.data;
		// 	this.data = d;
		// }
		// if (param.stride !== undefined) this.stride = param.stride;
		// if (param.shdVarName !== undefined) this.shdVarName = param.shdVarName;
		// if (param.arrayStride !== undefined) this.arrayStride = param.arrayStride;
		// if(this.arrayStride < 2) {
		// 	const bpe = (d as Float32Array).BYTES_PER_ELEMENT;
		// 	if (this.stride !== undefined && bpe !== undefined) {
		// 		this.arrayStride = bpe * this.stride;
		// 	} else if (d) {
		// 		if (d.byteLength <= 64) this.arrayStride = d.byteLength;
		// 	}
		// }
		applyParamToBufferData(this, param);
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
const __$ubv = new WGRBufferValue({data: new Float32Array(4)});
function bufferDataFilter(d: WGRBufferData): WGRBufferData {
	if(!d) {
		return d;
	}
	const v = __$ubv;
	let rd = d;
	v.toUniform();
	if(d.uniform) {
		rd = d.uniform;
	}
	if(d.storage) {
		rd = d.storage;
		v.toStorage();
	}
	if(d.vertex) {
		rd = d.vertex;
		v.toVertex();
	}
	if(rd.usage === undefined){
		rd.usage = v.usage;
	}
	return rd;
}
function checkBufferData(bufData: WGRBufferData): void {
	let isView = bufData.__$getType !== undefined;
	if(!isView) {
		bufData = bufferDataFilter(bufData);
		const v = __$ubv;
		v.toUniform();
		if(bufData.usage === undefined) bufData.usage = v.usage;
		bufData.shared = bufData.shared === true ? true : false;
		bufData.byteLength = bufData.data.byteLength;
	}
	// let typeNS = typeof bufData;
	// console.log("checkBufferData(), typeNS: ", typeNS);
	// console.log("checkBufferData(), bufData: ", bufData);
}

export { checkBufferData, WGRBufferData, WGRBufferValueParam, WGRBufferValue };

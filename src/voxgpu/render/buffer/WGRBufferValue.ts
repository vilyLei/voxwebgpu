import BitConst from "../../utils/BitConst";
import { WGRBufferView } from "./WGRBufferView";
import { applyParamToBufferData, WGRBufferLayout, WGRBufferData, WGRBufferValueParam } from "./WGRBufferValueParam";
import { WGRBufferVisibility } from "./WGRBufferVisibility";

class WGRBufferValue extends WGRBufferView {

	name?: string;
	constructor(param: WGRBufferValueParam) {
		super();
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
function getVisibility(str: string, value: number): number {
	switch(str) {
		case 'vert':
		case 'vertex':
			console.log("getVisibility() XXXX Vert");
			return value | GPUShaderStage.VERTEX;
			break;
		case 'frag':
		case 'fragment':
			console.log("getVisibility() XXXX Frag");
			return value | GPUShaderStage.FRAGMENT;
			break;
		case 'comp':
		case 'compute':
			console.log("getVisibility() XXXX Comp");
			return value | GPUShaderStage.COMPUTE;
			break;
		default:
			break;
	}
	return value;
}
function applyLayout(layout: WGRBufferLayout, vi: WGRBufferVisibility, type: string): void {
	let visi = layout.visibility !== undefined ? layout.visibility : 'vert_frag';
	let vs = visi.split('_');
	let v = 0;
	let bv = __$ubv.visibility;
	for(let i = 0; i < vs.length; ++i) {
		if(vs[i] === 'all') {			
			bv.toVisibleAll();
			v = bv.visibility;
			console.log("applyLayout() all");
			break;
		}
		v = v | getVisibility(vs[i], v);
	}
	if(vs.length < 1) {
		bv.toVisibleVertFrag();
		v = bv.visibility;
	}
	if(v < 1) {
		throw 'Illegal operation !!!';
	}
	vi.visibility = v;
	let acc = layout.access !== undefined ? layout.access : '';
	switch(type) {
		case 'uniform':
			vi.toBufferForUniform();
			break;
		case 'storage':
			if(acc === 'read_write') {
				vi.toBufferForStorage();
			}else {
				vi.toBufferForReadOnlyStorage();
			}
			break;
		default:
			break;
	}
}
function bufferDataFilter(d: WGRBufferData): WGRBufferData {

	if(!d) {
		return d;
	}
	const v = __$ubv;
	let rd = d;
	let vi = rd.visibility;
	
	let layout: WGRBufferLayout = rd.layout;
	if(d.storage) {
		rd = d.storage;
		v.toStorage();
		rd.usage = v.usage;
		// console.log("uuuuuuu storage ... !rd.visibility: ", (!rd.visibility));
		let flag = !rd.visibility;
		// flag = true;
		// rd.visibility = new WGRBufferVisibility();
		if(flag) {
			rd.visibility = new WGRBufferVisibility();
		}

		vi = rd.visibility;
		if(!layout) layout = rd.layout;
		if(flag && layout !== undefined) {
			applyLayout(layout, vi, 'storage');
		}else{
			let b = vi.buffer;
			// console.log("dfdfdfd AAA b: ", b, (!b));
			if(!b || b.type.indexOf('storage') < 0) {
				vi.toBufferForReadOnlyStorage();
				b = vi.buffer;
			}
		}
		// console.log("dfdfdfd BBB b: ", b, (!b));
	}
	if(d.vertex) {
		rd = d.vertex;
		v.toVertex();
		rd.usage = v.usage;
	}
	if(rd.usage === undefined || d.uniform) {
		if(d.uniform) {
			rd = d.uniform;
		}
		v.toUniform();
		rd.usage = v.usage;
		// console.log("rd.visibility .......: ", rd.visibility);
		let flag = !rd.visibility;
		// flag = true;
		// rd.visibility = new WGRBufferVisibility();
		if(flag) {
			rd.visibility = new WGRBufferVisibility();
		}
		vi = rd.visibility;
		if(!layout) layout = rd.layout;
		if(flag && layout !== undefined) {
			applyLayout(layout, vi, 'uniform');
		}else{
			let b = vi.buffer;
			if(!b || b.type.indexOf('uniform') < 1) {
				vi.toBufferForUniform();
				b = vi.buffer;
			}
		}
		// console.log("dfdfdfd AAA111 b: ", b, (!b), ", vi: ", vi);
	}
	if(rd.byteOffset === undefined) rd.byteOffset = 0;
	if(rd.version === undefined) rd.version = -1;
	return rd;
}
function checkBufferData(bufData: WGRBufferData): WGRBufferData {
	let isBV = bufData instanceof WGRBufferValue;
	// console.log("checkBufferData(), isBV: ", isBV);
	if(!isBV) {
		// console.log("checkBufferData(), building data ...");
		bufData = bufferDataFilter(bufData);
		const v = __$ubv;

		// if(bufData.usage === undefined) {
		// 	console.log(">>>>>> sdsds >>>>>>>>>>")
		// 	v.toUniform();
		// 	bufData.usage = v.usage;
		// 	bufData.visibility;
		// }
		bufData.shared = bufData.shared === true ? true : false;
		applyParamToBufferData(bufData, bufData);
		bufData.byteLength = bufData.data.byteLength;
		// const vi = bufData.visibility;
		// vi.toBufferForUniform();
		// vi.toVisibleAll();
		console.log("checkBufferData(), XXXXXXXX bufDatd: ", bufData);
	}
	// if(bufData.uuid === 'v0') {
	// 	console.log("checkBufferData(), >>>>>>>> v0 bufDatd: ", bufData);
	// }
	// let typeNS = typeof bufData;
	// console.log("checkBufferData(), typeNS: ", typeNS);
	// console.log("checkBufferData(), bufData: ", bufData);
	return bufData;
}

export { checkBufferData, WGRBufferData, WGRBufferValueParam, WGRBufferValue };

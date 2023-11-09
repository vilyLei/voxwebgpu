import { WGRBufferData } from "./WGRBufferData";
interface WGRBufferValueParam {
	/**
	 * uniform value data object
	 */
	data?: NumberArrayDataType;

	usage?: number;
	/**
	 * uniform value object is shared, or not
	 */
	shared?: boolean;
	/**
	 * uniform value shared data object
	 */
	bufData?: WGRBufferData;
	shdVarName?: string;
	arrayStride?: number;
	/**
	 * data element stride
	 */
	stride?: number;
}
function applyParamBufferData(data: WGRBufferData, param: WGRBufferValueParam) {
	data.shared = false;
	let d = param.data;
	data.data = d;
	if (param.usage !== undefined) data.usage = param.usage;
	if (param.shared !== undefined) data.shared = param.shared;
	if (param.bufData) {
		const bd = param.bufData;
		data.bufData = bd;
		d = bd.data;
		data.data = d;
	}
	if (param.stride !== undefined) data.stride = param.stride;
	if (param.shdVarName !== undefined) data.shdVarName = param.shdVarName;
	if (param.arrayStride !== undefined) data.arrayStride = param.arrayStride;
	if(data.arrayStride < 2) {
		const bpe = (d as Float32Array).BYTES_PER_ELEMENT;
		if (data.stride !== undefined && bpe !== undefined) {
			data.arrayStride = bpe * data.stride;
		} else if (d) {
			if (d.byteLength <= 64) data.arrayStride = d.byteLength;
		}
	}
}
export { applyParamBufferData, WGRBufferData, WGRBufferValueParam };

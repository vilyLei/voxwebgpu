import { WGRBufferLayout, WGRBufferData } from "./WGRBufferData";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
interface WGRBufferValueParam {

	uuid?: string;

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
	/**
	 * likes: vec4<f32>
	 */
	shdVarFormat?: string;
	arrayStride?: number;
	/**
	 * data element stride
	 */
	stride?: number;
}
function applyParamToBufferData(bufData: WGRBufferData, param: WGRBufferValueParam) {
	if(param.uuid !== undefined) bufData.uuid = param.uuid;
	let d = param.data;
	bufData.data = d;
	if (param.bufData) {
		const bd = param.bufData;
		bufData.bufData = bd;
		d = bd.data;
		bufData.data = d;
	}
	// console.log("MMM bufData.stride: ", bufData.stride, ", bufData", bufData);
	if(bufData.shared === undefined) bufData.shared = false;
	if (bufData !== param) {
		if (param.usage !== undefined) bufData.usage = param.usage;
		if (param.shared !== undefined) bufData.shared = param.shared;
		if (param.stride !== undefined) bufData.stride = param.stride;
		if (param.shdVarName !== undefined) bufData.shdVarName = param.shdVarName;
		if (param.shdVarFormat !== undefined) bufData.shdVarFormat = param.shdVarFormat;
		if (param.arrayStride !== undefined) bufData.arrayStride = param.arrayStride;
	}
	if(bufData.arrayStride === undefined) bufData.arrayStride = 1;
	if (bufData.arrayStride < 2 && d) {
		const bpe = (d as Float32Array).BYTES_PER_ELEMENT;
		if (bufData.stride !== undefined && bpe !== undefined) {
			bufData.arrayStride = bpe * bufData.stride;
		} else if (d) {
			if (d.byteLength <= 64) bufData.arrayStride = d.byteLength;
		}
	}
	if(!bufData.visibility) {
		bufData.visibility = new WGRBufferVisibility();
	}
}
export { applyParamToBufferData, WGRBufferLayout, WGRBufferData, WGRBufferValueParam };

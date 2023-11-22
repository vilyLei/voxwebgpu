import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
// let layout = {visibility:'vert_comp', access:'read_write'};
interface WGRBufferLayout {
	visibility?: string;
	access?: string;
}
interface WGRBufferData {
	uuid?: string;
	data?: NumberArrayDataType;
	buffer?: GPUBuffer;
	mappedAtCreation?: boolean;
	shared?: boolean;
	version?: number;
	byteOffset?: number;
	uid?: number;
	byteLength?: number;
	visibility?: WGRBufferVisibility;
	arrayStride?: number;
	usage?: number;
	stride?: number;
	shdVarName?: string;
	/**
	 * Pro
	 */
	shdVarFormat?: string;
	layout?: WGRBufferLayout;
	arraying?: boolean;
	// 注意: 这种嵌套实现未必是有效的
	bufData?: WGRBufferData;
	uniform?: WGRBufferData;
	storage?: WGRBufferData;
	vertex?: WGRBufferData;
}
export { WGRBufferLayout, WGRBufferData };

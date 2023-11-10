import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
interface WGRBufferData {
	__$getType?: string;
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
	// 注意: 这种嵌套实现未必是有效的
	bufData?: WGRBufferData;
	uniform?: WGRBufferData;
	storage?: WGRBufferData;
	vertex?: WGRBufferData;
}
export { WGRBufferData };

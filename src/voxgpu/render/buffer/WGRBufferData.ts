import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferVisibility } from "./WGRBufferVisibility";
interface WGRBufferData {
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
	bufData?: WGRBufferData;
	stride?: number;
	shdVarName?: string;
}
export { WGRBufferData };

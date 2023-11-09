import { GPUBuffer } from "../../gpu/GPUBuffer";
interface WGRBufferData {
	data?: NumberArrayDataType;
	buffer?: GPUBuffer;
	mappedAtCreation?: boolean;
	shared?: boolean;
	version?: number;
	uid?: number;
	byteLength?: number;
}
export { WGRBufferData };

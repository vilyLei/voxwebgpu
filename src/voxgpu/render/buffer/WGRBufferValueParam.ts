import { GPUBuffer } from "../../gpu/GPUBuffer";
interface WGRBufferData {
	data: NumberArrayDataType;
	buffer?: GPUBuffer;
	uid?: number;
}
interface WGRBufferValueParam {
	/**
	 * uniform value data object
	 */
	data?: NumberArrayDataType;
	// bufferIndex?: number;
	/**
	 * uniform index in RUnit instance
	 */
	index?: number;
	usage?: number;
	/**
	 * uniform value object is shared, or not
	 */
	shared?: boolean;
	/**
	 * uniform value shared data object
	 */
	sharedData?: WGRBufferData;
	shdVarName?: string;
	arrayStride?: number;
	/**
	 * data element stride
	 */
	stride?: number;
}
export { WGRBufferData, WGRBufferValueParam };

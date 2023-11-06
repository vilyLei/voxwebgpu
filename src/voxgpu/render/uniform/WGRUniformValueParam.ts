import { GPUBuffer } from "../../gpu/GPUBuffer";
interface WGRUniformSharedData {
	data: NumberArrayDataType;
	buffer?: GPUBuffer;
}
interface WGRUniformValueParam {
	/**
	 * uniform value data object
	 */
	data?: NumberArrayDataType;
	bufferIndex?: number;
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
	sharedData?: WGRUniformSharedData;
	shdVarName?: string;
	arrayStride?: number;
	/**
	 * data element stride
	 */
	stride?: number;
}
export { WGRUniformSharedData, WGRUniformValueParam };

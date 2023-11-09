import { WGRBufferData } from "./WGRBufferData";
interface WGRBufferValueParam {
	/**
	 * uniform value data object
	 */
	data?: NumberArrayDataType;
	// /**
	//  * uniform index in RUnit instance
	//  */
	// index?: number;
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
export { WGRBufferData, WGRBufferValueParam };

import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferData } from "./WGRBufferValueParam";
import { WGRBufferVisibility } from "./WGRBufferVisibility";

const __$RID = {uid:0};
function createNewWRGBufferViewUid(): number {
	return __$RID.uid++;
}
class WGRBufferView implements WGRBufferData {
	private mUid = createNewWRGBufferViewUid();
	uuid?: string;
	data?: NumberArrayDataType;
	buffer?: GPUBuffer;
	mappedAtCreation?: boolean;
	shared?: boolean;
	
	arrayStride = 1;
	usage = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

	byteOffset = 0;
	version = -1;
	stride?: number;
	/**
	 * 可以从shader源码中分析获得
	 */
	visibility?: WGRBufferVisibility;

	shdVarName?: string;

	bufData?: WGRBufferData;
	
	get byteLength(): number {
		return this.data.byteLength;
	}
	get uid(): number {
		return this.mUid;
	}
	setParam(param: WGRBufferData): WGRBufferView {
		if(param) {
			if(param.data) this.data = param.data;
			if(param.buffer) this.buffer = param.buffer;
			if(param.mappedAtCreation !== undefined) this.mappedAtCreation = param.mappedAtCreation;
			if(param.shared !== undefined) this.shared = param.shared;
		}
		return this;
	}
}
export { createNewWRGBufferViewUid, WGRBufferView };

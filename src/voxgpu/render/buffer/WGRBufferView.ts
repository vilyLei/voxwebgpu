import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferData } from "./WGRBufferValueParam";

const __$RID = {uid:0};
class WGRBufferView implements WGRBufferData {
	private mUid = __$RID.uid++;

	data?: NumberArrayDataType;
	buffer?: GPUBuffer;
	mappedAtCreation?: boolean;
	shared?: boolean;
	version = -1;

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
export { WGRBufferView };

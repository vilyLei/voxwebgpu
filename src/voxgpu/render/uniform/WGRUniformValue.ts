
import { WGRBufferValueParam, WGRBufferValue } from "../buffer/WGRBufferValue";
import { WGRBufferVisibility } from "../buffer/WGRBufferVisibility";
interface WGRUniformValueParam extends WGRBufferValueParam {
	label?: string;
}
class WGRUniformValue extends WGRBufferValue {
	constructor(param: WGRUniformValueParam) {
		super(param);
		if(!this.visibility) {
			this.visibility = new WGRBufferVisibility();
		}
		this.toUniform();
	}
}
export { WGRUniformValueParam, WGRUniformValue };

import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPURenderPassDepthStencilAttachment } from "../../gpu/GPURenderPassDepthStencilAttachment";
import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";

class WGRPDepthStencilAttachment implements GPURenderPassDepthStencilAttachment {
	view: GPUTextureView;
	viewTexture: GPUTexture;
	depthClearValue?: number = 1.0;
	depthLoadOp = "clear";
	depthStoreOp = "store";

	setParam(param: GPURenderPassDepthStencilAttachment): WGRPDepthStencilAttachment {
		if(param) {
			copyFromObjectValueWithKey(param, this);
		}
		return this;
	}
}
export { WGRPDepthStencilAttachment };

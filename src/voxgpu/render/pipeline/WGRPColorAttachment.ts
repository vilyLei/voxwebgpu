import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import Color4 from "../../material/Color4";
import { GPUTexture } from "../../gpu/GPUTexture";
import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";
class WGRPColorAttachment implements GPURenderPassColorAttachment {
	/**
	 * A GPUTextureView object representing the texture subresource that will be output to for this color attachment.
	 */
	view?: GPUTextureView;
	/**
	 * A GPUTextureView object representing the texture subresource that will receive the resolved output for this color attachment if view is multisampled.
	 */
	resolveTarget?: GPUTextureView;

	viewTexture?: GPUTexture;
	resolveTargetTexture?: GPUTexture;

	clearValue = new Color4();
	loadOp = "clear";
	storeOp = "store";

	setParam(param: GPURenderPassColorAttachment): WGRPColorAttachment {
		if (param) {
			let c = this.clearValue;
			copyFromObjectValueWithKey(param, this);
			c.setParam( this.clearValue );
			this.clearValue = c;
		}
		return this;
	}
	linkToPrev(prev: WGRPColorAttachment, multisampleEnabled: boolean): void {
		if (multisampleEnabled) {
			this.view = prev.view;
			this.resolveTarget = prev.resolveTarget;
		} else {
			this.view = prev.view;
		}
	}
}
export { WGRPColorAttachment };

import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import Color4 from "../../material/Color4";
import { GPUTexture } from "../../gpu/GPUTexture";
import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";
import { WGRPColorAttachmentImpl } from "./WGRPColorAttachmentImpl";
class WGRPColorAttachment implements WGRPColorAttachmentImpl {
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
	/**
	 * Possible values are: "clear", "load"
	 */
	loadOp = "clear";
	/**
	 * Possible values are: "discard", "store"
	 */
	storeOp = "store";

	set clearEnabled(enabled: boolean) {
		this.loadOp = enabled ? "clear" : "load";
	}
	get clearEnabled(): boolean {
		return this.loadOp === "clear";
	}
	setParam(param: GPURenderPassColorAttachment): WGRPColorAttachment {
		if (param) {
			let c = this.clearValue;
			copyFromObjectValueWithKey(param, this);
			c.setColor( this.clearValue );
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

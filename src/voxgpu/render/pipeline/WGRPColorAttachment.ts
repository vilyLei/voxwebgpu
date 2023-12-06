import { GPUTextureView } from "../../gpu/GPUTextureView";
import Color4 from "../../material/Color4";
import { GPUTexture } from "../../gpu/GPUTexture";
import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";
import { WGRPColorAttachmentImpl } from "./WGRPColorAttachmentImpl";
import { WGRPassColorAttachment } from "./WGRPassColorAttachment";
import { WGTextureDataDescriptor } from "../../texture/WGTextureDataDescriptor";
class WGRPColorAttachment implements WGRPColorAttachmentImpl {
	// private static sUid = 0;
	// private mUid = WGRPColorAttachment.sUid ++;
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

	param: WGRPassColorAttachment;
	texture: WGTextureDataDescriptor;
	textureFormat = 'bgra8unorm';
	// gpuTexture: GPUTexture;

	set clearEnabled(enabled: boolean) {
		this.loadOp = enabled ? "clear" : "load";
		// console.log("xxx this.loadOp: ", this.loadOp, ', uid: ',this.mUid);
	}
	get clearEnabled(): boolean {
		return this.loadOp === "clear";
	}
	setParam(param: WGRPassColorAttachment): WGRPColorAttachment {
		if (param) {
			this.param = param;

			let c = this.clearValue;
			copyFromObjectValueWithKey(param, this);
			c.setColor( this.clearValue );
			this.clearValue = c;
			this.texture = param.texture;
			console.log("xxx setParam(), this.loadOp: ", this.loadOp, ', clearValue: ', this.clearValue);
		}
		return this;
	}
	linkToPrev(prev: WGRPColorAttachment, multisampled: boolean): void {
		if (multisampled) {
			this.view = prev.view;
			this.resolveTarget = prev.resolveTarget;
		} else {
			this.view = prev.view;
		}
	}
}
export { WGRPColorAttachment };

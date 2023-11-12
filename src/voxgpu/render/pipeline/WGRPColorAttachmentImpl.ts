import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
interface WGRPColorAttachmentImpl extends GPURenderPassColorAttachment {
	// /**
	//  * A GPUTextureView object representing the texture subresource that will be output to for this color attachment.
	//  */
	// view?: GPUTextureView;
	// /**
	//  * A GPUTextureView object representing the texture subresource that will receive the resolved output for this color attachment if view is multisampled.
	//  */
	// resolveTarget?: GPUTextureView;

	// viewTexture?: GPUTexture;
	// resolveTargetTexture?: GPUTexture;

	// clearValue = new Color4();
	// /**
	//  * Possible values are: "clear", "load"
	//  */
	// loadOp = "clear";
	// /**
	//  * Possible values are: "discard", "store"
	//  */
	// storeOp = "store";

	setParam(param: GPURenderPassColorAttachment): WGRPColorAttachmentImpl;
	clearEnabled: boolean;
	// set clearEnabled(enabled: boolean) {
	// 	if(this.mPassBuilded) {
	// 		const ca = this.rpass.passColors[index];
	// 		if(ca) {
				
	// 		}
	// 	}
	// }
}
export { WGRPColorAttachmentImpl };

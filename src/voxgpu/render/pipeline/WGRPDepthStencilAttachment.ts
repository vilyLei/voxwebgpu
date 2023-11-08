import { GPUTextureView } from "../../gpu/GPUTextureView";
import { GPURenderPassDepthStencilAttachment } from "../../gpu/GPURenderPassDepthStencilAttachment";

class WGRPDepthStencilAttachment implements GPURenderPassDepthStencilAttachment {
	view: GPUTextureView;
	depthClearValue?: number = 1.0;
	depthLoadOp = "clear";
	depthStoreOp = "store";
}
export { WGRPDepthStencilAttachment };

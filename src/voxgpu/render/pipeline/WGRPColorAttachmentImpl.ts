import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
interface WGRPColorAttachmentImpl extends GPURenderPassColorAttachment {

	setParam(param: GPURenderPassColorAttachment): WGRPColorAttachmentImpl;
	clearEnabled: boolean;
}
export { WGRPColorAttachmentImpl };

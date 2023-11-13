
import { GPURenderPassColorAttachment } from "../../gpu/GPURenderPassColorAttachment";
import { WGTextureDataDescriptor } from "../../texture/WGTextureDataDescriptor";
interface WGRPassColorAttachment extends GPURenderPassColorAttachment {

	texture?: WGTextureDataDescriptor;
	textureFormat?: string;
}
export { WGRPassColorAttachment }

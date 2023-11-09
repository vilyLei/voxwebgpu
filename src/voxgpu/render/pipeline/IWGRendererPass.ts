import Color4 from "../../material/Color4";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
import { GPUComputePassEncoder } from "../../gpu/GPUComputePassEncoder";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { IWGRPassRef } from "./IWGRPassRef";
import { WGRPassColorAttachment } from "./WGRPassColorAttachment";
import { GPURenderPassDepthStencilAttachment } from "../../gpu/GPURenderPassDepthStencilAttachment";

interface WGRPassParam {
    multisampleEnabled?: boolean;
    sampleCount?: number;
    /**
     * Possible values are: 'depth24plus','depth32float'
     */
	depthFormat?: string;
    /**
     * The value is true, it represent a compute render pass
     */
    computeEnabled?: boolean;
	prevPass?: IWGRPassRef;
	separate?: boolean;
	depthTestEnabled?: boolean;
	stecilTestEnabled?: boolean;
	colorAttachments?: WGRPassColorAttachment[];
	depthStencilAttachment?: GPURenderPassDepthStencilAttachment;
}
interface IWGRendererPass {

	enabled: boolean;
    colorView: GPUTextureView;
    passEncoder?: GPURenderPassEncoder;
    compPassEncoder?: GPUComputePassEncoder;
    commandEncoder: GPUCommandEncoder;
    clearColor: Color4;
	isDrawing(): boolean;
	/**
	 * read only
	 */
	depthTexture: GPUTexture;

}
export { WGRPassParam, IWGRendererPass }

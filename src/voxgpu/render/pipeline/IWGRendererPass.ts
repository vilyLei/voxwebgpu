import Color4 from "../../material/Color4";
import { GPUCommandEncoder } from "../../gpu/GPUCommandEncoder";
import { GPURenderPassEncoder } from "../../gpu/GPURenderPassEncoder";
import { GPUTexture } from "../../gpu/GPUTexture";
import { GPUTextureView } from "../../gpu/GPUTextureView";

interface WGRPassParams {
    multisampleEnabled?: boolean;
    sampleCount?: number;
    /**
     * 'depth24plus','depth32float'
     */
	depthFormat?: string;
}
interface IWGRendererPass {

    colorView: GPUTextureView;
    passEncoder: GPURenderPassEncoder;
    commandEncoder: GPUCommandEncoder;
    clearColor: Color4;

	/**
	 * read only
	 */
	depthTexture: GPUTexture;

}
export { WGRPassParams, IWGRendererPass }

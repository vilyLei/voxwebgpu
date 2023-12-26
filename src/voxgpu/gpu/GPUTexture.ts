import { GPUTextureView } from "./GPUTextureView";
import { GPUTextureViewDescriptor } from "./GPUTextureViewDescriptor";

interface GPUTexture {
	url?: string;
	uid?: number;
	label?: string;

	depthOrArrayLayers: number;
	/**
	 * Possible values are: "1d", "2d", "3d"
	 */
	dimension: string;
	/**
	 * In GPUTextureFormat: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 * Some value examples: "bgra8unorm", "rgba16sint","rgba16float","stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float",...
	 */
	format: string;

	/**
	 * A number representing the width of the GPUTexture in pixels
	 */
	width: number;
	/**
	 * A number representing the height of the GPUTexture in pixels
	 */
	height: number;
	/**
	 * The bitwise flags representing the allowed usages of the GPUTexture
	 * In GPUTextureUsage: https://gpuweb.github.io/gpuweb/#typedefdef-gputextureusageflags
	 */
	usage: number;
	/**
	 * A number representing the number of mip levels of the GPUTexture
	 */
	mipLevelCount: number;
	/**
	 * A number representing the sample count of the GPUTexture
	 */
	sampleCount: number;

	createView(descriptor?: GPUTextureViewDescriptor): GPUTextureView;
	destroy(): void;
}
export { GPUTexture };

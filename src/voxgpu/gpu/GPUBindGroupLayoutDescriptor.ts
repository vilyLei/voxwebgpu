import { GPUBindGroupLayout } from "./GPUBindGroupLayout";

/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpubufferbindinglayout
 */
interface GPUBufferBindingLayout {
	/**
	 * The default value is "uniform", Possible values are(in GPUBufferBindingType):
	 * 		"uniform", "storage", "read-only-storage"
	 */
	type?: string;
	/**
	 * The default value is false.
	 */
	hasDynamicOffset?: boolean;
	/**
	 * The default value is 0
	 */
	minBindingSize?: number
}
/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gpusamplerbindinglayout
 */
interface GPUSamplerBindingLayout {
	/**
	 * The default value is "filtering", Possible values are(in GPUSamplerBindingType):
	 * 		    "filtering","non-filtering","comparison"
	 */
	type?: string;
}
/**
 * See: https://gpuweb.github.io/gpuweb/#dictdef-gputexturebindinglayout
 */
interface GPUTextureBindingLayout {
	/**
	 * The default value is "float", Possible values are(in GPUSamplerBindingType):
	 * 		    "float","unfilterable-float","depth","sint","uint"
	 */
	sampleType?: string;
	/**
	 * The default value is "2d", Possible values are(in GPUTextureViewDimension):
	 * 		        "1d","2d","2d-array","cube","cube-array","3d"
	 */
	viewDimension?: string;
	/**
	 * The default value is false.
	 */
	multisampled?: boolean;
}

interface GPUStorageTextureBindingLayout {

	/**
	 * The default value is "write-only", Possible values are(in GPUSamplerBindingType):
	 * 		    "write-only","read-only","read-write"
	 */
	access?: string;

	/**
	 * In GPUTextureFormat: https://gpuweb.github.io/gpuweb/#enumdef-gputextureformat
	 * Some value examples: "bgra8unorm", "rgba16sint","rgba16float","stencil8","depth16unorm","depth24plus","depth24plus-stencil8","depth32float",...
	 */
	format: string;
	/**
	 * The default value is "2d", Possible values are(in GPUTextureViewDimension):
	 * 		        "1d","2d","2d-array","cube","cube-array","3d"
	 */
	viewDimension?: string;
}
interface GPUExternalTextureBindingLayout {
	label?: string;
}
// See: https://gpuweb.github.io/gpuweb/#dictdef-gpubindgrouplayoutentry
interface GPUBindGroupLayoutEntity {
	label?: string;
	/**
	 * A unique identifier for a resource binding within the GPUBindGroupLayout, corresponding to a GPUBindGroupEntry.
	 * binding and a @binding attribute in the GPUShaderModule.
	 */
	binding?: number;
	/**
	 * A bitset of the members of GPUShaderStage.
	 * Each set bit indicates that a GPUBindGroupLayoutEntry's resource will be accessible from the associated shader stage.
	 * GPUShaderStage(GPUShaderStageFlags) values.
	 * See: https://gpuweb.github.io/gpuweb/#typedefdef-gpushaderstageflags
	 */
	visibility: number;
	buffer?: GPUBufferBindingLayout;
	sampler?: GPUSamplerBindingLayout;
	texture?: GPUTextureBindingLayout;
	storageTexture?: GPUStorageTextureBindingLayout;
	externalTexture?: GPUExternalTextureBindingLayout;
}
/**
 * see: https://gpuweb.github.io/gpuweb/#dictdef-gpubindgrouplayoutdescriptor
 */
interface GPUBindGroupLayoutDescriptor {
	label?: string;
	entries: GPUBindGroupLayoutEntity[];
	layout?: GPUBindGroupLayout;
}
export {
	GPUExternalTextureBindingLayout,
	GPUStorageTextureBindingLayout,
	GPUTextureBindingLayout,
	GPUSamplerBindingLayout,
	GPUBufferBindingLayout,
	GPUBindGroupLayoutEntity,
	GPUBindGroupLayoutDescriptor
};

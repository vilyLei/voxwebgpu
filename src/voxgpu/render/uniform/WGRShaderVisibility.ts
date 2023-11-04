import {
	GPUExternalTextureBindingLayout,
	GPUStorageTextureBindingLayout,
	GPUTextureBindingLayout,
	GPUSamplerBindingLayout,
	GPUBufferBindingLayout,
	GPUBindGroupLayoutEntity
} from "../../gpu/GPUBindGroupLayoutDescriptor";

import BitConst from "../../utils/BitConst";

class WGRShaderVisibility implements GPUBindGroupLayoutEntity {

	label?: string;
	/**
	 * A unique identifier for a resource binding within the GPUBindGroupLayout, corresponding to a GPUBindGroupEntry.
	 * binding and a @binding attribute in the GPUShaderModule.
	 */
	binding = 0;
	/**
	 * A bitset of the members of GPUShaderStage.
	 * Each set bit indicates that a GPUBindGroupLayoutEntry's resource will be accessible from the associated shader stage.
	 * GPUShaderStage(GPUShaderStageFlags) values.
	 * See: https://gpuweb.github.io/gpuweb/#typedefdef-gpushaderstageflags
	 */
	visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;

	buffer?: GPUBufferBindingLayout;
	sampler?: GPUSamplerBindingLayout;
	texture?: GPUTextureBindingLayout;
	storageTexture?: GPUStorageTextureBindingLayout;
	externalTexture?: GPUExternalTextureBindingLayout;

}
export { WGRShaderVisibility };

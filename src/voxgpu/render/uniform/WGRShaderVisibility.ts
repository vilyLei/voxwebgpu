import {
	GPUExternalTextureBindingLayout,
	GPUStorageTextureBindingLayout,
	GPUTextureBindingLayout,
	GPUSamplerBindingLayout,
	GPUBufferBindingLayout,
	GPUBindGroupLayoutEntity
} from "../../gpu/GPUBindGroupLayoutDescriptor";

import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";
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

	toVisibleAll(): void {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
	}
	toVisibleVertAndFrag(): void {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
	}
	toVisibleVert(): void {
		this.visibility = GPUShaderStage.VERTEX;
	}
	toVisibleFrag(): void {
		this.visibility = GPUShaderStage.FRAGMENT;
	}
	toVisibleComp(): void {
		this.visibility = GPUShaderStage.COMPUTE;
	}
	toBufferForUniform(): void {
		this.buffer = {type: 'uniform'};
	}
	toBufferForStorage(): void {
		this.buffer = {type: 'storage'};
	}
	toBufferForReadOnlyStorage(): void {
		this.buffer = {type: 'read-only-storage'};
	}

	clone(): WGRShaderVisibility {
		const v = new WGRShaderVisibility();
		v.label = this.label;
		v.visibility = this.visibility;
		if (this.buffer) {
			v.buffer = {};
			copyFromObjectValueWithKey(this.buffer, v.buffer)
		}
		if (this.sampler) {
			v.sampler = {};
			copyFromObjectValueWithKey(this.sampler, v.sampler)
		}
		if (this.texture) {
			v.texture = {};
			copyFromObjectValueWithKey(this.texture, v.texture)
		}
		return v;
	}
}
export { WGRShaderVisibility };

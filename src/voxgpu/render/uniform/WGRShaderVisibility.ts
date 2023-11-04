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
	constructor() {
		// this.toBufferForUniform();
		// this.toVisibleAll();
		// this.toBufferForUniform();
	}
	toVisibleAll(): WGRShaderVisibility {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
		return this;
	}
	toVisibleVertAndFrag(): WGRShaderVisibility {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
		return this;
	}
	toVisibleVert(): WGRShaderVisibility {
		this.visibility = GPUShaderStage.VERTEX;
		return this;
	}
	toVisibleFrag(): WGRShaderVisibility {
		this.visibility = GPUShaderStage.FRAGMENT;
		return this;
	}
	toVisibleComp(): WGRShaderVisibility {
		this.visibility = GPUShaderStage.COMPUTE;
		return this;
	}
	toBufferForUniform(): WGRShaderVisibility {
		this.buffer = { type: 'uniform' };
		return this;
	}
	toBufferForStorage(): WGRShaderVisibility {
		this.buffer = { type: 'storage' };
		return this;
	}
	toBufferForReadOnlyStorage(): WGRShaderVisibility {
		this.buffer = { type: 'read-only-storage' };
		return this;
	}
	toSamplerFiltering(): WGRShaderVisibility {
		this.sampler = { type: 'filtering' };
		return this;
	}
	toTextureFloat(viewDimension?: string): WGRShaderVisibility {
		viewDimension = viewDimension ? viewDimension : '2d';
		this.texture = { sampleType: 'float', viewDimension };
		return this;
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

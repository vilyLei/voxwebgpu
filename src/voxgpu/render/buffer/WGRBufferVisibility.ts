import {
	GPUExternalTextureBindingLayout,
	GPUStorageTextureBindingLayout,
	GPUTextureBindingLayout,
	GPUSamplerBindingLayout,
	GPUBufferBindingLayout,
	GPUBindGroupLayoutEntity
} from "../../gpu/GPUBindGroupLayoutDescriptor";

import { copyFromObjectValueWithKey } from "../../utils/CommonUtils";
class WGRBufferVisibility implements GPUBindGroupLayoutEntity {

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

	toVisibleAll(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
		return this;
	}
	toVisibleVertFrag(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX;
		return this;
	}
	toVisibleVert(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.VERTEX;
		return this;
	}
	toVisibleVertComp(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE;
		return this;
	}
	toVisibleFragComp(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE;
		return this;
	}
	toVisibleFrag(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.FRAGMENT;
		return this;
	}
	toVisibleComp(): WGRBufferVisibility {
		this.visibility = GPUShaderStage.COMPUTE;
		return this;
	}
	toBufferForUniform(): WGRBufferVisibility {
		this.buffer = { type: 'uniform' };
		return this;
	}
	toBufferForStorage(): WGRBufferVisibility {
		this.buffer = { type: 'storage' };
		return this;
	}
	toBufferForReadOnlyStorage(): WGRBufferVisibility {
		this.buffer = { type: 'read-only-storage' };
		return this;
	}
	toSamplerFiltering(): WGRBufferVisibility {
		this.sampler = { type: 'filtering' };
		return this;
	}
	toTextureFloat(viewDimension?: string): WGRBufferVisibility {
		viewDimension = viewDimension ? viewDimension : '2d';
		this.texture = { sampleType: 'float', viewDimension };
		return this;
	}

	clone(): WGRBufferVisibility {
		const v = new WGRBufferVisibility();
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
export { WGRBufferVisibility };

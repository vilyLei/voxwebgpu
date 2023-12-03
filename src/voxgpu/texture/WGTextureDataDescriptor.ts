import { GPUSamplerDescriptor } from "../gpu/GPUSamplerDescriptor";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";

interface RTTTextureDataDescriptor {
	uuid?: string;
	width?: number;
	height?: number;
	texture?: GPUTexture;
	textureView?: GPUTextureView;
	type?: string;
}
interface DataTextureDataDescriptor {
	uuid?: string;
	width?: number;
	height?: number;
	texture?: GPUTexture;
	textureView?: GPUTextureView;
	data?: NumberArrayType;
	datas?: NumberArrayType[];
	type?: string;
}
interface TextureDataDescriptor {
	uid?: number;
	uuid?: string;
	generateMipmaps?: boolean;
	flipY?: boolean;
	format?: string;
	dimension?: string;
	viewDimension?: string;
	url?: string;
	urls?: string[];
	image?: WebImageType;
	images?: WebImageType[];
	rttTexture?: RTTTextureDataDescriptor;
	dataTexture?: DataTextureDataDescriptor;
	shdVarName?: string;

	sampler?: GPUSamplerDescriptor;
	update?(): void;
}
interface WGTextureDataDescriptor extends TextureDataDescriptor {
	diffuse?: TextureDataDescriptor;
	/**
	 * base color map
	 */
	baseColor?: TextureDataDescriptor;
	albedo?: TextureDataDescriptor;
	normal?: TextureDataDescriptor;
	ao?: TextureDataDescriptor;
	metallic?: TextureDataDescriptor;
	roughness?: TextureDataDescriptor;
	specularEnv?: TextureDataDescriptor;
	arm?: TextureDataDescriptor;
	parallax?: TextureDataDescriptor;
	displacement?: TextureDataDescriptor;
	specular?: TextureDataDescriptor;
	glossiness?: TextureDataDescriptor;
	emissive?: TextureDataDescriptor;
	anisotropic?: TextureDataDescriptor;
	/**
	 * likes the mask texture
	 */
	opacity?: TextureDataDescriptor;
	/**
	 * hight map
	 */
	heightmap?: TextureDataDescriptor;
}

function texDescriptorFilter(d: WGTextureDataDescriptor): TextureDataDescriptor {
	if (!d) {
		return d;
	}
	let rd = d;
	if (d.diffuse) {
		rd = d.diffuse;
		if (!rd.shdVarName) {
			rd.shdVarName = "diffuse";
		}
		return rd;
	}
	if (d.baseColor) {
		rd = d.baseColor;
		if (!rd.shdVarName) {
			rd.shdVarName = "baseColor";
		}
		return rd;
	}
	if (d.albedo) {
		rd = d.albedo;
		if (!rd.shdVarName) {
			rd.shdVarName = "albedo";
		}
		return rd;
	}

	if (d.normal) {
		rd = d.normal;
		if (!rd.shdVarName) {
			rd.shdVarName = "normal";
		}
		return rd;
	}
	if (d.ao) {
		rd = d.ao;
		if (!rd.shdVarName) {
			rd.shdVarName = "ao";
		}
		return rd;
	}
	if (d.metallic) {
		rd = d.metallic;
		if (!rd.shdVarName) {
			rd.shdVarName = "metallic";
		}
	}

	if (d.roughness) {
		rd = d.roughness;
		if (!rd.shdVarName) {
			rd.shdVarName = "roughness";
		}
		return rd;
	}
	if (d.specularEnv) {
		rd = d.specularEnv;
		if (!rd.shdVarName) {
			rd.shdVarName = "specularEnv";
		}
		return rd;
	}
	if (d.arm) {
		rd = d.arm;
		rd.shdVarName = "arm";
	}

	if (d.parallax) {
		rd = d.parallax;
		if (!rd.shdVarName) {
			rd.shdVarName = "parallax";
		}
		return rd;
	}
	if (d.heightmap) {
		rd = d.heightmap;
		if (!rd.shdVarName) {
			rd.shdVarName = "heightmap";
		}
	}
	if (d.displacement) {
		rd = d.displacement;
		if (!rd.shdVarName) {
			rd.shdVarName = "displacement";
		}
		return rd;
	}

	if (d.opacity) {
		rd = d.opacity;
		if (!rd.shdVarName) {
			rd.shdVarName = "opacity";
		}
		return rd;
	}
	if (d.emissive) {
		rd = d.emissive;
		if (!rd.shdVarName) {
			rd.shdVarName = "emissive";
		}
		return rd;
	}
	if (d.specular) {
		rd = d.specular;
		if (!rd.shdVarName) {
			rd.shdVarName = "specular";
		}
		return rd;
	}

	return rd;
}
export {
	texDescriptorFilter,
	RTTTextureDataDescriptor,
	DataTextureDataDescriptor,
	TextureDataDescriptor,
	WGTextureDataDescriptor
};

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
	anisotropic ?: TextureDataDescriptor;
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
		rd.shdVarName = "diffuse";
		return rd;
	}
	if (d.baseColor) {
		rd = d.baseColor;
		rd.shdVarName = "baseColor";
		return rd;
	}
	if (d.albedo) {
		rd = d.albedo;
		rd.shdVarName = "albedo";
		return rd;
	}

	if (d.normal) {
		rd = d.normal;
		rd.shdVarName = "normal";
		return rd;
	}
	if (d.ao) {
		rd = d.ao;
		rd.shdVarName = "ao";
		return rd;
	}
	if (d.metallic) {
		rd = d.metallic;
		rd.shdVarName = "metallic";
	}

	if (d.roughness) {
		rd = d.roughness;
		rd.shdVarName = "roughness";
		return rd;
	}
	if (d.specularEnv) {
		rd = d.specularEnv;
		rd.shdVarName = "specularEnv";
		return rd;
	}
	if (d.arm) {
		rd = d.arm;
		rd.shdVarName = "arm";
	}

	if (d.parallax) {
		rd = d.parallax;
		rd.shdVarName = "parallax";
		return rd;
	}
	if (d.heightmap) {
		rd = d.heightmap;
		rd.shdVarName = "heightmap";
	}
	if (d.displacement) {
		rd = d.displacement;
		rd.shdVarName = "displacement";
		return rd;
	}

	if (d.opacity) {
		rd = d.opacity;
		rd.shdVarName = "opacity";
		return rd;
	}
	if (d.emissive) {
		rd = d.emissive;
		rd.shdVarName = "emissive";
		return rd;
	}
	if (d.specular) {
		rd = d.specular;
		rd.shdVarName = "specular";
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

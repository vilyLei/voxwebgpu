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
}
interface WGTextureDataDescriptor extends TextureDataDescriptor {
	diffuse?: TextureDataDescriptor;
	color?: TextureDataDescriptor;
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
}

function texDescriptorFilter(d: WGTextureDataDescriptor): TextureDataDescriptor {
	if(!d) {
		return d;
	}
	let rd = d;
	if (d.diffuse) {
		rd = d.diffuse;
		rd.shdVarName = "diffuse";
	}
	if (d.color) {
		rd = d.color;
		rd.shdVarName = "color";
	}
	if (d.albedo) {
		rd = d.albedo;
		rd.shdVarName = "albedo";
	}

	if (d.normal) {
		rd = d.normal;
		rd.shdVarName = "normal";
	}
	if (d.ao) {
		rd = d.ao;
		rd.shdVarName = "ao";
	}
	if (d.metallic) {
		rd = d.metallic;
		rd.shdVarName = "metallic";
	}

	if (d.roughness) {
		rd = d.roughness;
		rd.shdVarName = "roughness";
	}
	if (d.specularEnv) {
		rd = d.specularEnv;
		rd.shdVarName = "specularEnv";
	}
	if (d.arm) {
		rd = d.arm;
		rd.shdVarName = "arm";
	}

	if (d.parallax) {
		rd = d.parallax;
		rd.shdVarName = "parallax";
	}
	// if (d.height) {
	// 	rd = d.height;
	// 	rd.shdVarName = "height";
	// }
	if (d.displacement) {
		rd = d.displacement;
		rd.shdVarName = "displacement";
	}

	if (d.specular) {
		rd = d.specular;
		rd.shdVarName = "specular";
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

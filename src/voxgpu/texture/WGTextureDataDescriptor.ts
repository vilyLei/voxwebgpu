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
	multisampled?: boolean;
}
interface TextureDataDescriptor {
	multisampled?: boolean;
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

	src?: string;

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

export {
	RTTTextureDataDescriptor,
	DataTextureDataDescriptor,
	TextureDataDescriptor,
	WGTextureDataDescriptor
};

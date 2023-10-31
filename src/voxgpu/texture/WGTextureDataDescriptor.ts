interface TextureDataDescriptor {
	generateMipmaps?: boolean;
	flipY?: boolean;
	format?: string;
	dimension?: string;
	url?: string;
	urls?: string[];
	image?: WebImageType;
	images?: WebImageType[];
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
	height?: TextureDataDescriptor;
	displacement?: TextureDataDescriptor;
	specular?: TextureDataDescriptor;
}
export {
	TextureDataDescriptor,
	WGTextureDataDescriptor
};

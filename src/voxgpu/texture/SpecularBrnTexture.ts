import { TextureDataDescriptor,WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
class SpecularBrnTexture implements WGTextureDataDescriptor {
	specular: TextureDataDescriptor = { uuid: "SpecularBrnTexture", dataTexture: { datas: [] as Uint8Array[], width: 128, height: 128 }, viewDimension: '2d', format: "rgba8unorm", generateMipmaps: false };
	constructor(datas: Uint8Array[], width: number, height: number) {
		let tex = this.specular.dataTexture;
		tex.datas = datas;
		tex.width = width;
		tex.height = height;
		console.log('SpecularBrnTexture::constructor() ...');
	}
	set data(data: Uint8Array) {
		this.specular.dataTexture.data = data;
	}
	set datas(datas: Uint8Array[]) {
		this.specular.dataTexture.datas = datas;
	}
	set width(w: number) {
		this.specular.dataTexture.width = w;
	}
	set height(h: number) {
		this.specular.dataTexture.width = h;
	}
}
export { SpecularBrnTexture }

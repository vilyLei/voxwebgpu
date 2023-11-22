import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUSampler } from "../gpu/GPUSampler";
import { GPUTexture } from "../gpu/GPUTexture";
import { GPUTextureView } from "../gpu/GPUTextureView";
import {
	texDescriptorFilter,
	RTTTextureDataDescriptor,
	DataTextureDataDescriptor,
	TextureDataDescriptor,
	WGTextureDataDescriptor
} from "./WGTextureDataDescriptor";
import { GPUExtent3DDict, GPUTextureDescriptor } from "../gpu/GPUTextureDescriptor";

interface WGTextureDataType {
	uid?: number;
	generateMipmaps?: boolean;
	flipY?: boolean;
	format?: string;
	dimension?: string;
	viewDimension?: string;
	build(ctx: WebGPUContext): GPUTexture;
	destroy(): void;
}
class WGTextureData implements WGTextureDataType {
	protected mTex: GPUTexture;
	protected mDesc: TextureDataDescriptor;
	uid?: number;
	generateMipmaps = true;
	flipY = false;
	format = "rgba8unorm";
	dimension = "2d";
	viewDimension = "2d";
	shdVarName = "";
	constructor() {}

	setDescripter(descriptor: TextureDataDescriptor): WGTextureData {
		if (descriptor.generateMipmaps) this.generateMipmaps = descriptor.generateMipmaps;
		if (descriptor.flipY) this.flipY = descriptor.flipY;
		if (descriptor.format) this.format = descriptor.format;
		if (descriptor.dimension) this.dimension = descriptor.dimension;
		if (descriptor.viewDimension) this.viewDimension = descriptor.viewDimension;
		if (descriptor.shdVarName) this.shdVarName = descriptor.shdVarName;
		this.mDesc = descriptor;
		return this;
	}
	build(ctx: WebGPUContext): GPUTexture {
		return this.mTex;
	}
	destroy(): void {}
}
class WGImageTextureData extends WGTextureData {
	protected mImgs: WebImageType[];
	protected mUrl: string;

	constructor() {
		super();
	}

	build(ctx: WebGPUContext): GPUTexture {
		if (this.mImgs && !this.mTex) {
			console.log("WGImageTextureData::build(), this.mImgs: ", this.mImgs, this.viewDimension);
			switch (this.viewDimension) {
				case "cube":
					this.mTex = ctx.texture.createTexCubeByImages(this.mImgs, this.generateMipmaps, this.flipY, this.format, this.mUrl);
					this.uid = this.mTex.uid;
					if(this.mDesc)this.mDesc.uid = this.mTex.uid;
					break;
				case "2d":
					this.mTex = ctx.texture.createTex2DByImage(this.mImgs[0], this.generateMipmaps, this.flipY, this.format, this.mUrl);
					this.uid = this.mTex.uid;
					if(this.mDesc)this.mDesc.uid = this.mTex.uid;
					break;
				default:
					console.error("Illegal operation !!!");
					break;
			}
			this.mTex.url = this.mUrl;
		}
		return this.mTex;
	}
}
class WGRTTTextureData extends WGTextureData {
	private mTexData: RTTTextureDataDescriptor;
	constructor() {
		super();
	}
	setDescripter(descriptor: TextureDataDescriptor): WGRTTTextureData {
		super.setDescripter(descriptor);
		this.mTexData = descriptor.rttTexture;
		return this;
	}
	build(ctx: WebGPUContext): GPUTexture {
		const td = this.mTexData;
		if (td && !this.mTex) {
			if (td.texture) {
				console.log("apply a rtt texture into a WGRTTTextureData instance.");
				this.mTex = td.texture;
				this.uid = this.mTex.uid;
				if(this.mDesc)this.mDesc.uid = this.mTex.uid;
			}
		}
		return this.mTex;
	}
}
class WGDataTextureData extends WGTextureData {
	private mTexData: DataTextureDataDescriptor;
	constructor() {
		super();
	}
	setDescripter(descriptor: TextureDataDescriptor): WGDataTextureData {
		super.setDescripter(descriptor);
		this.mTexData = descriptor.dataTexture;
		return this;
	}
	build(ctx: WebGPUContext): GPUTexture {
		const desc = this.mDesc;
		const td = this.mTexData;
		if (td && desc) {
			if (!this.mTex) {

				if (td.texture) {
					console.log("apply a texture in the WGDataTextureData instance: ", this);
					this.mTex = td.texture;
					this.uid = this.mTex.uid;
					if(this.mDesc)this.mDesc.uid = this.mTex.uid;
				} else if (td.data) {
					console.log("create a texture in the WGDataTextureData instance: ", this);
					this.mTex = ctx.texture.createDataTexture([td.data], td.width, td.height, {format: desc.format}, desc.generateMipmaps);
					this.uid = this.mTex.uid;
					if(this.mDesc)this.mDesc.uid = this.mTex.uid;
				} else if (td.datas && td.datas.length > 0) {
					console.log("create a custom mipmap texture in the WGDataTextureData instance: ", this);
					this.mTex = ctx.texture.createDataTexture(td.datas, td.width, td.height, {format: desc.format, viewDimension: this.viewDimension}, desc.generateMipmaps);
					this.uid = this.mTex.uid;
					if(this.mDesc)this.mDesc.uid = this.mTex.uid;
				}
			}
		}
		return this.mTex;
	}
}
class WGImage2DTextureData extends WGImageTextureData {
	constructor(url?: string) {
		super();
		if (url && url !== "") {
			this.initByURL(url);
		}
	}
	setImage(image: WebImageType): WGImageTextureData {
		this.mImgs = [image];
		return this;
	}

	setDescripter(descriptor: TextureDataDescriptor): WGImage2DTextureData {
		super.setDescripter(descriptor);
		if (this.dimension !== "2d") {
			throw Error("Illegal Operation !!!");
		}
		if (descriptor.url) {
			this.initByURL(descriptor.url);
		} else if (descriptor.urls) {
			this.initByURL(descriptor.urls[0]);
		}
		if (descriptor.images) {
			this.setImage(descriptor.images[0]);
		} else if (descriptor.image) {
			this.setImage(descriptor.image);
		}
		return this;
	}
	private initByURL(url: string): WGImageTextureData {
		this.mUrl = url;
		fetch(url).then((response: Response): void => {
			try {
				response.blob().then((blob: Blob): void => {
					createImageBitmap(blob).then((bmp: ImageBitmap): void => {
						this.mImgs = [bmp];
					});
				});
			} catch (e) {
				console.error("WGImageTextureData::initByURL(), error url: ", url);
				return null;
			}
		});
		return this;
	}
}
class WGImageCubeTextureData extends WGImageTextureData {
	constructor(urls?: string[]) {
		super();
		if (urls && urls.length >= 6 && urls[0] !== "") {
			this.initCubeMapURLs(urls);
		}
	}
	setImages(images: WebImageType[]): WGImageTextureData {
		this.mImgs = images;
		return this;
	}

	setDescripter(descriptor: TextureDataDescriptor): WGImageCubeTextureData {
		super.setDescripter(descriptor);
		if (this.viewDimension !== "cube") {
			throw Error("Illegal Operation !!!");
		}
		if (descriptor.urls) {
			this.initCubeMapURLs(descriptor.urls);
		}
		if (descriptor.images) {
			this.setImages(descriptor.images);
		}
		return this;
	}
	async createCubeMapImgsByUrls(urls: string[]) {
		const promises = urls.map(async (src: string) => {
			const response = await fetch(src);
			return createImageBitmap(await response.blob());
		});
		const images = await Promise.all(promises);
		return images;
	}
	private initCubeMapURLs(urls: string[]): WGImageTextureData {
		this.viewDimension = "cube";
		this.mUrl = urls[0];
		this.createCubeMapImgsByUrls(urls).then((imgs: ImageBitmap[]): void => {
			this.mImgs = imgs;
		});
		return this;
	}
}
interface WGTextureType {
	shdVarName: string;
	texture?: GPUTexture;
	flipY?: boolean;
	name?: string;
	dimension?: string;
	viewDimension?: string;
	format?: string;
	generateMipmaps?: boolean;
	data?: WGTextureDataType;
}
interface WGTexSamplerType {
	shdVarName: string;
	sampler: GPUSampler;
	name?: string;
}
class WGTexture implements WGTextureType {
	name = "WGTexture";

	format?: string;
	shdVarName = "";

	generateMipmaps = true;
	flipY = true;
	dimension = "2d";
	viewDimension = '2d';

	texture: GPUTexture;

	view?: GPUTextureView;
	data?: WGTextureDataType;
}
class WGTexSampler implements WGTexSamplerType {
	name = "WGTexture";

	shdVarName = "";
	sampler: GPUSampler;
}
interface WGTextureWrapperParam {
	texture: WGTextureType;
	sampler?: WGTexSamplerType;
}
class WGTextureWrapper {
	bindGroupIndex = 0;

	texture: WGTexture;
	sampler?: WGTexSampler;

	constructor(param: WGTextureWrapperParam) {
		const tp = param.texture;
		this.texture = new WGTexture();
		const tex = this.texture as any;
		for (var k in tp) {
			tex[k] = (tp as any)[k];
		}
		if (this.texture.data) {
			let td = this.texture.data;
			if (td.generateMipmaps) tex.generateMipmaps = td.generateMipmaps;
			if (td.flipY) tex.flipY = td.flipY;
			if (td.dimension) tex.dimension = td.dimension;
			if (td.viewDimension) tex.viewDimension = td.viewDimension;
			if (td.format) tex.format = td.format;
			// if (td.format) tex.format = td.;
		}

		const sp = param.sampler;
		if (sp) {
			this.sampler = new WGTexSampler();
			const s = this.sampler as any;
			for (var k in sp) {
				s[k] = (sp as any)[k];
			}
		}
	}
	destroy(): void {}
}

const __$texDataMap: Map<string, WGTextureData> = new Map();
function createDataWithDescriptor(descriptor: WGTextureDataDescriptor): WGTextureData {
	// let dimension = descriptor.dimension ? descriptor.dimension : "2d";

	if(descriptor && descriptor.update !== undefined) {
		descriptor.update();
	}
	let td: WGTextureData;
	const dpt = texDescriptorFilter(descriptor);
	let viewDimension = dpt.viewDimension ? dpt.viewDimension : "2d";
	const map = __$texDataMap;
	let key = "";
	if (dpt.url !== undefined) {
		key = dpt.url;
	} else if (dpt.urls !== undefined) {
		key = dpt.urls[0];
	}
	if (key === "") {
		if (dpt.uuid !== undefined) {
			key = dpt.uuid;
		}
	}
	if (key !== "") {
		if (map.has(key)) {
			return map.get(key);
		}
	}

	switch (viewDimension) {
		case "2d":
			console.log("create a 2d texture instance ...");
			if (dpt.rttTexture) {
				td = new WGRTTTextureData().setDescripter(dpt);
			} else if (dpt.dataTexture) {
				td = new WGDataTextureData().setDescripter(dpt);
			} else {
				td = new WGImage2DTextureData().setDescripter(dpt);
			}
			break;
		case "cube":
			console.log("create a cube texture instance ...");
			if (dpt.dataTexture) {
				td = new WGDataTextureData().setDescripter(dpt);
			} else {
				td = new WGImageCubeTextureData().setDescripter(dpt);
			}
			break;
		default:
			throw Error("Illegal Operation !!!");
			break;
	}
	if (td) {
		if (key !== "") {
			map.set(key, td);
		}
	}
	return td;
}
export {
	texDescriptorFilter,
	createDataWithDescriptor,
	WGTextureData,
	WGTextureDataDescriptor,
	WGImageTextureData,
	WGRTTTextureData,
	WGImage2DTextureData,
	WGImageCubeTextureData,
	WGTextureDataType,
	WGTextureType,
	WGTexSamplerType,
	WGTexture,
	WGTextureWrapperParam,
	WGTextureWrapper
};

import { GPUTexture } from "./GPUTexture";
import { WebGPUContextImpl } from "./WebGPUContextImpl";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";
import { GPUTextureDescriptor } from "./GPUTextureDescriptor";
import { toFloat16 } from "../utils/CommonUtils";
import { packRGB9E5UFloat } from "../utils/Conversion";

class WebGPUTextureContext {
	private mWGCtx: WebGPUContextImpl;
	private static sUid = 0;
	readonly mipmapGenerator = new GPUMipmapGenerator();

	constructor(wgCtx?: WebGPUContextImpl) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContextImpl): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.mipmapGenerator.initialize(wgCtx.device);
		}
	}

	createFloatRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};
		if (descriptor.format === undefined) {
			descriptor.format = "rgba16float";
		}
		return this.createRTTTexture(descriptor);
	}
	createColorRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};
		if (descriptor.format === undefined) {
			descriptor.format = "bgra8unorm";
		}
		return this.createRTTTexture(descriptor);
	}
	createDepthRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};
		if (descriptor.format === undefined) {
			descriptor.format = "depth24plus";
		}
		return this.createRTTTexture(descriptor);
	}
	createRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};

		const ctx = this.mWGCtx;
		if (descriptor.size === undefined) {
			descriptor.size = [ctx.canvasWidth, ctx.canvasHeight];
		}
		if (descriptor.format === undefined) {
			descriptor.format = ctx.presentationFormat;
		}
		if (descriptor.usage === undefined) {
			descriptor.usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;
		}
		return this.createTexture(descriptor);
	}

	async createTex2DByUrl(url: string, generateMipmaps = true, flipY = false, format = "rgba8unorm") {
		const response = await fetch(url);

		let imageBitmap: ImageBitmap;
		try {
			imageBitmap = await createImageBitmap(await response.blob());
		} catch (e) {
			console.error("createMaterialTexture(), error url: ", url);
			return null;
		}
		const tex = this.createTex2DByImage(imageBitmap, generateMipmaps, flipY, format, url);
		tex.url = url;
		return tex;
	}

	createTexture(descriptor: GPUTextureDescriptor): GPUTexture {
		const device = this.mWGCtx.device;
		let tex = device.createTexture(descriptor);
		tex.uid = WebGPUTextureContext.sUid++;
		return tex;
	}
	createTex2DByImage(image: WebImageType, generateMipmaps = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {
		const device = this.mWGCtx.device;
		const mipmapG = this.mipmapGenerator;
		const mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const textureDescriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 1 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
		};
		let tex = this.createTexture(textureDescriptor);
		device.queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex }, [image.width, image.height]);
		if (generateMipmaps) {
			mipmapG.generateMipmap(tex, textureDescriptor);
		}
		return tex;
	}

	async createTexCubeByUrls(urls: string[], generateMipmaps = true, flipY = false, format = "rgba8unorm") {
		const promises = urls.map(async (src: string) => {
			const response = await fetch(src);
			return createImageBitmap(await response.blob());
		});
		const images = await Promise.all(promises);
		const tex = this.createTexCubeByImages(images, generateMipmaps, flipY, (format = "rgba8unorm"));
		tex.url = urls[0];
		return tex;
	}

	createTexCubeByImages(images: WebImageType[], generateMipmaps = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {
		let image = images[0];

		const queue = this.mWGCtx.queue;
		const mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const textureDescriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 6 },
			format,
			mipLevelCount,
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
		};
		const tex = this.createTexture(textureDescriptor);
		for (let i = 0; i < images.length; ++i) {
			image = images[i];
			queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex, origin: [0, 0, i] }, [image.width, image.height]);
		}
		if (generateMipmaps) {
			this.mipmapGenerator.generateMipmap(tex, textureDescriptor);
		}
		return tex;
	}
	createDataTexture(
		srcData: NumberArrayType,
		width: number,
		height: number,
		descriptor?: GPUTextureDescriptor,
		generateMipmaps = false
	): GPUTexture {
		if (!descriptor) descriptor = {};
		if (descriptor.format === undefined) {
			descriptor.format = "rgba8unorm";
		}
		console.log("descriptor.format: ", descriptor.format);
		switch (descriptor.format) {
			case "rgba16float":
				return this.create64BitsTexture(srcData, width, height, descriptor, generateMipmaps);
				break;
			case "bgra8unorm":
			case "rgba8unorm":
			case "rgb9e5ufloat":
				return this.create32BitsTexture(srcData, width, height, descriptor, generateMipmaps);
			default:
				break;
		}
		throw Error('Illegal operation !!!');
	}

	create32BitsTexture(
		srcData: NumberArrayType,
		width: number,
		height: number,
		descriptor?: GPUTextureDescriptor,
		generateMipmaps = false
	): GPUTexture {
		generateMipmaps = generateMipmaps === true ? true : false;
		if (!descriptor) descriptor = {};
		if (descriptor.format === undefined) {
			descriptor.format = "rgba8unorm";
		}
		let wgctx = this.mWGCtx;

		let data: Uint16Array | Float32Array | Uint8Array | Int32Array;

		if (!descriptor) descriptor = {};
		if (!descriptor.usage) {
			descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
		}
		if (!descriptor.size) {
			descriptor.size = [width, height];
		}
		console.log('this.create32BitsTexture(), descriptor.format: ', descriptor.format);
		let bytesPerRow = width * 4;
		let rowsPerImage = height;
		switch (descriptor.format) {
			case 'rgb9e5ufloat':
				generateMipmaps = false;
				let tot = srcData.length / 3;
				let k = 0;
				data = new Int32Array(tot);
				for (let i = 0; i < tot; ++i) {
					data[i] = packRGB9E5UFloat(srcData[k], srcData[k + 1], srcData[k + 2]);
					k += 3;
				}
				break;
			default:
				data = srcData as Uint8Array;
				if (data.byteLength === undefined) {
					data = new Uint8Array(srcData);
				}
				break;
		}

		let mipLevelCount = generateMipmaps ? calculateMipLevels(width, height) : 1;
		if(mipLevelCount < 1) mipLevelCount = 1;
		descriptor.mipLevelCount = mipLevelCount;
		const texture = wgctx.device.createTexture(descriptor);

		wgctx.device.queue.writeTexture({ texture }, data, { bytesPerRow, rowsPerImage }, { width, height });

		console.log('this.create32BitsTexture(), mipmapGenerator: ', (generateMipmaps && mipLevelCount > 1));
		if (generateMipmaps && mipLevelCount > 1) {
			this.mipmapGenerator.generateMipmap(texture, descriptor);
		}
		return texture;
	}
	create64BitsTexture(
		srcData: NumberArrayType,
		width: number,
		height: number,
		descriptor?: GPUTextureDescriptor,
		generateMipmaps = false
	): GPUTexture {
		generateMipmaps = generateMipmaps === true ? true : false;
		if (!descriptor.format) {
			descriptor.format = "rgba16float";
		}

		let wgctx = this.mWGCtx;
		let data: Uint16Array | Float32Array | Int32Array;
		switch (descriptor.format) {
			case "rgba16float":
				data = new Uint16Array(srcData.length);
				for (let i = 0; i < srcData.length; ++i) {
					data[i] = toFloat16(srcData[i]);
				}
				break;
			default:
				break;
		}
		if (!descriptor) descriptor = {};
		if (!descriptor.usage) {
			descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
		}
		if (!descriptor.size) {
			descriptor.size = [width, height];
		}
		let bytesPerRow = width * 8;

		let mipLevelCount = generateMipmaps ? calculateMipLevels(width, height) : 1;
		if(mipLevelCount < 1) mipLevelCount = 1;
		descriptor.mipLevelCount = mipLevelCount;
		const texture = wgctx.device.createTexture(descriptor);
		wgctx.device.queue.writeTexture({ texture }, data, { bytesPerRow, rowsPerImage: height }, { width, height });
		if (generateMipmaps && mipLevelCount > 1) {
			this.mipmapGenerator.generateMipmap(texture, descriptor);
		}
		return texture;
	}
}
export { WebGPUTextureContext };

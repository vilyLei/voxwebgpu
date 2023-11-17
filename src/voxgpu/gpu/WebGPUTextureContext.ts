import { GPUTexture } from "./GPUTexture";
import { WebGPUContextImpl } from "./WebGPUContextImpl";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";
import { GPUExtent3DDict, GPUTextureDescriptor } from "./GPUTextureDescriptor";
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
		if (!descriptor.format) {
			descriptor.format = "rgba16float";
		}
		return this.createRTTTexture(descriptor);
	}
	createColorRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};
		if (!descriptor.format) {
			descriptor.format = "bgra8unorm";
		}
		return this.createRTTTexture(descriptor);
	}
	createDepthRTTTexture(descriptor?: GPUTextureDescriptor): GPUTexture {
		if (!descriptor) descriptor = {};
		if (!descriptor.format) {
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
		if (!descriptor.format) {
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
	private checkTexDesc(descriptor: GPUTextureDescriptor, generateMipmaps: boolean): boolean {
		if (descriptor.usage === undefined) descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
		if (descriptor.mipLevelCount < 1) descriptor.mipLevelCount = 1;
		generateMipmaps = generateMipmaps && descriptor.mipLevelCount > 1;
		if (generateMipmaps) {
			descriptor.usage = descriptor.usage | GPUTextureUsage.RENDER_ATTACHMENT;
		}
		return generateMipmaps;
	}
	createTex2DByImage(image: WebImageType, generateMipmaps = true, flipY = false, format = "rgba8unorm", label?: string): GPUTexture {
		const device = this.mWGCtx.device;
		const mipmapG = this.mipmapGenerator;
		let mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const descriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 1 },
			format,
			mipLevelCount
		};

		generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);

		let tex = this.createTexture(descriptor);
		device.queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex }, [image.width, image.height]);
		if (generateMipmaps) {
			tex = mipmapG.generateMipmap(tex, descriptor);
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
		let mipLevelCount = generateMipmaps ? calculateMipLevels(image.width, image.height) : 1;
		const descriptor = {
			dimension: "2d",
			size: { width: image.width, height: image.height, depthOrArrayLayers: 6 },
			format,
			mipLevelCount
		};

		generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);
		console.log("createTexCubeByImages(), descriptor: ", descriptor);
		let tex = this.createTexture(descriptor);
		for (let i = 0; i < images.length; ++i) {
			image = images[i];
			queue.copyExternalImageToTexture({ source: image, flipY }, { texture: tex, origin: [0, 0, i] }, [image.width, image.height]);
		}
		if (generateMipmaps) {
			tex = this.mipmapGenerator.generateMipmap(tex, descriptor);
		}
		return tex;
	}
	createDataTexture(
		srcDatas: NumberArrayType[],
		width: number,
		height: number,
		descriptor?: GPUTextureDescriptor,
		generateMipmaps = false
	): GPUTexture {
		if (!descriptor) descriptor = {};
		if (!descriptor.format) {
			descriptor.format = "rgba8unorm";
		}
		console.log("descriptor.format: ", descriptor.format);
		switch (descriptor.format) {
			case "rgba16float":
				return this.create64BitsTexture(srcDatas, width, height, descriptor, generateMipmaps);
				break;
			case "bgra8unorm":
			case "rgba8unorm":
			case "rgb9e5ufloat":
				return this.create32BitsTexture(srcDatas, width, height, descriptor, generateMipmaps);
			default:
				break;
		}
		throw Error("Illegal operation !!!");
	}

	create32BitsTexture(
		srcDatas: NumberArrayType[],
		width: number,
		height: number,
		descriptor?: GPUTextureDescriptor,
		generateMipmaps = false
	): GPUTexture {
		generateMipmaps = generateMipmaps === true ? true : false;
		if (!descriptor) descriptor = {};
		if (!descriptor.format) {
			descriptor.format = "rgba8unorm";
		}
		let wgctx = this.mWGCtx;

		let datas: (Uint16Array | Float32Array | Uint8Array | Int32Array)[] = new Array(srcDatas.length);

		if (!descriptor) descriptor = {};
		if (!descriptor.usage) {
			descriptor.usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
		}
		if (!descriptor.size) {
			descriptor.size = [width, height];
		}
		console.log("this.create32BitsTexture(), descriptor.format: ", descriptor.format);

		switch (descriptor.format) {
			case "rgb9e5ufloat":
				generateMipmaps = false;
				for (let i = 0; i < srcDatas.length; ++i) {
					let rd = srcDatas[i];
					let tot = rd.length / 3;
					let k = 0;
					let data = new Int32Array(tot);
					for (let j = 0; j < tot; ++j) {
						data[j] = packRGB9E5UFloat(rd[k], rd[k + 1], rd[k + 2]);
						k += 3;
					}
					datas[i] = data;
				}
				break;
			default:
				for (let i = 0; i < srcDatas.length; ++i) {
					let data = srcDatas[i] as Uint8Array;
					// console.log('data instanceof Uint8Array: ', data instanceof Uint8Array, ', data.BYTES_PER_ELEMENT: ', data.BYTES_PER_ELEMENT);
					if (data.byteLength === undefined || data.BYTES_PER_ELEMENT != 1) {
						data = new Uint8Array(srcDatas[i]);
					}
					datas[i] = data;
				}
				break;
		}

		descriptor.mipLevelCount = generateMipmaps || datas.length > 1 ? calculateMipLevels(width, height) : 1;

		generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);

		let texture: GPUTexture;
		if (descriptor.viewDimension === "cube") {
			descriptor.size = { width, height, depthOrArrayLayers: 6 };
			texture = wgctx.device.createTexture(descriptor);
			let k = 0;
			for (let i = 0; i < descriptor.mipLevelCount; i++) {
				let bytesPerRow = width * 4;
				let rowsPerImage = height;
				for (let j = 0; j < 6; j++) {
					wgctx.device.queue.writeTexture(
						{ texture, mipLevel: i, origin: [0, 0, j] },
						datas[k++],
						{ bytesPerRow, rowsPerImage },
						{ width, height }
					);
				}
				width >>= 1;
				height >>= 1;
			}
		} else {
			let rowsPerImage = height;
			texture = wgctx.device.createTexture(descriptor);
			for (let i = 0; i < datas.length; ++i) {
				let bytesPerRow = width * 4;
				wgctx.device.queue.writeTexture({ texture, mipLevel: i, origin: [0, 0] }, datas[i], { bytesPerRow, rowsPerImage }, { width, height });
				width >>= 1;
				height >>= 1;
			}
		}

		// console.log("this.create32BitsTexture(), mipmapGenerator: ", generateMipmaps);
		if (generateMipmaps) {
			texture = this.mipmapGenerator.generateMipmap(texture, descriptor);
		}
		return texture;
	}
	create64BitsTexture(
		srcDatas: NumberArrayType[],
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
		let datas: (Uint16Array | Float32Array | Int32Array)[] = new Array(srcDatas.length);
		switch (descriptor.format) {
			case "rgba16float":
				for (let i = 0; i < srcDatas.length; i++) {
					let sd = srcDatas[i];
					let data = new Uint16Array(sd.length);
					for (let j = 0; j < sd.length; ++j) {
						data[j] = toFloat16(sd[j]);
					}
					datas[i] = data;
				}

				break;
			default:
				break;
		}
		if (!descriptor) descriptor = {};
		if (!descriptor.size) {
			descriptor.size = [width, height];
		}

		descriptor.mipLevelCount = generateMipmaps ? calculateMipLevels(width, height) : 1;

		generateMipmaps = this.checkTexDesc(descriptor, generateMipmaps);

		let texture: GPUTexture;
		if (descriptor.viewDimension === "cube") {
			descriptor.size = { width, height, depthOrArrayLayers: 6 };
			texture = wgctx.device.createTexture(descriptor);
			let k = 0;
			for (let i = 0; i < descriptor.mipLevelCount; i++) {
				let bytesPerRow = width * 8;
				let rowsPerImage = height;
				for (let j = 0; j < 6; j++) {
					wgctx.device.queue.writeTexture(
						{ texture, mipLevel: i, origin: [0, 0, j] },
						datas[k++],
						{ bytesPerRow, rowsPerImage },
						{ width, height }
					);
				}
				width >>= 1;
				height >>= 1;
			}
		} else {
			texture = wgctx.device.createTexture(descriptor);
			for (let i = 0; i < datas.length; i++) {
				let bytesPerRow = width * 8;
				wgctx.device.queue.writeTexture({ texture, mipLevel: i }, datas[i], { bytesPerRow, rowsPerImage: height }, { width, height });
				width >>= 1;
				height >>= 1;
			}
		}
		if (generateMipmaps) {
			texture = this.mipmapGenerator.generateMipmap(texture, descriptor);
		}
		return texture;
	}
}
export { WebGPUTextureContext };

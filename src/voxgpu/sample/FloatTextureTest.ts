import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";
import { calculateMipLevels } from "../utils/CommonUtils";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import rgbTexWGSL from "./shaders/fixScreenPlaneRGBTex.frag.wgsl";
import brn4BytesTexWGSL from "./shaders/fixScreenPlaneBrn4BytesTex.frag.wgsl";

export class FloatTextureTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FloatTextureTest::initialize() ...");
		let callback = (): void => {
			this.initScene();
			this.initAssets();
		};
		this.mRscene.initialize({ callback });
	}
	private initAssets(): void {
		let hdrBrnEnabled = true;
		let envMapUrl = "static/bytes/spe.mdf";
		if (hdrBrnEnabled) {
			envMapUrl = "static/bytes/spb.bin";
		}
		new HttpFileLoader().load(envMapUrl, (buf: ArrayBuffer, url: string): void => {
			console.log("buf: ", buf);
			this.buildFloatTex(hdrBrnEnabled, buf);
		});
	}
	private buildFloatTex(hdrBrnEnabled: boolean, buf: ArrayBuffer): void {
		if (hdrBrnEnabled) {
			// this.parseHdrBrn( buf );
			// this.parseSingleHdrBrn(buf);
			this.parseMultiHdrBrn(buf);
		} else {
			this.parseFloat(buf);
		}
	}
	private parseFloat(buffer: ArrayBuffer): void {
		let begin = 0;
		let width = 128;
		let height = 128;

		let component: number = 3;

		let fs32 = new Float32Array(buffer);
		let subArr: Float32Array;
		let mipLevelCount = calculateMipLevels(width, height);
		console.log("mipLevelCount: ", mipLevelCount);

		// let tex: IFloatCubeTexture = this.texture as IFloatCubeTexture;
		// tex.toRGBFormat();
		// tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
		// tex.magFilter = TextureConst.LINEAR;

		for (let j = 0; j < mipLevelCount; j++) {
			for (let i = 0; i < 6; i++) {
				const size = width * height * component;
				subArr = fs32.subarray(begin, begin + size);
				if (i == 0) {
					console.log("width: ", width, ", subArr.length: ", subArr.length);
				}
				// tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
				begin += size;
			}
			width >>= 1;
			height >>= 1;
		}
	}
	private parseHdrBrn(buffer: ArrayBuffer): void {
		let data16 = new Uint16Array(buffer);
		let currBytes = new Uint8Array(buffer);
		let begin = 0;
		let width = data16[4];
		let height = data16[5];
		let mipMapMaxLv = data16[6];
		console.log("parseHdrBrn, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
		let size = 0;
		let bytes = currBytes.subarray(32);
		// let tex: IBytesCubeTexture = this.texture as IBytesCubeTexture;
		// tex.mipmapEnabled = mipMapMaxLv <= 1;
		// tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
		// tex.magFilter = TextureConst.LINEAR;
		let dataU8: Uint8Array;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = width * height * 4;
				console.log("parseHdrBrn, j: ", j, ",", width, "height: ", height);
				// dataU8 = bytes.subarray(begin, begin + size);
				dataU8 = bytes.slice(begin, begin + size);
				// tex.setDataFromBytesToFaceAt(i, bytes.subarray(begin, begin + size), width, height, j);
				begin += size;
				j = 100;
				break;
			}
			// width >>= 1;
			// height >>= 1;
		}
		let tex = {
			diffuse: { uuid: "texBrn", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: false }
		};

		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: brn4BytesTexWGSL, uuid: "br4BytesFrag" }
		};
		let rc = this.mRscene;
		let entity = new FixScreenPlaneEntity({ shaderSrc, extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}

	private parseSingleHdrBrn(buffer: ArrayBuffer): void {
		let data16 = new Uint16Array(buffer);
		let currBytes = new Uint8Array(buffer);
		let begin = 0;
		let width = data16[4];
		let height = data16[5];
		let mipMapMaxLv = data16[6];
		console.log("parseHdrBrn, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
		let size = 0;
		let bytes = currBytes.subarray(32);
		let dataU8: Uint8Array;
		let flag = true;
		let dstI = 0;
		let dstJ = 3;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = width * height * 4;
				if (i == dstI && j == dstJ) {
					console.log("parseHdrBrn, j: ", j, ",", width, "height: ", height);
					dataU8 = bytes.subarray(begin, begin + size);
					flag = false;
					break;
				}
				begin += size;
			}
			if (flag) {
				width >>= 1;
				height >>= 1;
			} else {
				break;
			}
		}

		let rc = this.mRscene;
		let tb = rc.getWGCtx().texture;

		let texture = tb.create32BitsTexture([dataU8], width, height, {format: "rgba8unorm"}, false);
		let tex = {
			// diffuse: { uuid: "texBrn", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: false }
			diffuse: { uuid: "texSingleBrn", dataTexture: { texture }, format: "rgba8unorm", generateMipmaps: false }
		};
		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: brn4BytesTexWGSL, uuid: "br4BytesFrag" }
		};
		let entity = new FixScreenPlaneEntity({shadinguuid: "texSingleBrn", shaderSrc, extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}

	private parseMultiHdrBrn(buffer: ArrayBuffer): void {
		let data16 = new Uint16Array(buffer);
		let currBytes = new Uint8Array(buffer);
		let begin = 0;
		let width = data16[4];
		let height = data16[5];
		let mipMapMaxLv = data16[6];
		console.log("parseMultiHdrBrn, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
		let size = 0;
		let bytes = currBytes.subarray(32);
		let dataU8: Uint8Array;
		let datas: Uint8Array[] = [];
		let flag = true;
		let dstI = 0;
		let dstJ = 3;

		let currW = width;
		let currH = height;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = currW * currW * 4;
				// if (i == dstI && j == dstJ) {
				if (i == dstI) {
					console.log("parseMultiHdrBrn, j: ", j, ", currW: ", currW, ", currH: ", currH);
					dataU8 = bytes.subarray(begin, begin + size);
					datas.push(dataU8);
				}
				begin += size;
			}
			currW >>= 1;
			currH >>= 1;
		}

		let rc = this.mRscene;
		let tb = rc.getWGCtx().texture;

		let texture = tb.create32BitsTexture(datas, width, height, {format: "rgba8unorm"}, false);
		let tex = {
			// diffuse: { uuid: "texBrn", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: false }
			diffuse: { uuid: "texMultiBrn", dataTexture: { texture }, format: "rgba8unorm", generateMipmaps: false }
		};
		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: brn4BytesTexWGSL, uuid: "br4BytesFrag" }
		};
		let entity = new FixScreenPlaneEntity({shadinguuid: "texMultiBrnM", shaderSrc, extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}
	private applyRGBAFloat16Tex(): void {
		let rc = this.mRscene;

		let width = 256;
		let height = 256;

		let stride = 4;
		let dataFs32 = new Float32Array(width * height * stride);
		let scale = 1.0;
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * stride;
				dataFs32[k] = scale * (j / width);
				dataFs32[k + 1] = scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width)));
				dataFs32[k + 2] = scale * (1.0 - (i * j) / (width * height));
				dataFs32[k + 3] = scale * 1.0;
			}
		}
		const tex = {
			diffuse: { uuid: "tex0", dataTexture: { data: dataFs32, width, height }, format: "rgba16float", generateMipmaps: true }
		};

		// let shaderSrc = {
		// 	vert:{code: vertWGSL, uuid: 'vert'},
		// 	frag:{code: rgbTexWGSL, uuid: 'frag'},
		// }
		let entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [tex] });
		// entity.color = [0.1, 0.1, 0.1, 0.1];
		rc.addEntity(entity);
	}
	//
	private applyRGB9E5UFloatTex(): void {
		let rc = this.mRscene;

		let width = 8;
		let height = 8;
		let stride = 3;
		let dataFs32 = new Float32Array(width * height * stride);
		let scale = 1.0;
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * stride;
				dataFs32[k] = scale * (j / width);
				dataFs32[k + 1] = scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width)));
				dataFs32[k + 2] = scale * (1.0 - (i * j) / (width * height));
			}
		}

		const tex = {
			diffuse: { uuid: "texreb9e5u", dataTexture: { data: dataFs32, width, height }, format: "rgb9e5ufloat", generateMipmaps: true }
		};

		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: rgbTexWGSL, uuid: "frag" }
		};
		let entity = new FixScreenPlaneEntity({shadinguuid: 'texreb9e5uM', shaderSrc, extent: [-0.8, -0.8, 0.8, 0.8], textures: [tex] });
		// entity.color = [1.0,1.0,1.0, 1.0];
		rc.addEntity(entity);
	}

	private applyRGBA8Tex(): void {
		let rc = this.mRscene;

		let width = 256;
		let height = 256;

		let stride = 4;
		let dataU8 = new Uint8Array(width * height * stride);
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * 4;
				dataU8[k] = ((j / width) * 255) | 0;
				dataU8[k + 1] = ((0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width))) * 255) | 0;
				dataU8[k + 2] = ((1.0 - (i * j) / (width * height)) * 255) | 0;
				dataU8[k + 3] = 255;
			}
		}

		let tex = {
			diffuse: { uuid: "texRGBA8Tex", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: false }
		};

		let entity = new FixScreenPlaneEntity({shadinguuid: "texRGBA8", extent: [-.3, -.3, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}
	private initScene(): void {
		// this.applyRGBAFloat16Tex();
		this.applyRGB9E5UFloatTex();
		// this.applyRGBA8Tex();
	}

	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";
import { calculateMipLevels } from "../utils/CommonUtils";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import brn4BytesTexWGSL from "./shaders/fixScreenPlaneBrn4BytesTex.frag.wgsl";

import vertCubeWGSL from "./shaders/vertEntityOnlyVtx.vert.wgsl";
import fragCubeWGSL from "./shaders/cubemap.frag.wgsl";
import fragCubeBrnWGSL from "./shaders/cubemapBrn.frag.wgsl";

import { WGRShderSrcType, WGMaterial } from "../material/WGMaterial";
import { GeomDataBuilder } from "../geometry/GeomDataBuilder";
import { Entity3D } from "../entity/Entity3D";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularBrnTexture } from "../texture/SpecularBrnTexture";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

export class Set32BitsTexMipmapData {
	private mRscene = new RendererScene();
	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("Set32BitsTexMipmapData::initialize() ...");
		let callback = (): void => {
			// this.initScene();
			// this.initAssets();

			this.initBrnTexEnvMap();

			this.initEvent();
		};
		this.mRscene.initialize({ callback });
	}
	private initBrnTexEnvMap(): void {
		let shaderSrc = {
			vert: { code: vertCubeWGSL, uuid: "vert" },
			frag: { code: fragCubeBrnWGSL, uuid: "brnCubeFrag" }
		};
		let envMapUrl = "static/bytes/spb.bin";
		let tex = new SpecularEnvBrnTexture().load(envMapUrl);
		const material = this.createMaterial(shaderSrc, tex);
		this.createCubeMapEntity([material]);
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	private initAssets(): void {
		let hdrBrnEnabled = true;
		let envMapUrl = "static/bytes/spb.bin";

		new HttpFileLoader().load(envMapUrl, (buf: ArrayBuffer, url: string): void => {
			console.log("buf: ", buf);
			this.buildFloatTex(hdrBrnEnabled, buf);

			this.initializeImgCubeMap();
		});
	}
	private buildFloatTex(hdrBrnEnabled: boolean, buf: ArrayBuffer): void {
		this.parseMultiHdrBrn(buf);
		// this.parseCubeHdrBrn(buf);
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
		let dstI = 0;

		let currW = width;
		let currH = height;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = currW * currW * 4;
				if (i == dstI) {
					// console.log("parseMultiHdrBrn, j: ", j, ", currW: ", currW, ", currH: ", currH);
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

		// let texture = tb.create32BitsTexture(datas, width, height, { format: "rgba8unorm" }, false);
		// let tex = {
		// 	// diffuse: { uuid: "texBrn", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: false }
		// 	diffuse: { uuid: "texMultiBrn", dataTexture: { texture }, format: "rgba8unorm", generateMipmaps: false }
		// };
		let tex = new SpecularBrnTexture(datas, width, height);
		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: brn4BytesTexWGSL, uuid: "br4BytesFrag" }
		};
		let entity = new FixScreenPlaneEntity({ shadinguuid: "texMultiBrnM", shaderSrc, extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		entity.color = [1.0, 1.0, 1.0, 4.0];
		rc.addEntity(entity);
	}
	private parseCubeHdrBrn(buffer: ArrayBuffer): void {
		let data16 = new Uint16Array(buffer);
		let currBytes = new Uint8Array(buffer);
		let begin = 0;
		let width = data16[4];
		let height = data16[5];
		let mipMapMaxLv = data16[6];
		console.log("parseCubeHdrBrn, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
		let size = 0;
		let bytes = currBytes.subarray(32);
		let dataU8: Uint8Array;
		let datas: Uint8Array[] = [];

		let currW = width;
		let currH = height;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = currW * currW * 4;
				// console.log("parseMultiHdrBrn, j: ", j, ", currW: ", currW, ", currH: ", currH);
				dataU8 = bytes.subarray(begin, begin + size);
				datas.push(dataU8);
				begin += size;
			}
			currW >>= 1;
			currH >>= 1;
		}

		let rc = this.mRscene;
		let tb = rc.getWGCtx().texture;
		// let texture = tb.create32BitsTexture(datas, width, height, { viewDimension: 'cube', dimension: "2d", format: "rgba8unorm", size: { width, height, depthOrArrayLayers: 6} }, false);
		let tex = {
			diffuse: {
				uuid: "cubeTexBrn",
				dataTexture: { datas: datas, width, height },
				viewDimension: "cube",
				format: "rgba8unorm",
				generateMipmaps: false
			}
			// diffuse: { uuid: "texCubeBrn", viewDimension: "cube", dataTexture: { texture }, format: "rgba8unorm", generateMipmaps: false }
		};

		let shaderSrc = {
			vert: { code: vertCubeWGSL, uuid: "vert" },
			frag: { code: fragCubeBrnWGSL, uuid: "brnCubeFrag" }
		};
		// let entity = new FixScreenPlaneEntity({ shadinguuid: "texCubeBrnM", shaderSrc, extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		// entity.color = [1.0, 1.0, 1.0, 4.0];
		// rc.addEntity(entity);

		const material = this.createMaterial(shaderSrc, tex);
		this.createCubeMapEntity([material]);
	}

	private initializeImgCubeMap(): void {
		console.log("ImgCubeMap::initialize() ...");
		let urls = [
			"static/assets/hw_morning/morning_ft.jpg",
			"static/assets/hw_morning/morning_bk.jpg",
			"static/assets/hw_morning/morning_up.jpg",
			"static/assets/hw_morning/morning_dn.jpg",
			"static/assets/hw_morning/morning_rt.jpg",
			"static/assets/hw_morning/morning_lf.jpg"
		];
		// // const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		const diffuseTex = { diffuse: { uuid: "imgCubeTex", urls, viewDimension: "cube" } };

		const shaderCodeSrc = {
			vert: { code: vertCubeWGSL, uuid: "vertCubeShdCode" },
			frag: { code: fragCubeWGSL, uuid: "fragCubeShdCode" }
		};

		// const material = this.createMaterial(shaderCodeSrc, diffuseTex );
		// this.createCubeMapEntity([material]);
	}

	private createMaterial(shaderCodeSrc: WGRShderSrcType, tex: WGTextureDataDescriptor): WGMaterial {
		// // let texDataList = [new WGImageCubeTextureData(urls)];

		const texTotal = 1;
		const material = new WGMaterial({
			shadinguuid: "cube-base-material-tex" + texTotal,
			shaderCodeSrc
		}).addTextures([tex]);

		return material;
		// return new WGMaterial();
	}
	private createCubeMapEntity(materials: WGMaterial[]): Entity3D {
		let rc = this.mRscene;

		const rgd = this.geomData.createCube(200);
		const geometry = new WGGeometry().addAttribute({ position: rgd.vs }).setIndices(rgd.ivs);

		const entity = new Entity3D({ materials, geometry });
		rc.addEntity(entity);
		return entity;
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

		let entity = new FixScreenPlaneEntity({ shadinguuid: "texRGBA8", extent: [-0.3, -0.3, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}
	private initScene(): void {
		// this.applyRGBA8Tex();
	}

	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";

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
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { BoxEntity } from "../entity/BoxEntity";

import baseVertWGSL from "../material/shader/wgsl/pbr.vert.wgsl";
import baseFragWGSL from "../material/shader/wgsl/pbr.frag.wgsl";

import { SphereEntity } from "../entity/SphereEntity";
import { AxisEntity } from "../entity/AxisEntity";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { ModelEntity } from "../entity/ModelEntity";
import { ConeEntity } from "../entity/ConeEntity";

export class BaseMaterialTest {
	private mRscene = new RendererScene();
	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("BaseMaterialTest::initialize() ...");

		this.mRscene.initialize({ canvasWith: 1024, canvasHeight: 1024, rpassparam: { multisampleEnabled: true } });
		this.initScene();
		this.initEvent();
	}
	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		let textures = [this.hdrEnvtex, albedoTex, normalTex, aoTex, roughnessTex, metallicTex];
		return textures;
	}
	private initEntities(): void {
		let rc = this.mRscene;

		// let axis = new AxisEntity();
		// axis.transform.setPosition([0,200,0]);
		// rc.addEntity(axis);

		let shaderSrc = {
			vert: { code: baseVertWGSL, uuid: "baseVert" },
			frag: { code: baseFragWGSL, uuid: "baseFrag" }
		};

		let lightData = this.createLightData();

		// let textures = this.createTextures("wall");
		let textures = this.createTextures("gold");
		// let textures = this.createTextures('plastic');
		// let textures = this.createTextures("rusted_iron");
		let uniformValues = [
			{ data: new Float32Array([0.9, 1.0, 0.1, 1]), shdVarName: "ambient" },
			{storage: { data: new Float32Array([1, 0.7, 1, 0,  0, 0.0, 0, 0]), shdVarName: "armsParams" }},
			{ data: new Float32Array([2.0, 2.0, 0, 0]), shdVarName: "uvParam" },
			{storage: { data: new Float32Array([
				1, 1, 1, 1,
				0, 0, 0, 0,
				1, 0.1, 1, 1,
				0, 0, 0.07, 1,
				1, 1, 1, 1
			]), shdVarName: "params" }},
			{ data: new Uint32Array([1, 0,0,0]), shdVarName: "lightParam" },
			lightData.lights,
			lightData.lightColors
		];
		// let box = new BoxEntity({shaderSrc, minPos: [-100, -100, -100], maxPos: [100, 100, 100]});
		// rc.addEntity(box);

		let sph = new SphereEntity({ shaderSrc, radius: 100, latitudeNumSegments: 30, longitudeNumSegments: 30, textures, uniformValues });
		sph.transform.setPosition([0, 0, 300]);
		rc.addEntity(sph);

		// let cone = new ConeEntity({shaderSrc, radius: 100, height: 260, longitudeNumSegments: 30, textures, uniformValues});
		// rc.addEntity(cone);
		textures = this.createTextures("rusted_iron");
		let monkey = new ModelEntity({
			shaderSrc,
			textures,
			uniformValues,
			modelUrl: "static/assets/draco/monkey.drc",
			transform: { position: [0, 0, 0], scale: [100, 100, 100], rotation: [0, 90, 0] }
		});
		rc.addEntity(monkey);
	}
	private createLightData(): { lights: WGRBufferData; lightColors: WGRBufferData } {
		let lights = { storage: { data: new Float32Array([0.0, 200.0, 0, 0.0001]), shdVarName: "lights" } };
		let lightColors = { storage: { data: new Float32Array([5.0, 5.0, 5.0, 0.0001]), shdVarName: "lightColors" } };

		return { lights, lightColors };
	}
	private initScene(): void {
		this.initEntities();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};

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

		const shaderSrc = {
			vert: { code: vertCubeWGSL, uuid: "vertCubeShdCode" },
			frag: { code: fragCubeWGSL, uuid: "fragCubeShdCode" }
		};

		const material = this.createMaterial(shaderSrc, diffuseTex);
		this.createCubeMapEntity([material]);
	}

	private createMaterial(shaderSrc: WGRShderSrcType, tex: WGTextureDataDescriptor): WGMaterial {
		const texTotal = 1;
		const material = new WGMaterial({
			shadinguuid: "cube-base-material-tex" + texTotal,
			shaderSrc
		}).addTextures([tex]);

		return material;
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

	run(): void {
		this.mRscene.run();
	}
}

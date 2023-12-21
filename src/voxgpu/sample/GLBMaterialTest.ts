import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BaseMaterial } from "../material/BaseMaterial";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { MtLightDataDescriptor } from "../material/mdata/MtLightDataDescriptor";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { BillboardEntity } from "../entity/BillboardEntity";
import { ModelEntity } from "../entity/ModelEntity";
import { CylinderRandomRange } from "../utils/RandomRange";

export class GLBMaterialTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("GLBMaterialTest::initialize() ...");
		this.loadImg();
	}
	initSys(): void {

		this.mRscene.initialize({
			canvasWith: 768,
			canvasHeight: 1024,
			mtplEnabled: true,
			rpassparam:
			{
				multisampled: true
			}
		});
		this.initScene();
		this.initEvent();
	}
	private mPixels: Uint8ClampedArray;
	private mPixelsW = 128;
	private mPixelsH = 128;
	getRandomColor(s?: number): ColorDataType {
		if (s === undefined) {
			s = 1.0;
		}
		let i = 5;
		let j = Math.floor(Math.random() * this.mPixelsW);
		let k = i * this.mPixelsW + j;
		let vs = this.mPixels;
		k *= 4;
		let cs = [s * vs[k] / 255.0, s * vs[k + 1] / 255.0, s * vs[k + 2] / 255.0];
		return cs;
	}
	private loadImg(): void {
		let img = new Image();
		img.onload = evt => {
			this.mPixelsW = img.width;
			this.mPixelsH = img.height;
			let canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			this.mPixels = ctx.getImageData(0, 0, img.width, img.height).data;
			this.initSys();
		}
		img.src = 'static/assets/colorPalette.jpg';
	}
	private mLightData: MtLightDataDescriptor;
	private createLightData(): MtLightDataDescriptor {
		let ld = { pointLights: [], directionLights: [], spotLights: [] } as MtLightDataDescriptor;

		let space = new CylinderRandomRange();
		space.minRadius = 130;
		space.maxRadius = 260;
		space.minHeight = 10;
		space.maxHeight = 300;
		space.initialize();
		space.setSpaceScale(1.0, 1.0, 0.5);

		let total = 5;
		let scale = 8.0;
		for (let i = 0; i < total; ++i) {
			for (let j = 0; j < total; ++j) {
				space.calc();
				let position = space.value;
				let color = this.getRandomColor(scale);
				let factor1 = 0.0001;
				let factor2 = 0.0002;
				let pLight = new PointLight({ color, position, factor1, factor2 });
				ld.pointLights.push(pLight);
				if (Math.random() > 0.5) {
					space.calc();
					position = space.value;
					color = this.getRandomColor(scale);
					let direction = [(Math.random() - 0.5) * 8, -1, (Math.random() - 0.5) * 8];
					let degree = Math.random() * 10 + 5;
					let spLight = new SpotLight({ position, color, direction, degree, factor1, factor2 });
					ld.spotLights.push(spLight);
				}
			}
		}
		let dLight = new DirectionLight({ color: [0.5, 0.5, 0.5], direction: [-1, -1, 0] });
		ld.directionLights.push(dLight);
		return ld;
	}
	private createBillboard(pv: Vector3DataType, c: ColorDataType, type: number): void {
		let rc = this.mRscene;
		let diffuseTex0 = { diffuse: { url: "static/assets/flare_core_03.jpg" } };
		if (type > 1) {
			diffuseTex0 = { diffuse: { url: "static/assets/circleWave_disp.png" } };
		}
		let billboard = new BillboardEntity({ size: 5, textures: [diffuseTex0] });
		billboard.color = c;
		billboard.alpha = 1;
		billboard.transform.setPosition(pv);
		rc.addEntity(billboard, {layerIndex:1});
	}
	private createBillboards(): void {
		let lightData = this.mLightData;
		let pls = lightData.pointLights;
		for (let i = 0; i < pls.length; i++) {
			let lp = pls[i];
			this.createBillboard(lp.position, lp.color, 1);
		}
		let spls = lightData.spotLights;
		for (let i = 0; i < spls.length; i++) {
			let lp = spls[i];
			this.createBillboard(lp.position, lp.color, 2);
		}
	}
	private initScene(): void {

		let rc = this.mRscene;

		let mtpl = rc.renderer.mtpl;

		this.mLightData = this.createLightData();

		this.createBillboards();
		mtpl.light.lightData = this.mLightData;
		mtpl.shadow.intensity = 0.4;
		mtpl.shadow.radius = 1;

		this.mTexType = 1;
		let position = [0, 0, 0];
		let materials = this.createMaterials(true);
		let modelEntity = new ModelEntity({
			transform: { position },
			materials,
			modelUrl: "static/assets/draco/portal.drc"
		});
		rc.addEntity(modelEntity);
		
		this.mTexType = 0;
		position = [0, 0, 0];
		materials = this.createMaterials(true, true, "back",[3,3]);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent: [-600, -600, 1200, 1200],
			transform: { position }
		});
		rc.addEntity(plane);


	}
	
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		const parallaxTex = { parallax: { url: `static/assets/pbr/${ns}/parallax.jpg` } };
		// const emissiveTex = { emissive: { url: `static/assets/color_07.jpg` } };
		let envTex = { specularEnv: {} };
		let textures = [
			envTex,
			albedoTex,
			normalTex,
			aoTex,
			roughnessTex,
			metallicTex,
			parallaxTex
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private createArmTextures2(): WGTextureDataDescriptor[] {
		
		let flipY = true;
		const albedoTex = { albedo: { url: `static/assets/glb/portal/portal_img2.jpg`, flipY } };
		const normalTex = { normal: { url: `static/assets/glb/portal/portal_img3.jpg`, flipY } };
		const armTex = { arm: { url: `static/assets/glb/portal/portal_img1.jpg`, flipY } };
		const emissive = { emissive: { url: `static/assets/glb/portal/portal_img0.jpg`, flipY } };
		let envTex = { specularEnv: {} };
		let textures = [
			envTex,
			albedoTex,
			normalTex,
			armTex,
			emissive
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private createArmTextures(): WGTextureDataDescriptor[] {
		let flipY = false;
		const albedoTex = { albedo: { url: `static/assets/pbrtex/rough_plaster_broken_diff_1k.jpg`, flipY } } as WGTextureDataDescriptor;
		const normalTex = { normal: { url: `static/assets/pbrtex/rough_plaster_broken_nor_1k.jpg`, flipY } };
		const armTex = { arm: { url: `static/assets/pbrtex/rough_plaster_broken_arm_1k.jpg`, flipY } };
		const parallaxTex = { parallax: { url: `static/assets/pbrtex/rough_plaster_broken_disp_1k.jpg`, flipY } };
		let envTex = { specularEnv: {} };
		let textures = [
			envTex,
			albedoTex,
			normalTex,
			armTex,
			parallaxTex
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private mTexType = 0;
	private createMaterials(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {

		let textures0 = this.mTexType < 1 ? this.createTextures("wall") : this.createArmTextures2();

		let material0 = this.createMaterial(textures0, ["solid"], 'less', faceCullMode);
		this.applyMaterialPPt(material0, shadowReceived, shadow);
		let list = [material0];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}

	private applyMaterialPPt(material: BaseMaterial, shadowReceived = false, shadow = true): void {
		let ppt = material.property;
		ppt.ambient.value = [0.2, 0.2, 0.2];
		let cvs = this.getRandomColor(1.0) as number[];// * 0.7;
		cvs[0] = cvs[0] * 0.3 + 0.7;
		cvs[1] = cvs[1] * 0.3 + 0.7;
		cvs[2] = cvs[2] * 0.3 + 0.7;
		ppt.albedo.value = cvs;
		ppt.arms.roughness = Math.random() * 0.95 + 0.05;
		ppt.arms.metallic = 0.2;
		ppt.armsBase.value = [0, 0.2, 0];
		ppt.specularFactor.value = [0.1, 0.1, 0.1];

		ppt.shadow = shadow;
		ppt.lighting = true;

		ppt.shadowReceived = shadowReceived;
	}
	private createMaterial(textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', faceCullMode = 'back'): BaseMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes,
			depthCompare
		};
		let material = new BaseMaterial({ pipelineDefParam });
		material.addTextures(textures);
		return material;
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => { };
	run(): void {
		this.mRscene.run();
	}
}

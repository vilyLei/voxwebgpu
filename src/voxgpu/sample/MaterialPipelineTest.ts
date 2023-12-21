import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../material/WGMaterial";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { createLocalLightsData } from "./utils/lightUtil";
import { BaseMaterial } from "../material/BaseMaterial";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";

export class MaterialPipelineTest {
	private mRscene = new RendererScene();

	initialize(): void {

		console.log("MaterialPipelineTest::initialize() ...");
		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			mtplEnabled: true,
			rpassparam: { multisampled: true }
		});

		this.initScene();
		this.initEvent();
	}

	private initScene(): void {

		let rc = this.mRscene;

		let mtpl = rc.renderer.mtpl;

		mtpl.light.data = createLocalLightsData([0, 300, 0], 600, 5.0);
		mtpl.shadow.intensity = 0.7;

		let position = [-230.0, 100.0, -200.0];
		let materials = this.createMaterials(true);
		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position
			},
			materials
		});
		rc.addEntity(sph);

		position = [10.0, 100.0, -180.0];
		materials = this.createMaterials(true);
		let box = new BoxEntity({
			minPos: [-30, -30, -30],
			maxPos: [130, 230, 80],
			transform: {
				position,
				rotation: [50, 130, 80]
			},
			materials
		});
		rc.addEntity(box);

		position = [160.0, 100.0, 210.0];
		materials = this.createMaterials(true);
		let torus = new TorusEntity({
			transform: {
				position,
				rotation: [50, 30, 80]
			},
			materials
		});
		rc.addEntity(torus);

		position = [130.0, 220.0, 180.0];
		materials = this.createMaterials(true);
		torus = new TorusEntity({
			transform: {
				position,
				rotation: [50, 30, 80]
			},
			materials
		});
		rc.addEntity(torus);

		position = [0, -1, 0];
		materials = this.createMaterials(true, false);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent: [-600, -600, 1200, 1200],
			transform: { position }
		});
		rc.addEntity(plane);
	}


	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createBaseTextures(): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbrtex/rough_plaster_broken_diff_1k.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbrtex/rough_plaster_broken_nor_1k.jpg` } };
		const armTex = { arm: { url: `static/assets/pbrtex/rough_plaster_broken_arm_1k.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			armTex
		] as WGTextureDataDescriptor[];
		return textures;
	}

	private createMaterials(shadowReceived = false, shadow = true, uvParam?: number[]): BaseMaterial[] {
		let textures0 = this.createBaseTextures();

		let material0 = this.createMaterial(textures0);
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
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		property.param.scatterIntensity = 32;

		property.shadow = shadow;
		property.lighting = true;

		property.shadowReceived = shadowReceived;
	}
	private createMaterial(textures: WGTextureDataDescriptor[]): BaseMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true
		};
		let material = new BaseMaterial({ pipelineDefParam });
		material.addTextures(textures);
		return material;
	}
	private mouseDown = (evt: MouseEvent): void => {}
	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../material/WGMaterial";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { createLightData } from "./utils/lightUtil";
import { BaseMaterial } from "../material/BaseMaterial";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";

export class MaterialPipelineFog {
	private mRscene = new RendererScene();

	initialize(): void {

		console.log("MaterialPipelineFog::initialize() ...");
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

		mtpl.light.data = createLightData([0, 300, 0], 600, 5.0);
		mtpl.shadow.param.intensity = 0.7;
		mtpl.fog.fogColor.value = [0.3, 0.7, 0.2];

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

		position = [0, 0, 0];
		materials = this.createMaterials(false, false, 'front');
		let envBox = new CubeEntity(
			{
				cubeSize: 2050.0,
				normalScale: -1.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(envBox);
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

	private createMaterials(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {
		let textures0 = this.createBaseTextures();

		let material0 = this.createMaterial(textures0, faceCullMode);
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
		ppt.ambient.value = [0.0, 0.2, 0.2];
		ppt.albedo.value = [0.7, 0.7, 0.3];
		ppt.arms.roughness = 0.8;
		ppt.armsBase.value = [0, 0, 0];
		ppt.param.scatterIntensity = 32;

		ppt.shadow = shadow;
		ppt.lighting = true;

		ppt.shadowReceived = shadowReceived;
		ppt.fogExp2Enabled = true;
	}
	private createMaterial(textures: WGTextureDataDescriptor[], faceCullMode = 'back'): BaseMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
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

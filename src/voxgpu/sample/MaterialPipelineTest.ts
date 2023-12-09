import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../material/WGMaterial";
import { Entity3D } from "../entity/Entity3D";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import Vector3 from "../math/Vector3";
import {createLightData} from "./utils/lightUtil";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";

export class MaterialPipelineTest {
	private mRscene = new RendererScene();

	initialize(): void {

		console.log("MaterialPipelineTest::initialize() ...");
		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam: { multisampled: true }
		});
		
		this.initShadowScene();
		this.initEvent();
	}

	private mEntities: Entity3D[] = [];
	
	private initShadowScene(): void {

		let rc = this.mRscene;
		
		let mtpl = rc.renderer.mtpl;

		// let position = [-230.0, 100.0, -200.0];
		let position = [0,0,0];
		let lightParam = createLightData(position, 600, 5.0);
		mtpl.light.data = lightParam;
		let shadow = mtpl.vsm;
		shadow.initialize(rc);
		shadow.param.intensity = 0.7;

		position = [-230.0, 100.0, -200.0];
		let materials = this.createMaterials(true);
		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position
			},
			materials
		});
		this.mEntities.push(sph);
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
		this.mEntities.push(box);
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
		this.mEntities.push(torus);
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
		this.mEntities.push(torus);
		rc.addEntity(torus);
		//*/

		mtpl.vsm.addEntities( this.mEntities );

		this.initSceneShadow();
	}

	private initSceneShadow(): void {
		this.applyShadowReceiveDisp(true);
	}
	
	private applyShadowReceiveDisp(shadowReceived = false): void {
		let rc = this.mRscene;
		let position = new Vector3(0, -1, 0);
		let materials = this.createMaterials(shadowReceived);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent:[-600,-600,1200,1200],
			transform: { position }
		});
		rc.addEntity(plane);
	}

	// private buildShadowCamFrame(): void {
	// 	let rc = this.mRscene;
	// 	let mtpl = rc.renderer.mtpl;
	// 	const graph = mtpl.vsm.passGraph;
	// 	const cam = graph.shadowCamera;
	// 	const rsc = this.mRscene;
	// 	let frameColors = [[1.0, 0.0, 1.0], [0.0, 1.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 1.0]];
	// 	let boxFrame = new BoundsFrameEntity({ vertices8: cam.frustum.vertices, frameColors });
	// 	rsc.addEntity(boxFrame);
	// }
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
	
	private createMaterials(shadowReceived = false, uvParam?: number[]): BasePBRMaterial[] {
		let textures0 = this.createBaseTextures();
		
		let material0 = this.createMaterial(textures0);
		this.applyMaterialPPt(material0, shadowReceived);

		let list = [material0];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}
	private applyMaterialPPt(material: BasePBRMaterial, shadowReceived = false): void {
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		property.param.scatterIntensity = 32;

		property.lighting = true;
		
		property.shadowReceived = shadowReceived;
	}
	private createMaterial(textures: WGTextureDataDescriptor[]): BasePBRMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true
		};
		let material = new BasePBRMaterial({ pipelineDefParam });
		material.addTextures(textures);
		return material;
	}
	private mFlag = -1;
	private mouseDown = (evt: MouseEvent): void => {
		let rc = this.mRscene;
		let mtpl = rc.renderer.mtpl;
		this.mFlag ++;
		if(this.mFlag == 0) {
			// mtpl.vsm.addEntities( this.mEntities );
		}else if(this.mFlag == 1) {
			// this.initSceneShadow();
		}
	};
	run(): void {
		this.mRscene.run();
	}
}

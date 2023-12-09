import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGMaterial, WGRShderSrcType, WGTextureDataDescriptor } from "../material/WGMaterial";
import { Entity3D } from "../entity/Entity3D";

import shadowDepthWGSL from "../material/shader/shadow/shadowDepth.wgsl";
import Camera from "../view/Camera";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { ShadowOccBlurMaterial } from "../material/ShadowOccBlurMaterial";
import Matrix4 from "../math/Matrix4";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { WGRPassColorAttachment } from "../render/pipeline/WGRPassColorAttachment";

import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import Vector3 from "../math/Vector3";
import {createLightData} from "./utils/lightUtil";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { IRendererScene } from "../rscene/IRendererScene";

export class ShadowMaterialSysTest {
	private mRscene = new RendererScene();

	initialize(): void {

		console.log("ShadowMaterialSysTest::initialize() ...");
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
		mtpl.shadow.initialize(rc);

		position = [-230.0, 100.0, -200.0];
		let materials = this.createMaterials();
		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position
			},
			materials
		});
		this.mEntities.push(sph);
		rc.addEntity(sph);

		mtpl.shadow.addEntities( this.mEntities );
		/*
		position = [160.0, 100.0, -210.0];
		materials = this.createMaterials();
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
		materials = this.createMaterials();
		let torus = new TorusEntity({
			transform: {
				position,
				rotation: [50, 30, 80]
			},
			materials
		});
		this.mEntities.push(torus);
		rc.addEntity(torus);
		//*/
		// this.buildShadow();

		// this.initSceneShadow();

		let graph = mtpl.shadow.passGraph;

		let extent = [-0.95, -0.95, 0.4, 0.4];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.shadowDepthRTT }] });
		rc.addEntity(entity);

		extent = [-0.5, -0.95, 0.4, 0.4];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.occVRTT }] });
		rc.addEntity(entity);

		extent = [-0.05, -0.95, 0.4, 0.4];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.occHRTT }] });
		rc.addEntity(entity);
		this.buildShadowCamFrame();
	}

	private initSceneShadow(): void {
		this.applyShadowReceiveDisp(true);
	}
	
	private applyShadowReceiveDisp(shadowReceived = false): void {
		let rc = this.mRscene;
		console.log("applyShadowReceiveDisp() ...");
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

	private buildShadowCamFrame(): void {
		let rc = this.mRscene;
		let mtpl = rc.renderer.mtpl;
		const graph = mtpl.shadow.passGraph;
		const cam = graph.shadowCamera;
		const rsc = this.mRscene;
		let frameColors = [[1.0, 0.0, 1.0], [0.0, 1.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 1.0]];
		let boxFrame = new BoundsFrameEntity({ vertices8: cam.frustum.vertices, frameColors });
		rsc.addEntity(boxFrame);
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	
	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createBaseTextures(shadowReceived = false): WGTextureDataDescriptor[] {
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
		let textures0 = this.createBaseTextures(shadowReceived);
		
		let material0 = this.createMaterial(textures0, ["solid"]);
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
	private createMaterial(textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: 'back',
			blendModes,
			depthCompare
		};
		let material = new BasePBRMaterial({ pipelineDefParam });
		material.setLightParam(lightParam);
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
			this.initSceneShadow();
		}
	};
	run(): void {
		this.mRscene.run();
	}
}

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
import { ShadowReceiveMaterial } from "../material/ShadowReceiveMaterial";
import Matrix4 from "../math/Matrix4";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { WGRPassColorAttachment } from "../render/pipeline/WGRPassColorAttachment";

import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import Vector3 from "../math/Vector3";
import {createLightData} from "./utils/lightUtil";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
class ShadowPassGraph extends WGRPassNodeGraph {

	private entities: Entity3D[] = [];
	private mDepthMaterials: WGMaterial[];

	shadowDepthRTT = { uuid: "rtt-shadow-depth", rttTexture: {}, shdVarName: 'shadowData' };
	depAttachment: WGRPassColorAttachment = {
		texture: this.shadowDepthRTT,
		// green clear background color
		clearValue: { r: 1, g: 1, b: 1, a: 1.0 },
		loadOp: "clear",
		storeOp: "store"
	};

	occVRTT = { uuid: "rtt-shadow-occV", rttTexture: {}, shdVarName: 'shadowData' };
	occHRTT = { uuid: "rtt-shadow-occH", rttTexture: {}, shdVarName: 'shadowData' };
	occVEntity: FixScreenPlaneEntity;
	occHEntity: FixScreenPlaneEntity;

	shadowBias = -0.0005;
	shadowRadius = 2.0;
	shadowMapW = 512;
	shadowMapH = 512;
	shadowViewW = 1300;
	shadowViewH = 1300;

	shadowCamera: Camera;
	constructor() {
		super();
	}
	private initMaterial(): void {
		const shadowDepthShdSrc = {
			shaderSrc: { code: shadowDepthWGSL, uuid: "shadowDepthShdSrc" }
		};
		this.mDepthMaterials = [this.createDepthMaterial(shadowDepthShdSrc)];
	}
	private createDepthMaterial(shaderSrc: WGRShderSrcType, faceCullMode = "none"): WGMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes: [] as string[]
		};

		const material = new WGMaterial({
			shadinguuid: "shadow-depth_material",
			shaderSrc,
			pipelineDefParam
		});

		return material;
	}
	private buildShadowCam(): void {
		const g = this;
		const cam = new Camera({
			eye: [600.0, 800.0, -600.0],
			near: 0.1,
			far: 1900,
			perspective: false,
			viewWidth: g.shadowViewW,
			viewHeight: g.shadowViewH
		});
		cam.update();
		g.shadowCamera = cam;
	}
	addEntity(entity: Entity3D): ShadowPassGraph {

		let pass = this.passes[0];
		let et = new Entity3D({ transform: entity.transform });
		et.materials = this.mDepthMaterials;
		et.geometry = entity.geometry;
		et.rstate.copyFrom(entity.rstate);
		this.entities.push(et);
		pass.addEntity(et);
		
		return this;
	}
	addEntities(entities: Entity3D[]): ShadowPassGraph {
		let es = entities;
		for (let i = 0; i < es.length; ++i) {
			this.addEntity(es[i]);
		}
		return this;
	}
	initialize(rc: RendererScene): ShadowPassGraph {

		let colorAttachments = [
			this.depAttachment
		];
		// create a separate rtt rendering pass
		let multisampleEnabled = false;
		let pass = rc.createRTTPass({ colorAttachments, multisampleEnabled });
		this.passes = [pass];
		rc.setPassNodeGraph(this);

		this.buildShadowCam();
		pass.node.camera = this.shadowCamera;
		this.initMaterial();
		this.initocc();

		return this;
	}

	private initocc(): void {

		let pass = this.passes[0];

		let extent = [-1, -1, 2, 2];

		let material = new ShadowOccBlurMaterial();
		let ppt = material.property;
		ppt.setShadowRadius(this.shadowRadius);
		ppt.setViewSize(this.shadowMapW, this.shadowMapH);
		material.addTextures([this.shadowDepthRTT]);
		this.occVEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
		this.occVEntity.visible = false;
		pass.addEntity(this.occVEntity);

		material = new ShadowOccBlurMaterial();
		ppt = material.property;
		ppt.setShadowRadius(this.shadowRadius);
		ppt.setViewSize(this.shadowMapW, this.shadowMapH);
		ppt.toHorizonalBlur();
		material.addTextures([this.occVRTT]);
		this.occHEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
		this.occHEntity.visible = false;
		pass.addEntity(this.occHEntity);
	}
	run(): void {

		let pass = this.passes[0];

		let attachment = this.depAttachment;
		attachment.texture = this.shadowDepthRTT;

		let es = this.entities;
		for (let i = 0; i < es.length; ++i) {
			es[i].visible = true;
		}
		pass.render();
		for (let i = 0; i < es.length; ++i) {
			es[i].visible = false;
		}

		attachment.texture = this.occVRTT;
		this.occVEntity.visible = true;
		pass.render();
		this.occVEntity.visible = false;

		attachment.texture = this.occHRTT;
		this.occHEntity.visible = true;
		pass.render();
		this.occHEntity.visible = false;
	}
}
export class PBRShadowTest {
	private mRscene = new RendererScene();
	private mGraph = new ShadowPassGraph();

	initialize(): void {
		console.log("PBRShadowTest::initialize() ...");

		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam: { multisampleEnabled: true }
		});
		
		this.initShadowScene();
		this.initEvent();
	}

	private mEntities: Entity3D[] = [];
	
	private initShadowScene(): void {

		let rc = this.mRscene;
		
		let position = new Vector3(-230.0, 100.0, -200.0);
		let materials = this.createMaterials(position);
		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position
			},
			materials
		});
		this.mEntities.push(sph);
		rc.addEntity(sph);
		position = new Vector3(160.0, 100.0, -210.0);
		materials = this.createMaterials(position);
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

		position = new Vector3(160.0, 100.0, 210.0);
		materials = this.createMaterials(position);
		let torus = new TorusEntity({
			transform: {
				position,
				rotation: [50, 30, 80]
			},
			materials
		});
		this.mEntities.push(torus);
		rc.addEntity(torus);

		this.buildShadow();
	}

	private buildShadow(): void {
		this.initShadowPass();
		this.initShadowReceiveDisp(true);
		this.buildShadowCamFrame();
	}
	private mShadowTransMat: Matrix4;
	private initShadowPass(): void {
		let rc = this.mRscene;

		const graph = this.mGraph;

		graph.initialize(rc).addEntities(this.mEntities);

		let cam = graph.shadowCamera;
		let transMatrix = new Matrix4();
		transMatrix.setScaleXYZ(0.5, -0.5, 0.5);
		transMatrix.setTranslationXYZ(0.5, 0.5, 0.5);
		let shadowMat = new Matrix4();
		shadowMat.copyFrom(cam.viewProjMatrix);
		shadowMat.append(transMatrix);
		this.mShadowTransMat = shadowMat;

		let extent = [-0.95, -0.95, 0.4, 0.4];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.shadowDepthRTT }] });
		rc.addEntity(entity);

		extent = [-0.5, -0.95, 0.4, 0.4];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.occVRTT }] });
		rc.addEntity(entity);

		extent = [-0.05, -0.95, 0.4, 0.4];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: graph.occHRTT }] });
		rc.addEntity(entity);
	}

	private buildShadowCamFrame(): void {
		const graph = this.mGraph;
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
	
	private initShadowReceiveDisp(shadowReceived = false): void {
		let rc = this.mRscene;

		let position = new Vector3(0, -1, 0);
		let materials = this.createMaterials(position, shadowReceived);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent:[-600,-600,1200,1200],
			transform: { position }
		});
		rc.addEntity(plane);
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
		if(shadowReceived) {
			textures.push( this.mGraph.occHRTT );
		}
		return textures;
	}
	
	private createMaterials(position: Vector3, shadowReceived = false, uvParam?: number[]): BasePBRMaterial[] {
		let textures0 = this.createBaseTextures(shadowReceived);
		
		let material0 = this.createMaterial(position, textures0, ["solid"]);
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
		
		const graph = this.mGraph;
		let cam = graph.shadowCamera;
		property.shadowReceived = shadowReceived;
		if(shadowReceived) {
			property.shadowMatrix.setShadowMatrix(this.mShadowTransMat);
			let vsmParams = property.vsmParams;
			vsmParams.setShadowRadius(graph.shadowRadius);
			vsmParams.setShadowBias(graph.shadowBias);
			vsmParams.setShadowSize(graph.shadowMapW, graph.shadowMapH);
			vsmParams.setDirec(cam.nv);
			vsmParams.setIntensity(0.5);
		}
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createMaterial(position: Vector3DataType, textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		if (!lightParam) {
			lightParam = createLightData(position);
			this.mLightParams.push(lightParam);
		}
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
		// this.mFlag ++;
		// if(this.mFlag == 0) {
		// 	this.initShadowReceiveDisp(true);
		// }
	};
	run(): void {
		this.mRscene.run();
	}
}

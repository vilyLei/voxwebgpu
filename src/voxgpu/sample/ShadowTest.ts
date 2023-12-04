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
import Color4 from "../material/Color4";
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
export class ShadowTest {
	private mRscene = new RendererScene();
	private mGraph = new ShadowPassGraph();

	initialize(): void {
		console.log("ShadowTest::initialize() ...");

		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam: { multisampleEnabled: true }
		});
		this.initScene();
		// this.initShadowScene();
		this.initEvent();
	}

	private mEntities: Entity3D[] = [];
	private initScene(): void {
		this.initTexDisp();
	}
	private initShadowScene(): void {

		let rc = this.mRscene;

		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position: [-230.0, 100.0, -200.0]
			}
		});
		this.mEntities.push(sph);
		rc.addEntity(sph);

		let box = new BoxEntity({
			minPos: [-30, -30, -30],
			maxPos: [130, 230, 80],
			transform: {
				position: [160.0, 100.0, -210.0],
				rotation: [50, 130, 80]
			}
		});
		this.mEntities.push(box);
		rc.addEntity(box);

		let torus = new TorusEntity({
			transform: {
				position: [160.0, 100.0, 210.0],
				rotation: [50, 30, 80]
			}
		});
		this.mEntities.push(torus);
		rc.addEntity(torus);

		this.buildShadow();
		this.buildShadowCamFrame();
	}

	private buildShadow(): void {
		this.initShadowPass();
		this.buildShadowReceiveEntity();
	}
	private initShadowPass(): void {
		let rc = this.mRscene;

		const graph = this.mGraph;

		graph.initialize(rc).addEntities(this.mEntities);

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
	private buildShadowReceiveEntity(): void {

		const graph = this.mGraph;
		let cam = graph.shadowCamera;
		let transMatrix = new Matrix4();
		transMatrix.setScaleXYZ(0.5, -0.5, 0.5);
		transMatrix.setTranslationXYZ(0.5, 0.5, 0.5);
		let shadowMat = new Matrix4();
		shadowMat.copyFrom(cam.viewProjMatrix);
		shadowMat.append(transMatrix);

		let material = new ShadowReceiveMaterial();
		let ppt = material.property;

		ppt.setShadowRadius(graph.shadowRadius);
		ppt.setShadowBias(graph.shadowBias);
		ppt.setShadowSize(graph.shadowMapW, graph.shadowMapH);
		ppt.setShadowMatrix(shadowMat);
		ppt.setDirec(cam.nv);

		material.addTextures([this.mGraph.occHRTT]);

		const rc = this.mRscene;
		let plane = new PlaneEntity({
			axisType: 1,
			extent: [-600, -600, 1200, 1200],
			transform: {
				position: [0, -1, 0]
			},
			materials: [material]
		});
		rc.addEntity(plane);
	}
	
	
	private initTexDisp(): void {
		let rc = this.mRscene;

		let position = new Vector3(0, -1, 0);
		let materials = this.createMaterials(position);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent:[-600,-600,1200,1200],
			transform: { position }
		});
		rc.addEntity(plane);
		/*
		position = new Vector3(0, 0, 180);
		let materials = this.createMaterials(position);
		let sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position = new Vector3(0, 0, -180);
		materials = this.createMaterials(position, [4, 1]);
		let torus = new TorusEntity({
			axisType: 1,
			materials,
			transform: { position }
		});
		rc.addEntity(torus);
		//*/

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
	
	private createMaterials(position: Vector3, uvParam?: number[]): BasePBRMaterial[] {
		let textures0 = this.createBaseTextures();
		// let textures1 = this.createMaskTextures("plastic");
		// let textures2 = this.createMaskTextures("wall", 'circleWave_disp.png');

		let material0 = this.createMaterial(position, textures0, ["solid"]);
		this.applyMaterialPPt(material0);

		// let material1 = this.createMaterial(position, textures1, ["transparent"], 'less-equal', material0.getLightParam());
		// material1.property.inverseMask = false;
		// this.applyMaterialPPt(material1);

		// let material2 = this.createMaterial(position, textures2, ["transparent"], 'less-equal', material0.getLightParam());
		// material2.property.inverseMask = true;
		// this.applyMaterialPPt(material2);
		// let list = [material0, material1, material2];

		// let list = [material0, material1];
		let list = [material0];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}
	private applyMaterialPPt(material: BasePBRMaterial): void {
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		// property.uvParam.value = [2, 2];
		property.param.scatterIntensity = 32;
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createMaterial(position: Vector3DataType, textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		if (!lightParam) {
			lightParam = this.createLightData(position);
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

	private createLightData(position: Vector3DataType): LightShaderDataParam {
		let pos = new Vector3().setVector4(position);
		let pv0 = pos.clone().addBy(new Vector3(0, 200, 0));
		let pv1 = pos.clone().addBy(new Vector3(200, 0, 0));
		let pv2 = pos.clone().addBy(new Vector3(0, 0, 200));
		let pv3 = pos.clone().addBy(new Vector3(-200, 0, 0));
		let pv4 = pos.clone().addBy(new Vector3(0, 0, -200));
		let posList = [pv0, pv1, pv2, pv3, pv4];

		let c0 = new Color4(0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.0, 0.00002);
		let c1 = new Color4(0.0, 0.1 + Math.random() * 13, 1.0, 0.00002);
		let c2 = new Color4(0.0, 0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.00002);
		let c3 = new Color4(0.1 + Math.random() * 13, 1.0, 0.1 + Math.random() * 13, 0.00002);
		let c4 = new Color4(0.5, 1.0, 0.1 + Math.random() * 13, 0.00002);

		let colorList = [c0, c1, c2, c3, c4];

		let pointLightsTotal = posList.length;

		let j = 0;
		let lightsData = new Float32Array(4 * pointLightsTotal);
		let lightColorsData = new Float32Array(4 * pointLightsTotal);

		for (let i = 0; i < lightsData.length;) {
			const pv = posList[j];
			pv.w = 0.00002;
			pv.toArray4(lightsData, i);

			const c = colorList[j];
			c.toArray4(lightColorsData, i);

			j++;
			i += 4;
		}
		let param = { lights: lightsData, colors: lightColorsData, pointLightsTotal };
		this.mLightParams.push(param);
		return param;
	}
	private mouseDown = (evt: MouseEvent): void => {};
	run(): void {
		this.mRscene.run();
	}
}

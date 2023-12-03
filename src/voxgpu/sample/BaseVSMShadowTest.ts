import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { GeomDataBuilder } from "../geometry/GeomDataBuilder";
import { WGMaterial, WGRShderSrcType } from "../material/WGMaterial";
import { Entity3D } from "../entity/Entity3D";

import shadowDepthWGSL from "./shaders/shadow/shadowDepth.wgsl";
import Camera from "../view/Camera";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { ShadowOccBlurMaterial } from "../material/ShadowOccBlurMaterial";
import { ShadowReceiveMaterial } from "./material/ShadowReceiveMaterial";
import Matrix4 from "../math/Matrix4";
import { BoxEntity } from "../entity/BoxEntity";
import { TorusEntity } from "../entity/TorusEntity";

export class BaseVSMShadowTest {
	private mRscene = new RendererScene();
	private mShadowCamera: Camera;
	private mDebug = false;
	initialize(): void {
		console.log("BaseVSMShadowTest::initialize() ...");

		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam: { multisampleEnabled: true }
		});
		this.initScene();
		this.initEvent();
	}

	private mEntities: Entity3D[] = [];
	private initScene(): void {

		let rc = this.mRscene;

		this.buildShadowCam();

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
		if (!this.mDebug) {
			this.applyShadow();
		}

	}
	private mShadowDepthRTT = { uuid: "rtt-shadow-depth", rttTexture: {}, shdVarName: 'shadowDepth' };
	private mOccVRTT = { uuid: "rtt--occV", rttTexture: {}, shdVarName: 'shadowDepth' };
	private mOccHRTT = { uuid: "rtt--occH", rttTexture: {}, shdVarName: 'shadowDepth' };
	private applyShadowDepthRTT(): void {

		let rc = this.mRscene;

		// rtt texture proxy descriptor
		let rttTex = this.mShadowDepthRTT;
		// define a rtt pass color colorAttachment0
		let colorAttachments = [
			{
				texture: rttTex,
				// green clear background color
				clearValue: { r: 1, g: 1, b: 1, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			}
		];
		// create a separate rtt rendering pass
		let rPass = rc.createRTTPass({ colorAttachments });
		rPass.node.camera = this.mShadowCamera;

		let extent = [-0.5, -0.5, 0.8, 0.8];

		const shadowDepthShdSrc = {
			shaderSrc: { code: shadowDepthWGSL, uuid: "shadowDepthShdSrc" }
		};
		let material = this.createDepthMaterial(shadowDepthShdSrc);
		let es = this.createDepthEntities([material], false);
		for (let i = 0; i < es.length; ++i) {
			rPass.addEntity(es[i]);
		}

		// 显示渲染结果
		extent = [-0.95, -0.95, 0.4, 0.4];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: rttTex }] });
		rc.addEntity(entity);
	}
	private applyBuildDepthOccVRTT(): void {
		let rc = this.mRscene;

		// rtt texture proxy descriptor
		let rttTex = this.mOccVRTT;
		// define a rtt pass color colorAttachment0
		let colorAttachments = [
			{
				texture: rttTex,
				// green clear background color
				clearValue: { r: 1, g: 1, b: 1, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			}
		];
		// create a separate rtt rendering pass
		let rPass = rc.createRTTPass({ colorAttachments });
		let material = new ShadowOccBlurMaterial();

		let ppt = material.property;
		ppt.setShadowRadius(this.mShadowRadius);
		ppt.setViewSize(this.mShadowMapW, this.mShadowMapH);

		material.addTextures([this.mShadowDepthRTT]);
		let extent = [-1, -1, 2, 2];
		let rttEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
		rPass.addEntity(rttEntity);

		// 显示渲染结果
		extent = [-0.5, -0.95, 0.4, 0.4];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: rttTex }] });
		rc.addEntity(entity);
	}

	private applyBuildDepthOccHRTT(): void {
		let rc = this.mRscene;

		// rtt texture proxy descriptor
		let rttTex = this.mOccHRTT;
		// define a rtt pass color colorAttachment0
		let colorAttachments = [
			{
				texture: rttTex,
				// green clear background color
				clearValue: { r: 1, g: 1, b: 1, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			}
		];
		// create a separate rtt rendering pass
		let rPass = rc.createRTTPass({ colorAttachments });
		let material = new ShadowOccBlurMaterial();
		let ppt = material.property;
		ppt.setShadowRadius(this.mShadowRadius);
		ppt.setViewSize(this.mShadowMapW, this.mShadowMapH);
		material.property.toHorizonalBlur();
		material.addTextures([this.mOccVRTT]);
		let extent = [-1, -1, 2, 2];
		let rttEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
		rPass.addEntity(rttEntity);

		// 显示渲染结果
		extent = [-0.05, -0.95, 0.4, 0.4];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: rttTex }] });
		rc.addEntity(entity);
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
	private createDepthEntities(materials: WGMaterial[], flag = false): Entity3D[] {

		const rc = this.mRscene;

		let entities = [];
		let ls = this.mEntities;
		let tot = ls.length;
		for (let i = 0; i < tot; ++i) {
			let et = ls[i];
			let entity = new Entity3D({ transform: et.transform });
			entity.materials = materials;
			entity.geometry = et.geometry;
			entities.push(entity);
			if (flag) {
				rc.addEntity(entity);
			}
		}
		return entities;
	}
	private mShadowBias = -0.0005;
	private mShadowRadius = 2.0;
	private mShadowMapW = 512;
	private mShadowMapH = 512;
	private mShadowViewW = 1300;
	private mShadowViewH = 1300;
	private buildShadowCam(): void {

		const cam = new Camera({
			eye: [600.0, 800.0, -600.0],
			near: 0.1,
			far: 1900,
			perspective: false,
			viewWidth: this.mShadowViewW,
			viewHeight: this.mShadowViewH
		});
		cam.update();
		this.mShadowCamera = cam;
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
	private mFlag = -1;
	private buildShadowReceiveEntity(): void {

		let cam = this.mShadowCamera;
		let transMatrix = new Matrix4();
		transMatrix.setScaleXYZ(0.5, -0.5, 0.5);
		transMatrix.setTranslationXYZ(0.5, 0.5, 0.5);
		let shadowMat = new Matrix4();
		shadowMat.copyFrom(cam.viewProjMatrix);
		shadowMat.append(transMatrix);

		let material = new ShadowReceiveMaterial();
		let ppt = material.property;

		ppt.setShadowRadius(this.mShadowRadius);
		ppt.setShadowBias(this.mShadowBias);
		ppt.setShadowSize(this.mShadowMapW, this.mShadowMapH);
		ppt.setShadowMatrix(shadowMat);
		ppt.setDirec(cam.nv);

		material.addTextures([this.mOccHRTT]);

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
	private applyShadow(): void {

		this.applyShadowDepthRTT();
		this.applyBuildDepthOccVRTT();
		this.applyBuildDepthOccHRTT();
		this.buildShadowReceiveEntity();
	}
	private mouseDown = (evt: MouseEvent): void => {
		this.mFlag++;
		if (this.mDebug) {
			if (this.mFlag == 0) {
				this.applyShadowDepthRTT();
			} else if (this.mFlag == 1) {
				this.applyBuildDepthOccVRTT();
			} else if (this.mFlag == 2) {
				this.applyBuildDepthOccHRTT();
			} else if (this.mFlag == 3) {
				this.buildShadowReceiveEntity();
			}
		}
	};
	run(): void {
		this.mRscene.run();
	}
}

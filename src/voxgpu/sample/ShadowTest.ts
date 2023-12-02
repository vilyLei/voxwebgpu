import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { GeomDataBuilder } from "../geometry/GeomDataBuilder";
import { WGMaterial, WGRShderSrcType } from "../material/WGMaterial";
import { Entity3D } from "../entity/Entity3D";
import { WGGeometry } from "../geometry/WGGeometry";

import shadowDepthWGSL from "./shaders/shadow/shadowDepth.wgsl";
import Camera from "../view/Camera";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { ShadowOccBlurMaterial } from "../material/ShadowOccBlurMaterial";

export class ShadowTest {
	private mRscene = new RendererScene();
	private mShadowCamera: Camera;
	geomData = new GeomDataBuilder();
	initialize(): void {
		console.log("ShadowTest::initialize() ...");

		const body = document.body;
		// body.style.background = '#000000';

		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			// camera: {
			// 	eye: [600.0, 800.0, -600.0],
			// 	near: 0.1,
			// 	far: 1900,
			// 	perspective: false
			// },
			rpassparam: { multisampleEnabled: true }
		});
		this.initScene();
		this.initEvent();
	}


	private initScene(): void {

		let rc = this.mRscene;

		this.buildShadowCam();

		// const shadowDepthShdSrc = {
		// 	shaderSrc: { code: shadowDepthWGSL, uuid: "shadowDepthShdSrc" }
		// };
		// let material = this.createDepthMaterial(shadowDepthShdSrc);
		// this.createDepthEntities([material], true);
		/*
		let sph = new SphereEntity({
			radius: 80,
			transform: {
				position: [-230.0, 100.0, -200.0]
			}
		});
		rc.addEntity(sph);

		let plane = new PlaneEntity({
			axisType: 1,
			extent: [-600, -600, 1200, 1200],
			transform: {
				position: [0, -1, 0]
			}
		});
		rc.addEntity(plane);
		//*/

		this.applyShadowDepthRTT();

	}
	private mShadowDepthRTT = { uuid: "rtt-shadow-depth", rttTexture: {}, shdVarName: 'shadowDepth' };
	private mOccHRTT = { uuid: "rtt--occH", rttTexture: {}, shdVarName: 'shadowDepth' };
	private mOccVRTT = { uuid: "rtt--occV", rttTexture: {}, shdVarName: 'shadowDepth' };
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

		// 使用rtt纹理
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
		material.addTextures([this.mShadowDepthRTT]);
		let extent = [-1, -1, 2, 2];
		let rttEntity = new FixScreenPlaneEntity({ extent, materials:[material] });
		// 往pass中添加可渲染对象
		rPass.addEntity(rttEntity);

		// 使用rtt纹理
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
		material.property.toHorizonalBlur();
		material.addTextures([this.mOccVRTT]);
		let extent = [-1, -1, 2, 2];
		let rttEntity = new FixScreenPlaneEntity({ extent, materials:[material] });
		// 往pass中添加可渲染对象
		rPass.addEntity(rttEntity);

		// 使用rtt纹理
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

		// let ufv = new WGRStorageValue({data: new Float32Array([1,0,0,1])});
		// let ufv = {storage: {data: new Float32Array([1,0,0,1]), shdVarName:'param'}};
		// material.uniformValues = [ufv];

		return material;
	}
	private createDepthEntities(materials: WGMaterial[], flag = false): Entity3D[] {

		let entities = [];

		const rc = this.mRscene;
		let gd = this.geomData;

		let rgd = gd.createSphere(80, 15, 15);
		let geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition([-230.0, 100.0, -200.0]);
		if (flag) {
			rc.addEntity(entity);
		}
		entities.push(entity);

		rgd = gd.createSquare(1200, 1);
		geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });
		entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition([0, -1, 0]);
		if (flag) {
			rc.addEntity(entity);
		}
		entities.push(entity);
		return entities;
	}

	private buildShadowCam(): void {

		const cam = new Camera({
			eye: [600.0, 800.0, -600.0],
			near: 0.1,
			far: 1900,
			perspective: false,
			viewWidth: 1300,
			viewHeight: 1300
		});
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
	private mFlag = 0;
	private mouseDown = (evt: MouseEvent): void => {
		this.mFlag ++;
			if(this.mFlag == 1) {
				this.applyBuildDepthOccVRTT();
			} else if(this.mFlag == 2) {
				this.applyBuildDepthOccHRTT();
			}
	};
	run(): void {
		this.mRscene.run();
	}
}

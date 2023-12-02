import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { GeomDataBuilder } from "../geometry/GeomDataBuilder";
import { WGMaterial, WGRShderSrcType } from "../material/WGMaterial";
import { Entity3D } from "../entity/Entity3D";
import { WGGeometry } from "../geometry/WGGeometry";


import shadowDepthWGSL from "./shaders/shadow/shadowDepth.wgsl";
import Camera from "../view/Camera";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";

export class ShadowTest {
	private mRscene = new RendererScene();
	geomData = new GeomDataBuilder();
	initialize(): void {
		console.log("ShadowTest::initialize() ...");

		const body = document.body;
		// body.style.background = '#000000';

		this.mRscene.initialize({ canvasWith: 512, canvasHeight: 512, rpassparam: { multisampleEnabled: true } });
		this.initScene();
		this.initEvent();
	}


	private initScene(): void {

		const shadowDepthShdSrc = {
			shaderSrc: { code: shadowDepthWGSL, uuid: "shadowDepthShdSrc" }
		};

		let material = this.createDepthMaterial( shadowDepthShdSrc );
		this.createDepthEntity([material]);

		this.showCamFrame();
	}
	
	private createDepthMaterial(shaderSrc: WGRShderSrcType, faceCullMode = "back"): WGMaterial {

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
	private createDepthEntity(materials: WGMaterial[]): void {

		const rc = this.mRscene;
		let gd = this.geomData;

		let rgd = gd.createSphere(230, 15, 15);
		let geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		rc.addEntity(entity);

		rgd = gd.createSquare(800, 1);
		geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });
		entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition([0,-220,0]);
		rc.addEntity(entity);
	}
	
	private showCamFrame(): void {

		const cam = new Camera({
			eye: [600.0,800.0,-600.0],
			near: 0.1,
			far: 1900,
			perspective:false,
			viewWidth: 1300,
			viewHeight: 1300
		});
		const rsc = this.mRscene;
		let frameColors = [[1.0, 0.0, 1.0], [0.0, 1.0, 1.0], [1.0, 0.0, 0.0], [0.0, 1.0, 1.0]];
		let boxFrame = new BoundsFrameEntity({ vertices8: cam.frustum.vertices, frameColors });
		rsc.addEntity( boxFrame );
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

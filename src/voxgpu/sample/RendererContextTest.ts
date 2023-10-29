import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureColorParam.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3 from "../math/Vector3";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import Stage3D from "../rscene/Stage3D";
import MouseEvent from "../event/MouseEvent";
import { RAdapterContext } from "../rscene/context/RAdapterContext";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

export class RendererContextTest {

	private mEntity: Entity3D;

	private mStage: Stage3D;
	private mRACtx: RAdapterContext;
	private mRscene = new RendererScene();
	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {

		console.log("RendererContextTest::initialize() ...");
		
		const renderer = this.renderer;

		const callDo = (type: string): void => {

			const shdSrc = {
				vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
				fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
			};
			let material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")], ["solid"], "back");
			this.mEntity = this.createEntity([material]);
	
			this.mStage = new Stage3D(0, document);
			this.mRACtx = new RAdapterContext();
			this.mRACtx.initialize({stage: this.mStage, canvas: renderer.getCanvas(), div: renderer.getDiv()});

			const rc = this.mRscene;
			rc.racontext = this.mRACtx;
			rc.renderer = renderer;
			rc.camera = renderer.camera;
			this.initEvent();
		};
		renderer.initialize({callback: callDo});

	}
	private initEvent(): void {

		// const stage = this.mStage;
		// stage.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		// new MouseInteraction().initialize( rc, 0, true).setAutoRunning(true);
		new MouseInteraction().initialize( rc, 0, false).setAutoRunning(true);
	}

	private mouseDown(evt: MouseEvent): void {
		console.log("mousedown evt call ...");
	}
	private createMaterial(shdSrc: WGRShderSrcType, texDatas?: WGImage2DTextureData[], blendModes: string[] = [], faceCullMode = "back"): WGMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes: [] as string[]
		};

		pipelineDefParam.blendModes = blendModes;

		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});

		let ufv = new WGRStorageValue(new Float32Array([1,0,0,1]));
		material.uniformValues = [ufv];
		material.addTextureWithDatas( texDatas );

		return material;
	}

	private createEntity(materials: WGMaterial[], pv?: Vector3): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createSphere(150, 30, 30);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv ? pv : new Vector3());

		renderer.addEntity(entity);
		return entity;
	}
	private mRotY = 0.0;
	run(): void {
		if(this.mEntity) {

			this.mRotY += 0.5;
			this.mEntity.transform.setRotationXYZ(0, this.mRotY, this.mRotY + 0.5);
			this.mEntity.update();
			
			this.mRscene.run();
		}
	}
}

import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureColorParam.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3 from "../math/Vector3";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { Entity3DContainer } from "../entity/Entity3DContainer";

export class REntity3DContainerTest {
	private mEntity: Entity3D;
	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("REntity3DContainerTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();

		this.initEvent();

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")], ["solid"], "back");
		this.mEntity = this.createEntity([material]);
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
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

		let ufv = new WGRStorageValue(new Float32Array([1, 0, 0, 1]));
		material.uniformValues = [ufv];
		material.addTextureWithDatas(texDatas);

		return material;
	}
	private mContainer: Entity3DContainer;
	private createEntity(materials: WGMaterial[], pv?: Vector3): Entity3D {
		const rc = this.mRscene;

		const rgd = this.geomData.createSphere(150, 30, 30);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv ? pv : new Vector3());

		let container = new Entity3DContainer();
		container.addChild(entity);
		container.update();
		this.mContainer = container;

		entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setRotationXYZ(130, 80, 0);
		entity.transform.setPosition(new Vector3(0, 0, 320));
		container.addChild(entity);

		rc.addEntity(container);
		return entity;
	}

	private mRotY = 0.0;
	run(): void {
		this.mRotY += 0.5;
		// this.mEntity.transform.setRotationXYZ(0, this.mRotY, this.mRotY + 0.5);
		// this.mEntity.update();
		const c = this.mContainer;
		c.setRotationXYZ(0, this.mRotY, this.mRotY + 0.5);
		c.update();

		this.mRscene.run();
	}
}

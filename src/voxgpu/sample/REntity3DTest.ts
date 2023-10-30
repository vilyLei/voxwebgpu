import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntityNormal.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureNormalParam.frag.wgsl";

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

import { TransObject } from "./base/TransObject";
import Color4 from "../material/Color4";

export class REntity3DTest {
	private mObjs: TransObject[] = [];

	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("REntity3DTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();

		this.initEvent();

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		for (let i = 0; i < 10; ++i) {
			let material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/white.jpg")], new Color4().randomRGB(1.0, 0.2));
			let scale = Math.random() * 0.5 + 0.5;
			const entity = this.createEntity([material]);
			const obj = new TransObject();
			obj.entity = entity;
			obj.scale.setXYZ(scale, scale, scale);
			obj.rotationSpdv.setXYZ(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
			obj.initialize(800);
			this.mObjs.push(obj);
		}
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private mouseDown(evt: MouseEvent): void {
		console.log("mousedown evt call ...");
	}
	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDatas?: WGImage2DTextureData[],
		color?: Color4,
		blendModes: string[] = ["solid"],
		faceCullMode = "back"
	): WGMaterial {
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes: [] as string[]
		};

		if (!color) color = new Color4(1.0, 1.0, 1.0);

		pipelineDefParam.blendModes = blendModes;

		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});

		let ufv = new WGRStorageValue(new Float32Array([color.r, color.g, color.b, 0.9]));
		material.uniformValues = [ufv];
		material.addTextureWithDatas(texDatas);

		return material;
	}
	private createEntity(materials: WGMaterial[], pv?: Vector3): Entity3D {
		const rc = this.mRscene;

		// const rgd = this.geomData.createSphere(150, 30, 30);

		let geometry = this.mObjs.length > 0 ? this.mObjs[0].entity.geometry : null;
		if (!geometry) {
			const rgd = this.geomData.createCube(200);
			geometry = new WGGeometry()
				.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
				.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
				.addAttribute({ shdVarName: "normal", data: rgd.nvs, strides: [3] })
				.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });
		}

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv ? pv : new Vector3());


		rc.addEntity(entity);
		return entity;
	}

	run(): void {
		for (let i = 0; i < this.mObjs.length; ++i) {
			this.mObjs[i].run();
		}

		this.mRscene.run();
	}
}

import { GeomDataBuilder, GeomRDataType } from "../geometry/GeomDataBuilder";

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

export class SimpleLightTest {
	private mObjs: TransObject[] = [];

	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("SimpleLightTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initEvent();
		
		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		let geom = this.createGeom(this.geomData.createCube(100), true);

		let texList = [new WGImage2DTextureData("static/assets/white.jpg")];
		let tot = 4;
		const size = new Vector3(150, 150, 150);
		const pos = new Vector3().copyFrom(size).scaleBy(-0.5 * (tot - 1));

		for (let i = 0; i < tot; ++i) {
			for (let j = 0; j < tot; ++j) {
				for (let k = 0; k < tot; ++k) {
					let material = this.createMaterial(shdSrc, texList, new Color4().randomRGB(1.0, 0.2));
					let scale = Math.random() * 0.2 + 0.3;
					const entity = this.createEntity(geom, [material]);
					const obj = new TransObject();
					obj.entity = entity;
					obj.scale.setXYZ(scale, scale, scale);
					obj.rotationSpdv.setXYZ(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
					obj.position.setXYZ(i * size.x, j * size.y, k * size.z).addBy(pos);
					this.mObjs.push(obj);
				}
			}
		}
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);

		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {
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

	private createGeom(rgd: GeomRDataType, normalEnabled = false): WGGeometry {
		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs })
			.addAttribute({ uv: rgd.uvs })
			.setIndices(rgd.ivs);
		if (normalEnabled) {
			geometry.addAttribute({ normal: rgd.nvs });
		}
		return geometry;
	}
	private createEntity(geometry: WGGeometry, materials: WGMaterial[], pv?: Vector3): Entity3D {

		const rc = this.mRscene;
		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		if (pv) entity.transform.setPosition(pv);

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

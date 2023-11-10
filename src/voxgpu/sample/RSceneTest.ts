import { GeomDataBuilder, GeomRDataType } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureColorParam.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3 from "../math/Vector3";
import { WGRStorageValue } from "../render/buffer/WGRStorageValue";
import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

export class RSceneTest {
	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("RSceneTest::initialize() ...");

		this.initEvent();

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const materials = [
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")], ["solid"], "back"),
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/brickwall_big512.jpg")], ["solid"], "back"),
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/metal_02.jpg")], ["solid"], "back")
		]
		this.createEntities(materials, new Vector3(0, 200, 0));
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {
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

		let ufv = new WGRStorageValue({data: new Float32Array([1, 1, 1, 1])});
		material.uniformValues = [ufv];
		material.addTextureWithDatas(texDatas);

		return material;
	}

	private createGeom(rgd: GeomRDataType): WGGeometry {
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });
		return geometry;
	}
	private createEntities(materials: WGMaterial[], pv?: Vector3): void {
		const rc = this.mRscene;
		pv = pv ? pv : new Vector3();

		let sphGeom = this.createGeom(this.geomData.createSphere(30, 30, 30));
		let boxGeom = this.createGeom(this.geomData.createCube(100));
		let torusGeom = this.createGeom(this.geomData.createTorus(100));

		const floor = new Entity3D();
		floor.materials = [materials[0]];
		floor.geometry = boxGeom;
		floor.transform.setPosition(new Vector3(0, -150, 0).addBy(pv));
		floor.transform.setScaleXYZ(8, 0.1, 8);
		rc.addEntity(floor);

		for (let i = 0; i < 6; ++i) {
			const torus = new Entity3D();
			torus.materials = [materials[1]];
			torus.geometry = torusGeom;
			torus.transform.setPosition(new Vector3(-200 + i * 80, 0, 0).addBy(pv));
			rc.addEntity(torus);
		}
		for (let i = 0; i < 12; ++i) {
			const sphere = new Entity3D();
			sphere.materials = [materials[2]];
			sphere.geometry = sphGeom;
			sphere.transform.setPosition(new Vector3(-400 + i * 80, 0, 0).addBy(pv));
			rc.addEntity(sphere);
		}
	}

	run(): void {
		this.mRscene.run();
	}
}

import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureMixColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3 from "../math/Vector3";

export class BlendTest {
	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();
	// flag = 6;
	initialize(): void {
		console.log("BlendTest::initialize() ...");

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let materials = [
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")]),
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/default.jpg")], ["add"]),
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/xulie_08_61.png")], ["alpha_add"]),
			this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/blueTransparent.png")], ["add"])
		];
		for (let i = 0; i < materials.length; ++i) {
			this.createEntity([materials[i]], new Vector3(0, 0, -50 + i * 50), "et-" + i);
		}
		// document.onmousedown = evt => {
		// 	this.flag = 1;
		// };
	}

	private createMaterial(shdSrc: WGRShderSrcType, texDatas?: WGImage2DTextureData[], blendModes: string[] = ["solid"]): WGMaterial {
		let pipelineDefParam = {
			faceCullMode: "back",
			blendModes: [] as string[]
		};
		pipelineDefParam.blendModes = blendModes;
		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal + blendModes.toString(),
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});

		material.addTextureWithDatas(texDatas);
		return material;
	}
	private createEntity(materials: WGMaterial[], pv: Vector3, uuid?: string): Entity3D {
		const renderer = this.renderer;
		const rgd = this.geomData.createSquare(600);

		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.uuid = uuid;
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv);
		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		// if (this.flag < 1) {
		// 	return;
		// }
		// this.flag--;

		this.renderer.run();
	}
}

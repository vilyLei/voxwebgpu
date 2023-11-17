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
	initialize(): void {
		console.log("BlendTest::initialize() ...");

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
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
			shaderSrc: shdSrc,
			pipelineDefParam
		});

		material.addTextureWithDatas(texDatas);
		return material;
	}
	private createEntity(materials: WGMaterial[], pv: Vector3, uuid?: string): Entity3D {
		const renderer = this.renderer;
		const rgd = this.geomData.createSquare(600);

		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs})
			.addAttribute({ uv: rgd.uvs, strides: [2] })
			.setIndices( rgd.ivs );

		const entity = new Entity3D({geometry, materials});
		entity.uuid = uuid;
		entity.transform.setPosition(pv);
		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}

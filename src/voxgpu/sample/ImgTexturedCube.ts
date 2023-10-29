import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/defaultEntity.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class ImgTexturedCube {

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {
		console.log("ImgTexturedCube::initialize() ...");

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")]);
		this.createEntity([material]);
	}

	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDatas?: WGImage2DTextureData[]
	): WGMaterial {

		let pipelineDefParam = {
			faceCullMode: "back"
		};
		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});		
		material.addTextureWithDatas( texDatas );

		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createCube(200);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;

		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}

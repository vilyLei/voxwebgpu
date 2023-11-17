import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTwoTexture.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class MultiTexturedCube {

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {
		console.log("MultiTexturedCube::initialize() ...");

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const texDataList = [new WGImage2DTextureData("static/assets/box.jpg"), new WGImage2DTextureData("static/assets/default.jpg")];
		const material = this.createMaterial(shdSrc, texDataList);
		this.createEntity([material]);
	}

	private createMaterial(
		shaderSrc: WGRShderSrcType,
		texDatas?: WGImage2DTextureData[]
	): WGMaterial {

		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderSrc
		});
		material.addTextureWithDatas(texDatas);
		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {

		const renderer = this.renderer;
		const rgd = this.geomData.createCube(200);

		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs})
			.addAttribute({ uv: rgd.uvs})
			.setIndices( rgd.ivs );

		const entity = new Entity3D({geometry, materials});
		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}

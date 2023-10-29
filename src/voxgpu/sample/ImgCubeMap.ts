import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/vertEntityOnlyVtx.vert.wgsl";
import fragWGSL from "./shaders/cubemap.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImageCubeTextureData, WGImage2DTextureData, WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class ImgCubeMap {

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {

		console.log("ImgCubeMap::initialize() ...");

		let urls = [
			"static/assets/hw_morning/morning_ft.jpg",
			"static/assets/hw_morning/morning_bk.jpg",
			"static/assets/hw_morning/morning_up.jpg",
			"static/assets/hw_morning/morning_dn.jpg",
			"static/assets/hw_morning/morning_rt.jpg",
			"static/assets/hw_morning/morning_lf.jpg"
		];

		let td = new WGImageCubeTextureData(urls);

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = this.createMaterial(shdSrc, [td]);
		this.createEntity([material]);
	}

	private createMaterial(
		shdSrc: WGRShderSrcType,
		texDataList?: WGImageTextureData[]
	): WGMaterial {

		let pipelineDefParam = {
			faceCullMode: "back"
		};
		const texTotal = texDataList ? texDataList.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		if (texTotal > 0) {
			const texWrappers: WGTextureWrapper[] = new Array(texTotal);
			for (let i = 0; i < texTotal; ++i) {
				texWrappers[i] = new WGTextureWrapper({ texture: { data: texDataList[i], shdVarName: "texture" + i } });
			}
			material.textures = texWrappers;
		}
		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {
		const renderer = this.renderer;

		const rgd = this.geomData.createCubeWithSize(200);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
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

import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/vertEntityOnlyVtx.vert.wgsl";
import fragWGSL from "./shaders/cubemap.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImageCubeTextureData } from "../texture/WGTextureWrapper";

export class ImgCubeMap {

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {

		console.log("ImgCubeMap::initialize() ...");

		const material = this.createMaterial();
		this.createEntity([material]);
	}

	private createMaterial(): WGMaterial {

		let urls = [
			"static/assets/hw_morning/morning_ft.jpg",
			"static/assets/hw_morning/morning_bk.jpg",
			"static/assets/hw_morning/morning_up.jpg",
			"static/assets/hw_morning/morning_dn.jpg",
			"static/assets/hw_morning/morning_rt.jpg",
			"static/assets/hw_morning/morning_lf.jpg"
		];

		let texDataList = [new WGImageCubeTextureData(urls)];

		const shaderSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const texTotal = texDataList ? texDataList.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderSrc
		}).addTextureWithDatas(texDataList);

		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {
		const renderer = this.renderer;

		const rgd = this.geomData.createCube(200);
		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs })
			.setIndices( rgd.ivs );

		const entity = new Entity3D({materials, geometry});
		renderer.addEntity(entity);
		return entity;
	}

	run(): void {
		this.renderer.run();
	}
}

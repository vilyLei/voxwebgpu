import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/vertEntity.vert.wgsl";
import fragWGSL from "./shaders/vertEntity.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class VertEntityTest {

	private mEntity: Entity3D;

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {

		console.log("VertEntityTest::initialize() ...");

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = this.createMaterial( shdSrc );
		this.mEntity = this.createEntity( [material] );
	}

	private createMaterial(shaderSrc: WGRShderSrcType): WGMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true
		};
		const material = new WGMaterial({
			shaderSrc,
			pipelineDefParam
		});
		return material;
	}

	private createEntity(materials: WGMaterial[]): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createSphere(150, 30, 30);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D({geometry, materials});
		renderer.addEntity(entity);
		return entity;
	}
	private mRotY = 0.0;
	run(): void {

		this.mRotY += 0.5;
		this.mEntity.transform.setRotationXYZ(0, this.mRotY, this.mRotY + 0.5);
		this.mEntity.update();

		this.renderer.run();
	}
}

import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/defaultEntity.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import Vector3 from "../math/Vector3";
// import { WGRStorageValue } from "../render/uniform/WGRStorageValue";

export class DefaultEntityTest {

	private mEntity: Entity3D;

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {

		console.log("DefaultEntityTest::initialize() ...");
		
		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		let material = this.createMaterial(shdSrc, [new WGImage2DTextureData("static/assets/box.jpg")], ["solid"], "back");
		// let material = this.createMaterial( shdSrc );
		this.mEntity = this.createEntity( [material] );
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
			shaderSrc: shdSrc,
			pipelineDefParam
		});

		material.addTextureWithDatas( texDatas );

		return material;
	}

	private createEntity(materials: WGMaterial[], pv?: Vector3): Entity3D {

		const renderer = this.renderer;

		const rgd = this.geomData.createSphere(150, 30, 30);
		const geometry = new WGGeometry()
			.addAttribute({ shdVarName: "position", data: rgd.vs, strides: [3] })
			.addAttribute({ shdVarName: "uv", data: rgd.uvs, strides: [2] })
			.setIndexBuffer({ name: "geomIndex", data: rgd.ivs });

		const entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setPosition(pv ? pv : new Vector3());

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

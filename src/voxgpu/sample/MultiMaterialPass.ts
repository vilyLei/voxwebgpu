import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureMixColor.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";
import { WGImage2DTextureData } from "../texture/WGTextureWrapper";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

export class MultiMaterialPass {

	private mEntity: Entity3D;

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {
		console.log("MultiMaterialPass::initialize() ...");

		const shdSrc = {
			vert: { code: vertWGSL },
			frag: { code: fragWGSL }
		};
		const tds = [new WGImage2DTextureData("static/assets/blueTransparent.png")];
		let material0 = this.createMaterial(shdSrc, tds, ["transparent"], "front");
		let material1 = this.createMaterial(shdSrc, tds, ["transparent"], "back");
		this.mEntity = this.createEntity([material0, material1]);
	}

	private createMaterial(shaderSrc: WGRShderSrcType, texDatas?: WGImage2DTextureData[], blendModes: string[] = [], faceCullMode = "back"): WGMaterial {
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: faceCullMode,
			blendModes: [] as string[]
		};

		pipelineDefParam.blendModes = blendModes;

		const texTotal = texDatas ? texDatas.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal + faceCullMode,
			shaderSrc,
			pipelineDefParam
		});
		material.addTextureWithDatas(texDatas);
		return material;
	}
	private createEntity(materials: WGMaterial[]): Entity3D {
		const renderer = this.renderer;

		const rgd = this.geomData.createSphere(150, 30, 30);
		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs })
			.addAttribute({ uv: rgd.uvs })
			.setIndices( rgd.ivs );

		const entity = new Entity3D({geometry, materials});
		renderer.addEntity( entity );
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

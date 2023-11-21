import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

import { ModelEntity } from "../entity/ModelEntity";
import { BasePBRMaterial } from "../material/BasePBRMaterial";
import Vector3 from "../math/Vector3";
import { AxisEntity } from "../entity/AxisEntity";
import Color4 from "../material/Color4";
import { BillboardEntity } from "../entity/BillboardEntity";

export class BasePbrMaterialMultiLights {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("BasePbrMaterialMultiLights::initialize() ...");

		this.mRscene.initialize({ canvasWith: 512, canvasHeight: 512, rpassparam: { multisampleEnabled: true } });
		this.initScene();
		this.initEvent();
	}
	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		let textures = [this.hdrEnvtex, albedoTex, normalTex, aoTex, roughnessTex, metallicTex];
		return textures;
	}
	private initScene(): void {
		this.initEntities();
	}
	private initEntities(): void {
		let rc = this.mRscene;

		rc.addEntity(new AxisEntity());

		let monkeySrc = new ModelEntity({
			modelUrl: "static/assets/draco/monkey.drc"
		});

		// let pos = new Vector3(0, 0, -150);
		let pos = new Vector3(0, 0, 0);

		// let material = this.createModelEntity(monkeySrc, "gold", pos);
		let material = this.createModelEntity(monkeySrc, "plastic", pos);
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		property.param.scatterIntensity = 32;
	}
	private createModelEntity(srcEntity: ModelEntity, texName: string, position: Vector3DataType): BasePBRMaterial {
		let rc = this.mRscene;

		let lightData = this.createLightData(position);

		let material = new BasePBRMaterial();
		let property = material.property;
		property.setLightData(lightData.lightsData, lightData.lightColorsData);
		material.addTextures(this.createTextures(texName));
		let monkey = new ModelEntity({
			materials: [material],
			geometry: srcEntity.geometry,
			transform: { position, scale: [100, 100, 100], rotation: [0, 90, 0] }
		});
		rc.addEntity(monkey);
		return material;
	}
	private createLightData(position: Vector3DataType): { lightsData: Float32Array; lightColorsData: Float32Array } {
		let rc = this.mRscene;

		let pos = new Vector3().setVector3(position);
		let pv0 = pos.clone().addBy(new Vector3(0, 200, 0));
		let pv1 = pos.clone().addBy(new Vector3(200, 0, 0));
		let pv2 = pos.clone().addBy(new Vector3(0, 0, 200));
		let pv3 = pos.clone().addBy(new Vector3(-200, 0, 0));
		let pv4 = pos.clone().addBy(new Vector3(0, 0, -200));
		let posList = [pv0, pv1, pv2, pv3, pv4];

		let c0 = new Color4(0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.0, 	0.00002);
		let c1 = new Color4(0.0, 0.1 + Math.random() * 13, 1.0, 						0.00002);
		let c2 = new Color4(0.0, 0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 	0.00002);
		let c3 = new Color4(0.1 + Math.random() * 13, 1.0, 0.1 + Math.random() * 13, 	0.00002);
		let c4 = new Color4(0.5, 1.0, 0.1 + Math.random() * 13, 						0.00002);

		let colorList = [c0, c1, c2, c3, c4];

		let lightsTotal = posList.length;

		let j = 0;
		let lightsData = new Float32Array(4 * lightsTotal);
		let lightColorsData = new Float32Array(4 * lightsTotal);

		let diffuseTex0 = { diffuse: { url: "static/assets/flare_core_03.jpg" } };

		for (let i = 0; i < lightsData.length; ) {
			const pv = posList[j];
			pv.w = 0.00002;
			pv.toArray4(lightsData, i);

			const c = colorList[j];
			c.toArray4(lightColorsData, i);

			j++;
			i += 4;

			let billboard = new BillboardEntity({ size: 50, textures: [diffuseTex0] });
			c.a = 1.0;
			billboard.color = c.scaleBy(0.1);
			billboard.scale = 1.0;
			billboard.transform.setPosition(pv);
			rc.addEntity(billboard);
		}

		return { lightsData, lightColorsData };
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	run(): void {
		this.mRscene.run();
	}
}

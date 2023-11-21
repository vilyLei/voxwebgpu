import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

import { ModelEntity } from "../entity/ModelEntity";
import { BasePBRMaterial } from "../material/BasePBRMaterial";
import Vector3 from "../math/Vector3";
import { AxisEntity } from "../entity/AxisEntity";

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

		rc.addEntity(new AxisEntity())

		let monkeySrc = new ModelEntity({
			modelUrl: "static/assets/draco/monkey.drc"
		});

		// let pos = new Vector3(0, 0, -150);
		let pos = new Vector3(0, 0, 0);

		// let material = this.createModelEntity(monkeySrc, "gold", pos);
		let material = this.createModelEntity(monkeySrc, "plastic", pos);
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.1, 0.7, 0.5];
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
		material.addTextures(this.createTextures( texName ));
		let monkey = new ModelEntity({
			materials: [material],
			geometry: srcEntity.geometry,
			transform: { position, scale: [100, 100, 100], rotation: [0, 90, 0] }
		});
		rc.addEntity(monkey);
		return material;
	}
	private createLightData(position: Vector3DataType): { lightsData: Float32Array; lightColorsData: Float32Array } {

		let pos = new Vector3().setVector3(position);
		let pv0 = pos.clone().addBy(new Vector3(0,300,0));
		let pv1 = pos.clone().addBy(new Vector3(300,0,0));
		let pv2 = pos.clone().addBy(new Vector3(0,0,300));
		let posList = [pv0, pv1, pv2];

		// let lightsData = new Float32Array([0.0, 300.0, 0, 0.0005]);
		let j = 0;
		let lightsData = new Float32Array(4 * 3);
		for(let i = 0; i < lightsData.length;) {
			const pv = posList[j];
			pv.w = 0.00002;
			pv.toArray4(lightsData, i);
			j++;
			i += 4;
		}
		console.log("createLightData(), lightsData: \n", lightsData);
		let lightColorsData = new Float32Array([
			13.0, 13.0, 0.0, 0.00002,
			0.0, 5.0, 1.0, 0.00002,
			0.0, 5.0, 5.0, 0.00002
		]);
		return { lightsData, lightColorsData };
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => { };
	run(): void {
		this.mRscene.run();
	}
}

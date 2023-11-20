import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

import { ModelEntity } from "../entity/ModelEntity";
import { BasePBRMaterial } from "../material/BasePBRMaterial";
import Vector3 from "../math/Vector3";

export class BasePbrMaterialTest2 {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("BasePbrMaterialTest2::initialize() ...");

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

		let monkeySrc = new ModelEntity({
			modelUrl: "static/assets/draco/monkey.drc"
		});
		
		let pos = new Vector3(0, 0, -150);

		let material = this.createModelEntity(monkeySrc, "gold", pos);
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.1, 0.7, 0.5];
		property.arms.value = [1, 0.1, 1];
		property.armsBase.value = [0, 0, 0];

		material = this.createModelEntity(monkeySrc, "rusted_iron", pos.clone().addBy(new Vector3(0, 0, 300)));
		property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.1, 0.7, 0.5];
		property.arms.value = [1, 0.5, 0];
		property.armsBase.value = [0, 1, 1];
		property.uvParam.value = [2, 2];
		let toneParam = property.toneParam
		toneParam.tone = 1.0;
		toneParam.sideIntensity = 30;

		
		material = this.createModelEntity(monkeySrc, "rusted_iron", pos.clone().addBy(new Vector3(-200, 0, 150)));
		property = material.property;
		property.arms.value = [1, 0.3, 1];
		property.armsBase.value = [0, 0, 0];
		property.uvParam.value = [2, 2];

	}
	private createModelEntity(srcEntity: ModelEntity, texName: string, position: Vector3DataType): BasePBRMaterial {

		let rc = this.mRscene;
		
		let lightData = this.createLightData();

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
	private createLightData(): { lightsData: Float32Array; lightColorsData: Float32Array } {
		let lightsData = new Float32Array([0.0, 300.0, 0, 0.000001]);
		let lightColorsData = new Float32Array([5.0, 5.0, 5.0, 0.000005]);
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

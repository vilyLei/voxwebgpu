import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

import { SphereEntity } from "../entity/SphereEntity";
import { ModelEntity } from "../entity/ModelEntity";
import { BasePBRMaterial } from "../material/BasePBRMaterial";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";

export class BasePbrMaterialTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("BasePbrMaterialTest::initialize() ...");

		this.mRscene.initialize({ canvasWith: 512, canvasHeight: 512, rpassparam: { multisampled: true } });
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
		let sphSrc = new SphereEntity({
			radius: 100,
			segments: 30,
			rings: 30
		});

		let lightData = this.createLightData();

		let startV = new Vector3(-500, 0, -500);
		for (let i = 0; i < 3; ++i) {
			for (let j = 0; j < 5; ++j) {

				let pos = new Vector3(j * 300 + startV.x, 0, i * 600 + startV.z);

				let roughness = 1.0 - (0.05 + 0.95 * j/(5-1));
				let roughnessBase = i/(3-1);
				let material = new BasePBRMaterial();
				let property = material.property;
				property.setLightData(lightData.lightsData, lightData.lightColorsData);
				property.ambient.value = new Color4().randomRGB(0.3, 0.1);
				property.albedo.value = new Color4().randomRGB(1.0, 0.2);
				property.arms.value = [1, roughness, 1];
				property.armsBase.value = [0, roughnessBase ,0];

				material.addTextures(this.createTextures("gold"));

				let sph = new SphereEntity({
					materials: [material],
					geometry: sphSrc.geometry
				});
				sph.transform.setPosition(pos);
				rc.addEntity(sph);

				material = new BasePBRMaterial();
				property = material.property;
				property.setLightData(lightData.lightsData, lightData.lightColorsData);

				property.ambient.value = new Color4().randomRGB(0.3, 0.1).ceil();
				property.albedo.value = new Color4().randomRGB(1.0, 0.2);
				property.arms.value = [1, roughness, 1];
				property.armsBase.value = [0, roughnessBase ,0];
				property.uvParam.value = [2,2];
				material.addTextures(this.createTextures("rusted_iron"));

				let monkey = new ModelEntity({
					materials: [material],
					geometry: monkeySrc.geometry,
					transform: { position: pos.clone().subtractBy(new Vector3(0, 0, 270)), scale: [100, 100, 100], rotation: [0, 90, 0] }
				});
				rc.addEntity(monkey);
			}
		}
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
	private mouseDown = (evt: MouseEvent): void => {};
	run(): void {
		this.mRscene.run();
	}
}

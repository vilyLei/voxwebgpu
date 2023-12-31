import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGTextureDataDescriptor } from "../texture/WGTextureWrapper";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";

import { ModelEntity } from "../entity/ModelEntity";
import { LightShaderDataParam, BasePBRMaterial } from "../material/BasePBRMaterial";
import Vector3 from "../math/Vector3";
import { AxisEntity } from "../entity/AxisEntity";
import Color4 from "../material/Color4";
import { BillboardEntity } from "../entity/BillboardEntity";
import { BoxEntity } from "../entity/BoxEntity";
export class BasePbrMaterialMultiLights {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("BasePbrMaterialMultiLights::initialize() ...");

		this.mRscene.initialize({ rpassparam: { multisampled: true } });
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
		let callback = (): void => {

			let pos = new Vector3(0, 0, 0);

			// let material = this.createModelEntity(monkeySrc, "grass", pos);
			// let material = this.createModelEntity(monkeySrc, "rusted_iron", pos);
			// let material = this.createModelEntity(monkeySrc, "gold", pos);
			let material = this.createModelEntity(monkeySrc, "plastic", pos);
			let property = material.property;
			property.ambient.value = [0.0, 0.2, 0.2];
			property.albedo.value = [0.7, 0.7, 0.3];
			property.arms.roughness = 0.8;
			property.armsBase.value = [0, 0, 0];
			property.uvParam.value = [2, 2];
			// property.specularFactor.value = [0.0,0.0,1.1];
			property.param.scatterIntensity = 32;

			this.createBoxEntity("plastic", new Vector3(0, -110.0, 0), this.mLightParams[0]);

			this.createBillboards(this.mLightParams[0]);
		};
		let monkeySrc = new ModelEntity({
			callback,
			modelUrl: "static/assets/draco/monkey.drc"
		});
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createModelEntity(srcEntity: ModelEntity, texName: string, position: Vector3DataType): BasePBRMaterial {
		let rc = this.mRscene;

		let lightParam = this.createLocalLightsData(position);

		let material = new BasePBRMaterial();

		material.setLightParam(lightParam);
		material.addTextures(this.createTextures(texName));
		let monkey = new ModelEntity({
			materials: [material],
			geometry: srcEntity.geometry,
			transform: { position, scale: [100, 100, 100], rotation: [0, 90, 0] }
		});
		rc.addEntity(monkey);

		return material;
	}

	private createBoxEntity(texName: string, position: Vector3DataType, lightParam: LightShaderDataParam): BasePBRMaterial {
		let rc = this.mRscene;

		let material = new BasePBRMaterial();

		material.setLightParam(lightParam);
		material.addTextures(this.createTextures(texName));
		let box = new BoxEntity({
			materials: [material],
			transform: { position, scale: [7, 0.1, 7] }
		});
		rc.addEntity(box);
		return material;
	}
	private createLocalLightsData(position: Vector3DataType): LightShaderDataParam {

		let pos = new Vector3().setVector4(position);
		let pv0 = pos.clone().addBy(new Vector3(0, 200, 0));
		let pv1 = pos.clone().addBy(new Vector3(200, 0, 0));
		let pv2 = pos.clone().addBy(new Vector3(0, 0, 200));
		let pv3 = pos.clone().addBy(new Vector3(-200, 0, 0));
		let pv4 = pos.clone().addBy(new Vector3(0, 0, -200));
		let posList = [pv0, pv1, pv2, pv3, pv4];

		let c0 = new Color4(0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.0, 0.00002);
		let c1 = new Color4(0.0, 0.1 + Math.random() * 13, 1.0, 0.00002);
		let c2 = new Color4(0.0, 0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.00002);
		let c3 = new Color4(0.1 + Math.random() * 13, 1.0, 0.1 + Math.random() * 13, 0.00002);
		let c4 = new Color4(0.5, 1.0, 0.1 + Math.random() * 13, 0.00002);

		let colorList = [c0, c1, c2, c3, c4];

		let pointLightsTotal = posList.length;

		let j = 0;
		let lightsData = new Float32Array(4 * pointLightsTotal);
		let lightColorsData = new Float32Array(4 * pointLightsTotal);

		for (let i = 0; i < lightsData.length; ) {
			const pv = posList[j];
			pv.w = 0.00002;
			pv.toArray4(lightsData, i);

			const c = colorList[j];
			c.toArray4(lightColorsData, i);

			j++;
			i += 4;
		}
		let param = { lights: lightsData, colors: lightColorsData, pointLightsTotal };
		this.mLightParams.push(param);
		return param;
	}
	private createBillboards(param: LightShaderDataParam): void {
		let rc = this.mRscene;

		let pointLightsTotal = param.pointLightsTotal;
		let lights = param.lights;
		let colors = param.colors;
		let diffuseTex0 = { diffuse: { url: "static/assets/flare_core_03.jpg" } };
		for (let i = 0; i < pointLightsTotal; ++i) {
			let billboard = new BillboardEntity({ size: 50, textures: [diffuseTex0] });
			let pv = new Vector3().fromArray3(lights, i * 4);
			let c = new Color4().fromArray3(colors, i * 4);
			c.a = 1.0;
			billboard.color = c.scaleBy(0.1);
			billboard.scale = 1.0;
			billboard.transform.setPosition(pv);
			rc.addEntity(billboard);
		}
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

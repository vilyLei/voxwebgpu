import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { ModelEntity } from "../entity/ModelEntity";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class MaskTextureEffect {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("MaskTextureEffect::initialize() ...");

		const body = document.body;
		// body.style.background = '#000000';

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
		// const emissiveTex = { emissive: { url: `static/assets/color_07.jpg` } };
		const opacityTex = { opacity: { url: `static/assets/mask01.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			aoTex,
			roughnessTex,
			metallicTex,
			opacityTex
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private createArmTextures(): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbrtex/rough_plaster_broken_diff_1k.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbrtex/rough_plaster_broken_nor_1k.jpg` } };
		const armTex = { arm: { url: `static/assets/pbrtex/rough_plaster_broken_arm_1k.jpg` } };
		// const emissiveTex = { emissive: { url: `static/assets/color_07.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			armTex
		] as WGTextureDataDescriptor[];
		return textures;
	}

	private initScene(): void {
		const rc = this.mRscene;
		let entity0 = new FixScreenPlaneEntity({ blendModes: ["transparent"], depthWriteEnabled: false }).setColor([0.2, 0.5, 0.4]);
		// let entity0 = new FixScreenPlaneEntity().setColor([0.2, 0.5, 0.7]);
		rc.addEntity(entity0);

		// let diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		// diffuseTex = { diffuse: { url: "static/assets/blueTransparent.png", flipY: true } };
		// diffuseTex = { diffuse: { url: "static/assets/xulie_08_61.png", flipY: true } };
		// let entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [diffuseTex], blendModes:["transparent"] });
		// entity.uvScale = [2, 2];
		// entity.uvOffset = [0.2, 0.3];
		// entity.setColor([1,1,1, 0.4]);
		// // rc.addEntity(entity);
		this.initEntities();
	}
	private mMonkeySrc: ModelEntity;
	private initEntities(): void {

		let callback = (): void => {
			// this.initARMTexDisp();
			this.initTexDisp();
		};
		this.mMonkeySrc = new ModelEntity({
			callback,
			modelUrl: "static/assets/draco/monkey.drc"
		});
	}
	private initARMTexDisp(): void {
		let textures = this.createArmTextures();
		let material = this.createModelEntity(this.mMonkeySrc, new Vector3(0, 0, -150), textures);
		this.applyMaterialPPt(material);
	}
	private initTexDisp(): void {
		let textures = this.createTextures("plastic");
		let material = this.createModelEntity(this.mMonkeySrc, new Vector3(0, 0, 150), textures);
		material.property.inverseMask = false;
		this.applyMaterialPPt(material);

		material = this.createModelEntity(this.mMonkeySrc, new Vector3(0, 0, -150), textures);
		material.property.inverseMask = true;
		this.applyMaterialPPt(material);
	}
	private applyMaterialPPt(material: BasePBRMaterial): void {
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		// property.uvParam.value = [2, 2];
		property.param.scatterIntensity = 32;
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createModelEntity(srcEntity: ModelEntity, position: Vector3DataType, textures: WGTextureDataDescriptor[]): BasePBRMaterial {
		let rc = this.mRscene;

		let lightParam = this.createLightData(position);

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: 'back',
			blendModes: ["transparent"]
		};
		let material = new BasePBRMaterial({ pipelineDefParam });

		material.setLightParam(lightParam);
		material.addTextures(textures);
		// let monkey = new ModelEntity({
		// 	materials: [material],
		// 	geometry: srcEntity.geometry,
		// 	transform: { position, scale: [100, 100, 100], rotation: [0, 90, 0] },
		// 	blendModes: ["transparent"]
		// });
		// rc.addEntity(monkey);

		let sphere = new SphereEntity(
			{
				radius: 150.0,
				materials: [material],
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		return material;
	}

	private createLightData(position: Vector3DataType): LightShaderDataParam {
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

		for (let i = 0; i < lightsData.length;) {
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
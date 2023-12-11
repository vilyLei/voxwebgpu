import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { createLocalLightsData } from "./utils/lightUtil";

export class MaskTextureEffect {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("MaskTextureEffect::initialize() ...");

		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam:
			{
				multisampled: true,
				clearColor: [0.2,0.3,0.1]
			}
		});
		this.initScene();
		this.initEvent();
	}

	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createMaskTextures(ns: string, maskns = 'displacement_01.jpg'): WGTextureDataDescriptor[] {

		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		// mask texture
		const opacityTex = { opacity: { url: `static/assets/${maskns}` } };

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

	private createBaseTextures(): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbrtex/rough_plaster_broken_diff_1k.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbrtex/rough_plaster_broken_nor_1k.jpg` } };
		const armTex = { arm: { url: `static/assets/pbrtex/rough_plaster_broken_arm_1k.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			armTex
		] as WGTextureDataDescriptor[];
		return textures;
	}

	private initScene(): void {

		let rc = this.mRscene;

		let position = [0, 0, 180];
		let materials = this.createMaterials(position);
		let sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position =  [0, 0, -180];
		materials = this.createMaterials(position, [4, 1]);
		let torus = new TorusEntity({
			axisType: 1,
			materials,
			transform: { position }
		});
		rc.addEntity(torus);

	}
	private createMaterials(position: Vector3DataType, uvParam?: number[]): BasePBRMaterial[] {
		let textures0 = this.createBaseTextures();
		let textures1 = this.createMaskTextures("plastic");
		let textures2 = this.createMaskTextures("wall", 'circleWave_disp.png');

		let material0 = this.createMaterial(position, textures0, ["solid"]);
		this.applyMaterialPPt(material0);

		let material1 = this.createMaterial(position, textures1, ["transparent"], 'less-equal', material0.getLightParam());
		material1.property.inverseMask = false;
		this.applyMaterialPPt(material1);

		let material2 = this.createMaterial(position, textures2, ["transparent"], 'less-equal', material0.getLightParam());
		material2.property.inverseMask = true;
		this.applyMaterialPPt(material2);
		let list = [material0, material1, material2];

		// let list = [material0, material1];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}
	private applyMaterialPPt(material: BasePBRMaterial): void {
		let property = material.property;
		property.ambient.value = [0.0, 0.2, 0.2];
		property.albedo.value = [0.7, 0.7, 0.3];
		property.arms.roughness = 0.8;
		property.armsBase.value = [0, 0, 0];
		property.param.scatterIntensity = 32;
	}
	private createMaterial(position: Vector3DataType, textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		if (!lightParam) {
			lightParam = createLocalLightsData(position);
		}
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: 'back',
			blendModes,
			depthCompare
		};
		let material = new BasePBRMaterial({ pipelineDefParam });
		material.setLightParam(lightParam);
		material.addTextures(textures);
		return material;
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

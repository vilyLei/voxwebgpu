import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { createLightData } from "./utils/lightUtil";

export class FogTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("FogTest::initialize() ...");

		this.mRscene.initialize(
			{
				webBodyBackground: '#000000',
				canvasWith: 512,
				canvasHeight: 512,
				rpassparam: { multisampled: true }
			}
		);
		this.initScene();
		this.initEvent();
	}

	private initScene(): void {
		let rc = this.mRscene;

		let textures0 = this.createBaseTextures();
		let textures1 = this.createTextures("plastic");

		let position = [0, 0, 0];
		let materials = this.createMaterials(position, textures0, 'front');
		let box = new CubeEntity(
			{
				cubeSize: 1850.0,
				normalScale: -1.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(box);

		position = [-580, 280, -580];
		materials = this.createMaterials(position, textures1);
		let sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position = [0, 0, 280];
		materials = this.createMaterials(position, textures1);
		sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position = [0, 0, -380];
		materials = this.createMaterials(position, textures1, 'back', [8, 1]);
		let torus = new TorusEntity({
			axisType: 2,
			materials,
			transform: { position }
		});
		rc.addEntity(torus);

	}
	private createMaterials(position: Vector3DataType, textures: WGTextureDataDescriptor[], faceCullMode = 'back', uvParam?: number[]): BasePBRMaterial[] {

		let material0 = this.createMaterial(position, textures, faceCullMode);
		let ppt = material0.property;
		ppt.fogExp2Enabled = true;
		ppt.fogColor.value = [0.3, 0.7, 0.2];
		this.applyMaterialPPt(material0);

		let list = [material0];
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
	private createMaterial(position: Vector3DataType, textures: WGTextureDataDescriptor[], faceCullMode = 'back', depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		if (!lightParam) {
			lightParam = createLightData(position);
		}
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			depthCompare
		};
		let material = new BasePBRMaterial({ pipelineDefParam });
		material.setLightParam(lightParam);
		material.addTextures(textures);
		return material;
	}

	private hdrEnvtex = new SpecularEnvBrnTexture();

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
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		const emissiveTex = { emissive: { url: `static/assets/color_07.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			aoTex,
			roughnessTex,
			metallicTex,
			emissiveTex
		] as WGTextureDataDescriptor[];
		return textures;
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

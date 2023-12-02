import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";

export class FogTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("FogTest::initialize() ...");

		const body = document.body;
		// body.style.background = '#000000';

		this.mRscene.initialize({ canvasWith: 512, canvasHeight: 512, rpassparam: { multisampleEnabled: true } });
		this.initScene();
		this.initEvent();
	}


	private initScene(): void {
		this.initEntities();
	}
	private initEntities(): void {

		this.initTexDisp();
	}
	private initTexDisp(): void {
		let rc = this.mRscene;

		let textures0 = this.createBaseTextures();
		let textures1 = this.createTextures("plastic");


		let position = new Vector3(0, 0, 0);
		let materials = this.createMaterials(position, textures0, 'front');
		let box = new CubeEntity(
			{
				cubeSize: 1550.0,
				normalScale: -1.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(box);

		position = new Vector3(-580, 280, -580);
		materials = this.createMaterials(position, textures1);
		let sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position = new Vector3(0, 0, 280);
		materials = this.createMaterials(position, textures1);
		sphere = new SphereEntity(
			{
				radius: 150.0,
				materials,
				transform: { position }
			}
		);
		rc.addEntity(sphere);

		position = new Vector3(0, 0, -380);
		materials = this.createMaterials(position, textures1, 'back', [8, 1]);
		let torus = new TorusEntity({
			axisType: 2,
			materials,
			transform: { position }
		});
		rc.addEntity(torus);

	}
	private createMaterials(position: Vector3, textures: WGTextureDataDescriptor[], faceCullMode = 'back', uvParam?: number[]): BasePBRMaterial[] {

		let material0 = this.createMaterial(position, textures, faceCullMode, ["solid"]);
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
		// property.uvParam.value = [2, 2];
		property.param.scatterIntensity = 32;
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createMaterial(position: Vector3DataType, textures: WGTextureDataDescriptor[], faceCullMode = 'back', blendModes?: string[], depthCompare = 'less', lightParam?: LightShaderDataParam): BasePBRMaterial {

		if (!lightParam) {
			lightParam = this.createLightData(position);
		}
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes,
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

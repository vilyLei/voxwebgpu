import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { WGShaderConstructor } from "../material/shader/WGShaderConstructor";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";
import { BillboardEntity } from "../entity/BillboardEntity";
import { BasePBRMaterial, LightShaderDataParam } from "../material/BasePBRMaterial";
import { BoxEntity } from "../entity/BoxEntity";
import { ModelEntity } from "../entity/ModelEntity";
import { AxisEntity } from "../entity/AxisEntity";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";

export class ShaderConstructing {
	private mRscene = new RendererScene();
	private mShaderCtor = new WGShaderConstructor();
	private basePBRShaderSrc = {
		shaderSrc: { code: "", uuid: "wholeBasePBRShdCode-test01" }
	};
	initialize(): void {
		console.log("ShaderConstructing::initialize() ...");

		// this.mRscene.initialize({ rpassparam: { multisampled: true } });
		// this.initShaderBuild();
		this.initScene();
		this.initEvent();
	}
	private initShaderBuild(): void {
		let shdCtor = this.mShaderCtor;
		let preDefCode = `
#define USE_GLOSSINESS 1
#define USE_TONE_MAPPING
#define USE_METALLIC_CORRECTION
`;
		// let codeStr = shdCtor.build(preDefCode);
		let codeStr = shdCtor.testBuild(preDefCode);
		this.basePBRShaderSrc.shaderSrc.code = codeStr;
	}

	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		const albedoTex = { albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } };
		const normalTex = { normal: { url: `static/assets/pbr/${ns}/normal.jpg` } };
		const aoTex = { ao: { url: `static/assets/pbr/${ns}/ao.jpg` } };
		const roughnessTex = { roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } };
		const metallicTex = { metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } };
		let textures = [
			this.hdrEnvtex,
			albedoTex,
			normalTex,
			aoTex,
			roughnessTex,
			metallicTex
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private initScene(): void {
		this.initEntities();
	}
	private initEntities(): void {
		let rc = this.mRscene;

		// rc.addEntity(new AxisEntity());
		let callback = (): void => {
			let pos = new Vector3(0, 0, 0);

			// let material = this.createModelEntity(monkeySrc, "grass", pos);
			// let material = this.createModelEntity(monkeySrc, "rusted_iron", pos);
			// let material = this.createModelEntity(monkeySrc, "gold", pos);
			let material = this.createModelEntity(monkeySrc, "plastic", pos, [100, 100, 100]);
			let property = material.property;
			// property.glossiness = false;
			property.ambient.value = [0.0, 0.2, 0.2];
			property.albedo.value = [0.7, 0.7, 0.3];
			// property.albedo.value = [0.0, 0.1, 0.7];
			property.arms.roughness = 0.8;
			property.armsBase.value = [0, 0, 0];
			property.uvParam.value = [2, 2];
			// property.specularFactor.value = [0.0,0.0,1.1];
			property.param.scatterIntensity = 32;

			// this.createBoxEntity("plastic", new Vector3(0, -110.0, 0), this.mLightParams[0]);

		};
		let monkeySrc = new ModelEntity({
			callback,
			// modelUrl: "static/assets/draco/portal.drc"
			modelUrl: "static/assets/draco/monkey.drc"
		});
	}
	private mLightParams: LightShaderDataParam[] = [];
	private createModelEntity(srcEntity: ModelEntity, texName: string, position: Vector3DataType, scale?: Vector3DataType): BasePBRMaterial {
		let rc = this.mRscene;

		let lightParam = this.createLocalLightsData(position);

		// let shaderSrc = {
		// 	shaderSrc: { code: this.basePBRShaderSrc.shaderSrc.code, uuid: "wholeBasePBRShdCode" }
		// };
		// let material = new BasePBRMaterial({ shadinguuid: "basePbrMaterial-test01", shaderSrc: this.basePBRShaderSrc });
		let material = new BasePBRMaterial();

		material.setLightParam(lightParam);
		material.addTextures(this.createTextures(texName));
		let monkey = new ModelEntity({
			materials: [material],
			geometry: srcEntity.geometry,
			transform: { position, scale: scale, rotation: [0, 90, 0] }
		});
		rc.addEntity(monkey);

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

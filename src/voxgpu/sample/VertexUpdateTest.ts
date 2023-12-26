import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BaseMaterial } from "../material/BaseMaterial";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { MtLightDataDescriptor } from "../material/mdata/MtLightDataDescriptor";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { BillboardEntity } from "../entity/BillboardEntity";
import { ModelEntity } from "../entity/ModelEntity";
import { CylinderRandomRange } from "../utils/RandomRange";

export class VertexUpdateTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("VertexUpdateTest::initialize() ...");
		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			mtplEnabled: true,
			rpassparam:
			{
				multisampled: true
			}
		});
		this.initScene();
		this.initEvent();
	}
	private mLightData: MtLightDataDescriptor;
	private createLightData(): MtLightDataDescriptor {
		let ld = { pointLights: [], directionLights: [], spotLights: [] } as MtLightDataDescriptor;

		let space = new CylinderRandomRange();
		space.minRadius = 130;
		space.maxRadius = 260;
		space.minHeight = 10;
		space.maxHeight = 300;
		space.initialize();
		space.setSpaceScale(1.0, 1.0, 0.5);

		let total = 5;
		let scale = 8.0;
		for (let i = 0; i < total; ++i) {
			for (let j = 0; j < total; ++j) {
				space.calc();
				let position = space.value;
				let color = this.getRandomColor(scale);
				let factor1 = 0.0001;
				let factor2 = 0.0002;
				let pLight = new PointLight({ color, position, factor1, factor2 });
				ld.pointLights.push(pLight);
				if (Math.random() > 0.5) {
					space.calc();
					position = space.value;
					color = this.getRandomColor(scale);
					let direction = [(Math.random() - 0.5) * 8, -1, (Math.random() - 0.5) * 8];
					let degree = Math.random() * 10 + 5;
					let spLight = new SpotLight({ position, color, direction, degree, factor1, factor2 });
					ld.spotLights.push(spLight);
				}
			}
		}

		let dLight = new DirectionLight({ color: [0.5, 0.5, 0.5], direction: [-1, -1, 0] });
		ld.directionLights.push(dLight);
		return ld;
	}
	private initScene(): void {

		let rc = this.mRscene;

		let mtpl = rc.renderer.mtpl;

		this.mLightData = this.createLightData();

		mtpl.light.lightData = this.mLightData;
		mtpl.shadow.intensity = 0.4;
		mtpl.shadow.radius = 1;

		this.mTexType = 1;
		let position = [0, 0, 0];
		let materials = this.createMaterials(true);
		let modelEntity = new ModelEntity({
			transform: { position },
			materials,
			modelUrl: "static/assets/draco/portal.drc"
		});
		rc.addEntity(modelEntity);
		
		this.mTexType = 0;
		position = [0, 0, 0];
		materials = this.createMaterials2(true, true, "back",[6,6]);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent: [-600, -600, 1200, 1200],
			transform: { position }
		});
		rc.addEntity(plane);


	}
	
	private createTextures(ns: string): WGTextureDataDescriptor[] {
		return [
			{ specularEnv: {} },
			{ albedo: { url: `static/assets/pbr/${ns}/albedo.jpg` } },
			{ normal: { url: `static/assets/pbr/${ns}/normal.jpg` } },
			{ ao: { url: `static/assets/pbr/${ns}/ao.jpg` } },
			{ roughness: { url: `static/assets/pbr/${ns}/roughness.jpg` } },
			{ metallic: { url: `static/assets/pbr/${ns}/metallic.jpg` } },
			{ parallax: { url: `static/assets/pbr/${ns}/parallax.jpg` } }
		];
	}
	private createArmTextures2(): WGTextureDataDescriptor[] {
		
		let flipY = true;
		return [
			{ specularEnv: {} },
			{ albedo: { url: `static/assets/glb/portal/portal_img2.jpg`, flipY } },
			{ normal: { url: `static/assets/glb/portal/portal_img3.jpg`, flipY } },
			{ arm: { url: `static/assets/glb/portal/portal_img1.jpg`, flipY } },
			{ emissive: { url: `static/assets/glb/portal/portal_img0.jpg`, flipY } }
		];
	}
	private createArmTextures1(): WGTextureDataDescriptor[] {
		let flipY = false;
		let textures = [
			{ specularEnv: {} },
			{ albedo: { url: `static/assets/pbrtex/medieval_blocks_02_diff_1k.jpg`, flipY } },
			{ normal: { url: `static/assets/pbrtex/medieval_blocks_02_nor_1k.jpg`, flipY } },
			{ arm: { url: `static/assets/pbrtex/medieval_blocks_02_arm_1k.jpg`, flipY } },
			{ parallax: { url: `static/assets/pbrtex/medieval_blocks_02_disp_1k.jpg`, flipY } },
			{ opacity: { url: `static/assets/metal_02.jpg` } }
		];
		return textures;
	}
	private mTexType = 0;
	private createMaterials(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {

		let textures0 = this.mTexType < 1 ? this.createTextures("wall") : this.createArmTextures2();

		let material0 = this.createMaterial(textures0, ["solid"], 'less', faceCullMode);
		this.applyMaterialPPt(material0, shadowReceived, shadow);
		let list = [material0];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}
	
	private createMaterials2(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {

		let textures0 = this.createTextures("wall");
		let textures1 = this.createArmTextures1();

		let material0 = this.createMaterial(textures0, ["solid"], 'less', faceCullMode);
		this.applyMaterialPPt(material0, shadowReceived, shadow);

		let material1 = this.createMaterial(textures1, ["transparent"], 'less-equal', faceCullMode);
		material1.property.inverseMask = false;
		this.applyMaterialPPt(material1, shadowReceived, shadow);
		let list = [material0, material1];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		// material1.property.albedo.value = cvs;
		material1.property.uvParam.value = [2,2];
		return list;
	}

	getRandomColor(s?: number): ColorDataType {
		if (s === undefined) {
			s = 1.0;
		}
		let i = Math.round(Math.random() * 99999)%256;
		let j = Math.round(Math.random() * 99999 + i)%256;
		let k = Math.round(Math.random() * 99999 + i + j)%256;
		
		let cs = [s * (i / 255.0), s * (j / 255.0), s * (1.0 - (k / 255.0))];
		console.log("xxxxxx cs: ", cs);
		return cs;
	}
	private applyMaterialPPt(material: BaseMaterial, shadowReceived = false, shadow = true): void {
		let ppt = material.property;
		ppt.ambient.value = [0.2, 0.2, 0.2];
		let cvs = this.getRandomColor(1.0) as number[];
		// cvs[0] = cvs[0] * 0.5 + 0.7;
		// cvs[1] = cvs[1] * 0.5 + 0.7;
		// cvs[2] = cvs[2] * 0.5 + 0.7;
		ppt.albedo.value = cvs;
		ppt.arms.roughness = Math.random() * 0.95 + 0.05;
		ppt.arms.metallic = 0.2;
		ppt.armsBase.value = [0, 0.2, 0];
		ppt.specularFactor.value = [0.1, 0.1, 0.1];

		ppt.shadow = shadow;
		ppt.lighting = true;

		ppt.shadowReceived = shadowReceived;
	}
	private createMaterial(textures: WGTextureDataDescriptor[], blendModes: string[], depthCompare = 'less', faceCullMode = 'back'): BaseMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes,
			depthCompare
		};
		let material = new BaseMaterial({ pipelineDefParam });
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

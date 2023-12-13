import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BaseMaterial } from "../material/BaseMaterial";
import { SpecularEnvBrnTexture } from "../texture/SpecularEnvBrnTexture";
import { WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { SphereEntity } from "../entity/SphereEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { MtLightDataDescriptor } from "../material/mdata/MtLightDataDescriptor";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";

export class MultiLightsShading2 {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("MultiLightsShading2::initialize() ...");

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

	private hdrEnvtex = new SpecularEnvBrnTexture();
	private createBaseTextures(): WGTextureDataDescriptor[] {
		let textures = [
			this.hdrEnvtex,
		] as WGTextureDataDescriptor[];
		return textures;
	}
	private initScene(): void {

		let rc = this.mRscene;

		let mtpl = rc.renderer.mtpl;

		mtpl.light.lightData = this.createLightData();
		mtpl.shadow.param.intensity = 0.6;
		mtpl.shadow.param.radius = 1;

		let position = [-30, 220, -50];
		let materials = this.createMaterials(true);

		// let sphA = new SphereEntity(
		// 	{
		// 		radius: 80.0,
		// 		materials,
		// 		transform: { position }
		// 	}
		// );
		// rc.addEntity(sphA);

		let sphere: SphereEntity;
		let total = 5;
		for (let i = 0; i < total; ++i) {
			for (let j = 0; j < total; ++j) {
				if (total > 1) {
					position = [-350 + 150 * j, -10, -350 + 150 * i];
				} else {
					position = [0, 50, 0];
				}
				if (sphere) {
					let sph = new SphereEntity(
						{
							geometry: sphere.geometry,
							materials,
							transform: { position }
						}
					);
					rc.addEntity(sph);
				} else {
					sphere = new SphereEntity(
						{
							radius: 35.0,
							materials,
							transform: { position }
						}
					);

					rc.addEntity(sphere);
				}
			}
		}

		position = [0, -50, 0];
		materials = this.createMaterials(true, false, 'back', [3, 3]);
		let plane = new PlaneEntity({
			axisType: 1,
			materials,
			extent: [-600, -600, 1200, 1200],
			transform: { position }
		});
		rc.addEntity(plane);

	}
	private createMaterials(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {
		let textures0 = this.createBaseTextures();

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

	private createLightData(): MtLightDataDescriptor {
		let ld = { pointLights: [], directionLights: [], spotLights: [] } as MtLightDataDescriptor;

		for (let i = 0; i < 5; ++i) {
			for (let j = 0; j < 5; ++j) {
				let position = [-250 + 150 * j, 50 + Math.random() * 50, -250 + 150 * i];
				position[0] += Math.random() * 100 - 50;
				position[2] += Math.random() * 100 - 50;
				let color = [Math.random() * 5 * i, Math.random() * 5, Math.random() * 5 * j];
				let pLight = new PointLight({ color, position });
				ld.pointLights.push(pLight);

				if (Math.random() > 0.5) {
					position = [-250 + 150 * j, 50 + Math.random() * 50, -250 + 150 * i];
					position[0] += Math.random() * 100 - 50;
					position[2] += Math.random() * 100 - 50;
					color = [Math.random() * 5, Math.random() * 5 * j, Math.random() * 5 * i];
					let spLight = new SpotLight({ position, color, direction: [Math.random() - 0.5, -1, Math.random() - 0.5], degree: 10 });
					ld.spotLights.push(spLight);
				}
			}
		}

		let dLight = new DirectionLight({ color: [0.5, 0.5, 0.5], direction: [-1, -1, 0] });
		ld.directionLights.push(dLight);
		return ld;
	}
	private applyMaterialPPt(material: BaseMaterial, shadowReceived = false, shadow = true): void {
		let ppt = material.property;
		ppt.ambient.value = [0.1, 0.1, 0.1];
		ppt.albedo.value = [0.7, 0.7, 0.7];
		ppt.arms.roughness = 0.25;
		ppt.arms.metallic = 0.2;
		ppt.armsBase.value = [0, 0, 0];
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

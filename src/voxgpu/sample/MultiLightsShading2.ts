import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { BaseMaterial } from "../material/BaseMaterial";
import { SphereEntity } from "../entity/SphereEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { MtLightDataDescriptor } from "../material/mdata/MtLightDataDescriptor";
import { PointLight } from "../light/base/PointLight";
import { DirectionLight } from "../light/base/DirectionLight";
import { SpotLight } from "../light/base/SpotLight";
import { BillboardEntity } from "../entity/BillboardEntity";

export class MultiLightsShading2 {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("MultiLightsShading2::initialize() ...");
		this.loadImg();
	}
	initSys(): void {

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
	private mPixels: Uint8ClampedArray;
	private mPixelsW = 128;
	private mPixelsH = 128;
	getRandomColor(s?: number): ColorDataType {
		if (s === undefined) {
			s = 1.0;
		}
		let i = 5;
		let j = Math.floor(Math.random() * this.mPixelsW);
		let k = i * this.mPixelsW + j;
		let vs = this.mPixels;
		k *= 4;
		let cs = [s * vs[k] / 255.0, s * vs[k + 1] / 255.0, s * vs[k + 2] / 255.0];
		return cs;
	}
	private loadImg(): void {
		let img = new Image();
		img.onload = evt => {
			this.mPixelsW = img.width;
			this.mPixelsH = img.height;
			let canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			let ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			this.mPixels = ctx.getImageData(0, 0, img.width, img.height).data;
			this.initSys();
		}
		img.src = 'static/assets/colorPalette.jpg';
	}
	private mLightData: MtLightDataDescriptor;
	private createLightData(): MtLightDataDescriptor {
		let ld = { pointLights: [], directionLights: [], spotLights: [] } as MtLightDataDescriptor;

		let total = 5;
		let scale = 3;
		for (let i = 0; i < total; ++i) {
			let fi = i / (total - 1);
			for (let j = 0; j < total; ++j) {
				let fj = j / (total - 1);
				fi = 1;
				fj = 1;
				let position = [-500 + 250 * j, 50 + Math.random() * 30, -500 + 250 * i];
				position[0] += Math.random() * 60 - 30;
				position[2] += Math.random() * 60 - 30;
				let color = this.getRandomColor(scale);
				let factor1 = 0.00001;
				let factor2 = 0.00002;
				let pLight = new PointLight({ color, position, factor1, factor2 });
				ld.pointLights.push(pLight);
				if (Math.random() > 0.5) {
					position = [-500 + 250 * j, 50 + Math.random() * 30, -500 + 250 * i];
					position[0] += Math.random() * 70 - 35;
					position[2] += Math.random() * 70 - 35;
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
	private createBillboard(pv: Vector3DataType, c: ColorDataType, type: number): void {
		let rc = this.mRscene;
		let diffuseTex0 = { diffuse: { url: "static/assets/flare_core_03.jpg" } };
		if (type > 1) {
			diffuseTex0 = { diffuse: { url: "static/assets/circleWave_disp.png" } };
		}
		let billboard = new BillboardEntity({ size: 10, textures: [diffuseTex0] });
		billboard.color = c;
		billboard.alpha = 1.0;
		billboard.transform.setPosition(pv);
		rc.addEntity(billboard);
	}
	private createBillboards(): void {
		let lightData = this.mLightData;
		let pls = lightData.pointLights;
		for (let i = 0; i < pls.length; i++) {
			let lp = pls[i];
			this.createBillboard(lp.position, lp.color, 1);
		}
		let spls = lightData.spotLights;
		for (let i = 0; i < spls.length; i++) {
			let lp = spls[i];
			this.createBillboard(lp.position, lp.color, 2);
		}
	}
	private initScene(): void {

		let rc = this.mRscene;

		let mtpl = rc.renderer.mtpl;

		this.mLightData = this.createLightData();

		mtpl.light.lightData = this.mLightData;
		mtpl.shadow.param.intensity = 0.4;
		mtpl.shadow.param.radius = 4;

		let position = [-30, 220, -50];
		let materials = this.createMaterials(true);

		let sphere: SphereEntity;
		let total = 6;
		let py = -10;
		let k = 0;
		for (let i = 0; i < total; ++i) {
			for (let j = 0; j < total; ++j) {
				if (total > 2) {
					position = [-350 + 150 * j, py, -350 + 150 * i];
				} else {
					position = [0, py, 0];
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

		this.createBillboards();

	}
	private createMaterials(shadowReceived = false, shadow = true, faceCullMode = 'back', uvParam?: number[]): BaseMaterial[] {

		let material0 = this.createMaterial( ["solid"], 'less', faceCullMode);
		this.applyMaterialPPt(material0, shadowReceived, shadow);
		let list = [material0];
		if (uvParam) {
			for (let i = 0; i < list.length; ++i) {
				list[i].property.uvParam.value = uvParam;
			}
		}
		return list;
	}

	private applyMaterialPPt(material: BaseMaterial, shadowReceived = false, shadow = true): void {
		let ppt = material.property;
		ppt.ambient.value = [0.1, 0.1, 0.1];
		ppt.albedo.value = [0.8, 0.8, 0.8];
		ppt.arms.roughness = 0.25;
		ppt.arms.metallic = 0.2;
		ppt.armsBase.value = [0, 0, 0];
		ppt.specularFactor.value = [0.1, 0.1, 0.1];

		ppt.shadow = shadow;
		ppt.lighting = true;

		ppt.shadowReceived = shadowReceived;
	}
	private createMaterial(blendModes: string[], depthCompare = 'less', faceCullMode = 'back'): BaseMaterial {

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes,
			depthCompare
		};
		let material = new BaseMaterial({ pipelineDefParam });
		material.addTextures([{ specularEnv: {} }]);
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

import { Entity3D } from "../entity/Entity3D";
import { IRenderableObject } from "../render/IRenderableObject";
import { RendererScene } from "./RendererScene";
import { WGRendererConfig } from "./WGRendererParam";
import { DataDrivenEntityBuilder } from "./dataDriven/DataDrivenEntityBuilder";
import { DataDrivenEntityParamType, DataDrivenEntityParam } from "./dataDriven/DataDrivenEntityParam";
import { parseLightData, SceneDataImpl, DataDrivenSceneParam } from "./dataDriven/DataSceneDefine";

class DataDrivenRScene {
	private mBuilder = new DataDrivenEntityBuilder();
	private mScene: RendererScene;
	constructor(uidBase = 0) { this.mScene = new RendererScene(uidBase); }
	private mResource: any;
	get rscene(): RendererScene {
		return this.mScene;
	}

	initialize(param?: DataDrivenSceneParam): void {
		if (!param) param = {};
		let r = param.renderer;
		let scene = param.scene;
		if (scene && r === undefined) {
			r = scene.renderer;
		}
		r = r ? r : {};
		if (r.rpassparam === undefined) {
			r.rpassparam = { multisampled: true };
		}
		let mtplEnabled = r.mtplEnabled === true;
		let vsmShadow : any;// = scene.shadow;
		if(scene.shadow && scene.shadow.type === "vsm") {
			vsmShadow = scene.shadow;
			mtplEnabled = true;
		}
		r.mtpl = {
			enabled: mtplEnabled,
			vsm: vsmShadow
		}
		this.mScene.initialize(r);

		this.mResource = param.resource;
		this.initSceneComponents(scene, mtplEnabled);

		const entities = param.entities;
		if (entities && entities.length !== undefined) {
			for (let i = 0; i < entities.length; ++i) {
				this.addObject(entities[i]);
			}
		}
	}
	private initSceneComponents(sceneData: SceneDataImpl, mtplEnabled?: boolean): void {
		let rc = this.mScene;
		if(sceneData) {
			console.log("initSceneComponents(), mtplEnabled: ", mtplEnabled);
			if(mtplEnabled === true) {
		
				let mtpl = rc.renderer.mtpl;
				let lightData = parseLightData(sceneData.light);
				console.log("lightData: ", lightData);
				mtpl.light.lightData = lightData;
				// mtpl.shadow.intensity = 0.4;
				// mtpl.shadow.radius = 4;
				if(sceneData.fog) {
					let fogData = sceneData.fog;
					mtpl.fog.fogColor.value = fogData.color;
				}
			}
		}
	}
	/**
	 * 加入的可能是 entity 也能是 light对象 以及某种场景对象描述 等等
	 */
	addObject(entityParam: DataDrivenEntityParamType): void {
		let entity = this.mBuilder.createEntity(entityParam, this.mResource);
		this.mScene.addEntity(entity);
	}
	addEntity(entity: IRenderableObject): DataDrivenRScene {
		this.mScene.addEntity(entity);
		return this;
	}
	removeEntity(entity: IRenderableObject): void {
		this.mScene.removeEntity(entity);
	}
	/**
	 * @param type event type
	 * @param func event listerner callback function
	 * @param captureEnabled the default value is true
	 * @param bubbleEnabled the default value is false
	 */
	addEventListener(type: number, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {
		this.mScene.addEventListener(type, func, captureEnabled, bubbleEnabled);
	}
	/**
	 * @param type event type
	 * @param func event listerner callback function
	 */
	removeEventListener(type: number, func: (evt: any) => void): void {
		this.mScene.removeEventListener(type, func);
	}
	run(rendering = true): void {
		this.mScene.run(rendering);
	}
	destroy(): void { }
}
export { DataDrivenSceneParam, DataDrivenRScene }

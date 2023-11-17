import { Entity3D } from "../entity/Entity3D";
import { IRenderableObject } from "../render/IRenderableObject";
import { RendererScene } from "./RendererScene";
import { WGRendererConfig } from "./WGRendererParam";
import { DataDrivenEntityBuilder } from "./dataDriven/DataDrivenEntityBuilder";
import { DataDrivenEntityParamType, DataDrivenEntityParam } from "./dataDriven/DataDrivenEntityParam";
interface DataDrivenSceneParam {
	renderer?: WGRendererConfig;
	entities?: DataDrivenEntityParamType[];
}
class DataDrivenRScene  {
	private mBuilder = new DataDrivenEntityBuilder();
    private mScene: RendererScene;
    constructor(uidBase = 0) { this.mScene = new RendererScene(uidBase); }

	get rscene(): RendererScene {
		return this.mScene;
	}

    initialize(param?: DataDrivenSceneParam): void {
		if(!param) param = {};
		const r = param.renderer;
        this.mScene.initialize(r ? r : {});
		const entities = param.entities;
		if(entities && entities.length !== undefined) {
			for(let i = 0; i < entities.length; ++i) {
				this.addObject(entities[i]);
			}
		}
    }
	/**
	 * 加入的可能是 entity 也能是 light对象 以及某种场景对象描述 等等
	 */
    addObject(entityParam: DataDrivenEntityParamType, processIndex?: number): void {
		let entity = this.mBuilder.createEntity(entityParam);
		this.mScene.addEntity(entity, processIndex);
    }
	addEntity(entity: IRenderableObject, processIndex = 0): DataDrivenRScene {
		this.mScene.addEntity(entity, processIndex);
		return this;
	}
	removeEntity(entity: IRenderableObject): void {
		this.mScene.removeEntity( entity );
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
		this.mScene.run( rendering );
	}
	destroy(): void {}
}
export { DataDrivenSceneParam, DataDrivenRScene }

import { Entity3DParam } from "../entity/Entity3DParam";
import { RendererScene } from "./RendererScene";
import { WGRendererConfig } from "./WGRendererParam";

class DataDrivenRScene  {
    private mRscene: RendererScene;
    constructor(uidBase = 0) { this.mRscene = new RendererScene(uidBase); }
    initialize(config?: WGRendererConfig): void {
        this.mRscene.initialize(config);
    }
    addEntity(param: Entity3DParam, processIndex?: number): DataDrivenRScene {
        
        return this;
    }
}
export { DataDrivenRScene }
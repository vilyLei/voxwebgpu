import { RendererScene } from "./RendererScene";
import { WGRendererConfig } from "./WGRendererParam";
import { DataDrivenEntityParam } from "./dataDriven/DataDrivenEntityParam";

class DataDrivenRScene  {
    scene: RendererScene;
    constructor(uidBase = 0) { this.scene = new RendererScene(uidBase); }
    initialize(config?: WGRendererConfig): void {
        this.scene.initialize(config);
    }
    addEntity(entityParam: DataDrivenEntityParam, processIndex?: number): DataDrivenRScene {
        
        return this;
    }
}
export { DataDrivenRScene }
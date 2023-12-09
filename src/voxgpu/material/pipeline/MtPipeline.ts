import { LightPipeNode } from "./LightPipeNode";
import { VSMPipeNode } from "./VSMPipeNode";
import { MtBuilder } from "./MtBuilder";
import { MtPlNodePool } from "./MtPlNodePool";

/**
 * material pipeline
 */
class MtPipeline {
    private mInit = true;
    private mPool = new MtPlNodePool();
    light: LightPipeNode;
    shadow: VSMPipeNode;
    readonly builder = new MtBuilder( this.mPool );
    constructor() { }
    initialize(): void {
        if (this.mInit) {
            this.mInit = false;

            let pool = this.mPool;
            pool.initialize();

            let type = 'lighting';
            this.light = pool.getNodeByType(type) as LightPipeNode;

            type = 'vsmShadow';
            this.shadow = pool.getNodeByType(type) as VSMPipeNode;
        }
    }
}
export { MtPipeline };
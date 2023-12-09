import { LightPipeNode } from "./LightPipeNode";
import { VSMPipeNode } from "./VSMPipeNode";
import { MtBuilder } from "./MtBuilder";
import { MtPlNodePool } from "./MtPlNodePool";
import { IWGMaterial } from "../IWGMaterial";

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
    testRMaterials(ms: IWGMaterial[]): boolean {
        if (ms) {
			for (let i = 0; i < ms.length; ++i) {
				const m = ms[i];
				const ppt = m.property;
				if(ppt && ppt.shadowReceived) {
					if(!this.shadow.isEnabled()) {
						return false;
					}
				}
				if (!ms[i].isREnabled()) {
					return false;
				}
			}
            return true;
		}
        return false;
    }
}
export { MtPipeline };
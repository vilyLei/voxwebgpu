import { LightPipeNode } from "./LightPipeNode";
import { VSMPipeNode } from "./VSMPipeNode";
import { MtBuilder } from "./MtBuilder";
import { MtPlNodePool } from "./MtPlNodePool";
import { IWGMaterial } from "../IWGMaterial";
import { FogPipeNode } from "./FogPipeNode";
import { IRendererScene } from "../../rscene/IRendererScene";
import { MtPlDescriptor } from "./MtPlDescriptor";

/**
 * material pipeline
 */
class MtPipeline {
    private mInit = true;
    private mPool = new MtPlNodePool();
    light: LightPipeNode;
    shadow: VSMPipeNode;
    fog: FogPipeNode;
    readonly builder = new MtBuilder(this.mPool);
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
            type = 'fogging';
            this.fog = pool.getNodeByType(type) as FogPipeNode;
        }
    }
    build(rc: IRendererScene, mtplDesc?: MtPlDescriptor): void {
        if(rc) {
            if(!mtplDesc) mtplDesc = {};

            // mtplDesc.enabled = mtplDesc.enabled !== false || config.mtplEnabled === true;

			if (mtplDesc.enabled === true) {

				let mtpl = this;
				let shadow = mtpl.shadow;

				let vsmDesc = mtplDesc.vsm;
				if (vsmDesc) {

					let mapW = 512;
					let mapH = 512;
                    
					if (vsmDesc.radius !== undefined) {
						shadow.radius = vsmDesc.radius;
					}
					if (vsmDesc.intensity !== undefined) {
						shadow.intensity = vsmDesc.intensity;
					}

					if (vsmDesc.mapSize !== undefined) {
						mapW = vsmDesc.mapSize;
						mapH = mapW;
					}
					if (vsmDesc.mapWidth !== undefined) {
						mapW = vsmDesc.mapWidth;
					}
					if (vsmDesc.mapHeight !== undefined) {
						mapH = vsmDesc.mapHeight;
					}
					shadow.passGraph.setMapSize(mapW, mapH);
				}
				shadow.initialize(rc);
			}
        }
    }
    testRMaterials(ms: IWGMaterial[]): boolean {
        if (ms) {
            const builder = this.builder;
            for (let i = 0; i < ms.length; ++i) {
                const m = ms[i];
                if (builder.enabled) {
                    const ppt = m.property;
                    if (ppt && ppt.shadowReceived) {
                        if (!this.shadow.isEnabled()) {
                            return false;
                        }
                    }
                }
                if (!m.isREnabled()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
}
export { MtPipeline };
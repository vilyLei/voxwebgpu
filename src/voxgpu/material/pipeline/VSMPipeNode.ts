import { MaterialUniformMat44Data, WGRBufferData } from "../mdata/MaterialUniformData";
import { VSMUniformData } from "../mdata/VSMUniformData";
import { MtlPipeNodeImpl } from "./MtlPipeNodeImpl";
import { MtPlPipeNode } from "./MtPlPipeNode";

class VSMPipeNode extends MtPlPipeNode implements MtlPipeNodeImpl {
    
    type = 'vsm_shadow';
    macro = 'USE_VSM_SHADOW';
    
	vsm = new VSMUniformData(null, "vsmParams", "frag");
    /**
     * shadow material
     */
	matrix = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");

    shadowBias = -0.0005;
	shadowRadius = 2.0;
	shadowMapW = 512;
	shadowMapH = 512;
	shadowViewW = 1300;
	shadowViewH = 1300;
    merge(ls: WGRBufferData[]): void {
        let end = ls.length - 1;
        this.addTo(ls, this.vsm, 0, end);
        this.addTo(ls, this.matrix, 0, end);
    }
    getDataList(): WGRBufferData[] {
        return [this.vsm, this.matrix];
    }
}
export { VSMPipeNode }
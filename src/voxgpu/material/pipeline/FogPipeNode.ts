import { MaterialUniformColor4Wrapper, WGRBufferData } from "../mdata/MaterialUniformData";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { MtPlNode } from "./MtPlNode";
import { FogUniformData } from "../mdata/FogUniformData";
import { FogDataWrapper } from "../mdata/FogDataWrapper";

class FogPipeNode extends MtPlNode implements MtPlNodeImpl {
   
    type = 'fogging';
    macros = ['USE_FOG'];

    fogParams = new FogUniformData(new Float32Array([600, 3500, 0, 0.0005, 1, 1, 1, 1]), "fogParams", "frag");

	fogParam: FogDataWrapper;
	fogColor: MaterialUniformColor4Wrapper;
	constructor() {
        super();
        let fogSrc = this.fogParams;
		this.fogParam = new FogDataWrapper(fogSrc.fogParam, fogSrc);
		this.fogColor = new MaterialUniformColor4Wrapper(fogSrc.fogColor, fogSrc);
    }
    merge(ls: WGRBufferData[]): void {
        let end = ls.length - 1;
        this.addTo(ls, this.fogParams, 0, end);
    }
    getDataList(): WGRBufferData[] {
        return [this.fogParams];
    }
}
export { FogPipeNode }
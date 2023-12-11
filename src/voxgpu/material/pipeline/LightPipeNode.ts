import { BaseLightData, LightParamData, LightShaderDataParam } from "../mdata/LightUniformData";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { MtPlNode } from "./MtPlNode";

let lightData0 = new Float32Array([0.0, 200.0, 0, 0.0001]);
let lightData1 = new Float32Array([5.0, 5.0, 5.0, 0.0001]);
class LightPipeNode extends MtPlNode implements MtPlNodeImpl {
    private param: LightShaderDataParam;

    type = 'lighting';
    macros = ['USE_LIGHT'];
    lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
    lights = new BaseLightData(lightData0, "lights", "frag");
    lightColors = new BaseLightData(lightData1, "lightColors", "frag");

	set data(param: LightShaderDataParam) {
		if (param) {
			if (param.lights) {
				this.lights.data = param.lights;
			}
			if (param.colors) {
				this.lightColors.data = param.colors;
			}
			this.lightParam.param = param;
			this.param = param;
		}
	}
	get data(): LightShaderDataParam {
		return this.param;
	}
    merge(ls: WGRBufferData[]): void {
        let end = ls.length - 1;
        this.addTo(ls, this.lights, 0, end);
        this.addTo(ls, this.lightColors, 0, end);
    }
    getDataList(): WGRBufferData[] {
        return [this.lights, this.lightColors];
    }
}
export { LightPipeNode }
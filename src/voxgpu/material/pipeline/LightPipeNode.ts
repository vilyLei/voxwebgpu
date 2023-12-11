import { BaseLightData, LightParamData, LightShaderDataParam } from "../mdata/LightUniformData";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { MtPlNode } from "./MtPlNode";
import { PointLight } from "../../light/base/PointLight";
import { DirectionLight } from "../../light/base/DirectionLight";

let lightData0 = new Float32Array([0.0, 200.0, 0, 0.0001]);
let lightData1 = new Float32Array([5.0, 5.0, 5.0, 0.0001]);

type LightDataDescriptor = {pointLights: PointLight[], directionLights: DirectionLight[]};

class LightPipeNode extends MtPlNode implements MtPlNodeImpl {
    private param: LightShaderDataParam;
	private mLightData: LightDataDescriptor;

    type = 'lighting';
    macros = ['USE_LIGHT'];
    lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
    lights = new BaseLightData(lightData0, "lights", "frag");
    lightColors = new BaseLightData(lightData1, "lightColors", "frag");
	constructor(lightData?: LightDataDescriptor) {
		super();
		this.lightData = lightData;
	}
	set lightData(data: LightDataDescriptor) {
		if(data) {
			let dataLen = 0;
			let points = data.pointLights;
			let param = this.lightParam;
			if( points ) {
				dataLen += points.length;
				param.pointLightsNum = points.length;
			}
			let direcs = data.directionLights;
			if( direcs ) {
				dataLen += direcs.length;
				param.directionLightsNum = direcs.length;
			}
			let lightsData = new Float32Array(dataLen * 4);
			let colorsData = new Float32Array(dataLen * 4);
			let offset = 0;
			if( points ) {
				for(let i = 0; i < points.length; ++i) {
					points[i].applyTo(lightsData, colorsData, offset);
					offset += 4;
				}
			}
			if( points ) {
				for(let i = 0; i < points.length; ++i) {
					points[i].applyTo(lightsData, colorsData, offset);
					offset += 4;
				}
			}
			this.mLightData = data;
		}
	}
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
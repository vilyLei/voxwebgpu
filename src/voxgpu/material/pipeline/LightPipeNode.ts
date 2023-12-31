import { BaseLightData, LightParamData, LightShaderDataParam } from "../mdata/LightUniformData";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { MtPlNode } from "./MtPlNode";

import { MtLightDataDescriptor } from "../mdata/MtLightDataDescriptor";

let lightData0 = new Float32Array([0.0, 200.0, 0, 0.0001]);
let lightData1 = new Float32Array([5.0, 5.0, 5.0, 0.0001]);

class LightPipeNode extends MtPlNode implements MtPlNodeImpl {
    private param: LightShaderDataParam;
	private mLightData: MtLightDataDescriptor;

    type = 'lighting';
    macros = ['USE_LIGHT'];
    lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
    lights = new BaseLightData(lightData0, "lights", "frag");
    lightColors = new BaseLightData(lightData1, "lightColors", "frag");
	constructor(lightData?: MtLightDataDescriptor) {
		super();
		this.lightData = lightData;
	}
	set lightData(data: MtLightDataDescriptor) {
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
			let spots = data.spotLights;
			let spotsTotal = 0;
			
			if( spots ) {
				dataLen += spots.length;
				spotsTotal = spots.length;
				param.spotLightsNum = spots.length;
			}
			if(dataLen > 0) {
				let lightsData = new Float32Array(dataLen * 4 + spotsTotal * 2 * 4);
				let colorsData = new Float32Array(dataLen * 4);
				let offset = 0;
				if( points ) {
					for(let i = 0; i < points.length; ++i) {
						points[i].applyTo(lightsData, colorsData, offset);
						offset += 4;
					}
				}
				if( direcs ) {
					for(let i = 0; i < direcs.length; ++i) {
						direcs[i].applyTo(lightsData, colorsData, offset);
						offset += 4;
					}
				}
				let offsetA = offset;
				if( spots ) {
					for(let i = 0; i < spots.length; ++i) {
						spots[i].applyTo(lightsData, colorsData, offsetA, offset);
						offsetA += 8;
						offset += 4;
					}
				}
				// console.log(">>>MMM lightsData: ", lightsData);
				// console.log(">>>MMM colorsData: ", colorsData);
				this.lights.data = lightsData;
				this.lightColors.data = colorsData;
				this.mLightData = data;
			}
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
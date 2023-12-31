
import {
	MaterialUniformData,
	MaterialUniformVec4Data,
	WGRBufferData
} from "./MaterialUniformData";

class BaseLightData implements WGRBufferData {
	version = -1;
	storage: MaterialUniformData;
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		this.storage = new MaterialUniformData(data, shdVarName, visibility);
		this.storage.arraying = true;
		this.storage.shdVarFormat = 'array<vec4<f32>>';
		this.shared = true;
	}
	set shared(b: boolean) {
		this.storage.shared = b;
	}
	get shared(): boolean {
		return this.storage.shared === true;
	}
	set data(d: Float32Array) {
		this.storage.data = d;
		this.update();
	}
	get data(): Float32Array {
		return this.storage.data as Float32Array;
	}
	update(): void {
		this.version++;
		if (this.storage && this.storage.update !== undefined) {
			this.storage.update();
		}
	}
}
type LightShaderDataParam = {
	lights?: Float32Array;
	colors?: Float32Array;
	pointLightsTotal?: number;
	directLightsTotal?: number;
	spotLightsTotal?: number;
};
class LightParamData extends MaterialUniformVec4Data {
	constructor(data: NumberArrayType, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.shdVarFormat = 'vec4<u32>';
		this.shared = true;
	}
	get pointLightsNum(): number {
		return (this.data as Uint32Array)[0];
	}
	// set pointLightsNum(num: number) {
	// 	(this.data as Uint32Array)[0] = num;
	// }
	get directionLightsNum(): number {
		return (this.data as Uint32Array)[1];
	}
	// set directionLightsNum(num: number) {
	// 	(this.data as Uint32Array)[1] = num;
	// }
	get spotLightsNum(): number {
		return (this.data as Uint32Array)[2];
	}
	// set spotLightsNum(num: number) {
	// 	(this.data as Uint32Array)[2] = num;
	// }
	set param(param: LightShaderDataParam) {
		if (param) {
			if (param.pointLightsTotal !== undefined) {
				this.property.x = param.pointLightsTotal;
			}
			if (param.directLightsTotal !== undefined) {
				this.property.y = param.directLightsTotal;
			}
			if (param.spotLightsTotal !== undefined) {
				this.property.z = param.spotLightsTotal;
			}
			this.update();
		}
	}
	set pointLightsNum(n: number) {
		this.property.x = n;
		this.update();
	}
	set directionLightsNum(n: number) {
		this.property.y = n;
		this.update();
	}
	set spotLightsNum(n: number) {
		this.property.z = n;
		this.update();
	}
}
export { BaseLightData, LightShaderDataParam, LightParamData };

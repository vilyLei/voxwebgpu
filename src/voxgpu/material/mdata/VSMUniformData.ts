import Vector3 from "../../math/Vector3";
import {
	MaterialUniformVec4ArrayData
} from "./MaterialUniformData";

class VSMUniformData extends MaterialUniformVec4ArrayData {
	
	constructor(shdVarName = 'vsmParams', visibility = 'frag', data?: Float32Array) {
		super(data, shdVarName, visibility);
		if(!data) {
			this.data = new Float32Array([
				-0.0005             // shadowBias
				, 0.0               // shadowNormalBias
				, 4                 // shadowRadius
				, 0.4               // shadow intensity
		
				, 512, 512           // shadowMapSize(width, height)
				, 0.0, 0.0           // undefined
		
				
				, 1.0, 1.0, 1.0      // direc light nv(x,y,z)
				, 0.0                // undefined
			]);
		}
	}
    setParam(shadowBias: number, shadowNormalBias: number, shadowRadius: number): void {
		let vs = this.data as Float32Array;
        vs[0] = shadowBias;
        vs[1] = shadowNormalBias;
        vs[2] = shadowRadius;
		this.update();
    }
    set normalBias(intensity: number) {
		let vs = this.data as Float32Array;
        vs[1] = intensity;
		this.update();
    }
	get normalBias(): number {
		return (this.data as Float32Array)[1];
	}
    set intensity(intensity: number) {
		let vs = this.data as Float32Array;
        vs[3] = intensity;
		this.update();
    }
	get intensity(): number {
		return (this.data as Float32Array)[3];
	}
    set radius(radius: number) {
		let vs = this.data as Float32Array;
        vs[2] = radius;
		this.update();
    }
	get radius(): number {
		return (this.data as Float32Array)[2];
	}
    set bias(bias: number)  {
		let vs = this.data as Float32Array;
        vs[0] = bias;
    }
	get bias(): number {
		return (this.data as Float32Array)[0];
	}
    setSize(width: number, height: number): void {
		let vs = this.data as Float32Array;
        vs[4] = width;
        vs[5] = height;
		this.update();
    }
    set direction(v3d: Vector3DataType) {
		let v3 = new Vector3().setVector3(v3d);
		let vs = this.data as Float32Array;
        vs[8] = v3.x;
        vs[9] = v3.y;
        vs[10] = v3.z;
		this.update();
    }
	get direction(): Vector3DataType {
		let vs = this.data as Float32Array;
		return [vs[8], vs[9], vs[10]];
	}
}

export { VSMUniformData };

import { WGMaterialDescripter, WGMaterial } from "./WGMaterial";
import {
	MaterialUniformMat44Data,
	MaterialUniformVec4ArrayData,
	WGRBufferData
} from "./MaterialUniformData";
import Matrix4 from "../math/Matrix4";
import Vector3 from "../math/Vector3";
import shaderSrcCode from "./shader/shadow/shadowReceive.wgsl";

class BasePBRProperty {
	params = new MaterialUniformVec4ArrayData(new Float32Array([
        -0.0005             // shadowBias
        , 0.0               // shadowNormalBias
        , 4                 // shadowRadius
        , 0.8               // shadow intensity

        , 512, 512           // shadowMapSize(width, height)
        , 0.0, 0.0           // undefined

        
        , 1.0, 1.0, 1.0      // direc light nv(x,y,z)
        , 0.0                // undefined
    ]), "params", "frag");
	matrixParam = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");
	constructor() {
	}
	setShadowMatrix(mat4: Matrix4): void {
		this.matrixParam.data = mat4.getLocalFS32();
		this.matrixParam.update();
	}
    setShadowParam(shadowBias: number, shadowNormalBias: number, shadowRadius: number): void {
		let vs = this.params.data as Float32Array;
        vs[0] = shadowBias;
        vs[1] = shadowNormalBias;
        vs[2] = shadowRadius;
		this.params.update();
    }
    setShadowIntensity(intensity: number): void {
		let vs = this.params.data as Float32Array;
        vs[3] = intensity;
		this.params.update();
    }
    setShadowRadius(radius: number): void {
		let vs = this.params.data as Float32Array;
        vs[2] = radius;
		this.params.update();
    }
    setShadowBias(bias: number): void {
		let vs = this.params.data as Float32Array;
        vs[0] = bias;
    }
    setShadowSize(width: number, height: number): void {
		let vs = this.params.data as Float32Array;
        vs[4] = width;
        vs[5] = height;
		this.params.update();
    }
    setDirec(v3d: Vector3DataType): void {
		let v3 = new Vector3().setVector3(v3d);
		let vs = this.params.data as Float32Array;
        vs[8] = -v3.x;
        vs[9] = -v3.y;
        vs[10] = -v3.z;
		this.params.update();
    }
	get uniformValues(): WGRBufferData[] {
		return [this.params, this.matrixParam];
	}
}
class ShadowReceiveMaterial extends WGMaterial {
	property = new BasePBRProperty();
	constructor(descriptor?: WGMaterialDescripter) {
		super(descriptor);
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (!descriptor || descriptor.shaderSrc === undefined) {
			if (!descriptor) descriptor = { shadinguuid: "ShadowReceiveMaterial" };
		}
		super.setDescriptor(descriptor);
	}
	get uniformValues(): WGRBufferData[] {
		if (!this.mUniformValues) {
			this.mUniformValues = this.property.uniformValues;
		}
		return this.mUniformValues;
	}

	__$build(): void {
		
		console.log('ShadowReceiveMaterial::__$build() ...');
		console.log(this.property.matrixParam);
		let uuid = 'shadow-receive-ins01';
		let shaderSrc = {
			shaderSrc: { code: shaderSrcCode, uuid }
		}
		this.shadinguuid = uuid + '-material';
		this.shaderSrc = shaderSrc;
	}
}
export { ShadowReceiveMaterial };

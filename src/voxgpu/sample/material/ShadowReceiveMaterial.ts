import { WGMaterialDescripter, WGMaterial } from "../../material/WGMaterial";
import {
	MaterialUniformVec4Data,
	WGRBufferData
} from "../../material/MaterialUniformData";
import Matrix4 from "../../math/Matrix4";
import Vector3 from "../../math/Vector3";
import shaderSrcCode from "../shaders/shadow/shadowReceive.wgsl";
class BasePBRProperty {
	matrix = new Matrix4();
	params = new MaterialUniformVec4Data(new Float32Array([
        -0.0005             // shadowBias
        , 0.0               // shadowNormalBias
        , 4                 // shadowRadius
        , 0.8               // shadow intensity

        , 512, 512           // shadowMapSize(width, height)
        , 0.0, 0.0           // undefined

        
        , 1.0, 1.0, 1.0      // direc light nv(x,y,z)
        , 0.0                // undefined
    ]), "params", "frag");
	matrixParam = new MaterialUniformVec4Data(this.matrix.getLocalFS32(), "shadowMatrix", "frag");
	constructor() {
		this.matrixParam.stride = 16;
	}
	
    setShadowParam(shadowBias: number, shadowNormalBias: number, shadowRadius: number): void {
		let vs = this.params.data as Float32Array;
        vs[0] = shadowBias;
        vs[1] = shadowNormalBias;
        vs[2] = shadowRadius;
    }
    setShadowIntensity(intensity: number): void {
		let vs = this.params.data as Float32Array;
        vs[3] = intensity;
    }
    setShadowRadius(radius: number): void {
		let vs = this.params.data as Float32Array;
        vs[2] = radius;
    }
    setShadowBias(bias: number): void {
		let vs = this.params.data as Float32Array;
        vs[0] = bias;
    }
    setShadowSize(width: number, height: number): void {
		let vs = this.params.data as Float32Array;
        vs[4] = width;
        vs[5] = height;
    }
    setLightDirec(v3d: Vector3DataType): void {
		let v3 = new Vector3().setVector3(v3d);
		let vs = this.params.data as Float32Array;
        vs[8] = -v3.x;
        vs[9] = -v3.y;
        vs[10] = -v3.z;
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
		
		// console.log('ShadowReceiveMaterial::__$build() ...');
		let uuid = 'shadow-receive-ins01';
		let shaderSrc = {
			shaderSrc: { code: shaderSrcCode, uuid }
		}
		this.shadinguuid = uuid + '-material';
		this.shaderSrc = shaderSrc;
	}
}
export { ShadowReceiveMaterial };

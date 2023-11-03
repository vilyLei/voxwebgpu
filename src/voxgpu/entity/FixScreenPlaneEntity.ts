import { FixScreenEntity } from "./FixScreenEntity";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlane.frag.wgsl";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import Color4 from "../material/Color4";

interface FixScreenPlaneEntityParam {
	x: number;
	y: number;
	width: number;
	height: number;
	textures?: WGTextureDataDescriptor[];
	blendModes?: string[];
	faceCullMode?: string;
}
class FixScreenPlaneEntity extends FixScreenEntity {
	private mColor = new WGRUniformValue({data: new Float32Array([1,1,1, 1])});
	constructor(param?: FixScreenPlaneEntityParam) {
		super();
		if(!param) {
			param = {x: -1, y: -1, width: 2, height: 2};
		}
		this.createGeometry(param);
		this.createMaterial(param);
	}
	setColor(c: Color4): FixScreenPlaneEntity {
		if(c) {
			c.toArray4(this.mColor.data as Float32Array);
			this.mColor.upate();
		}
		return this;
	}
	private createGeometry(param: FixScreenPlaneEntityParam): void {
		let geom = new RectPlaneGeometry();
		geom.axisFlag = 0;
		geom.initialize(param.x, param.y, param.height, param.height);
		this.geometry = new WGGeometry()
			.addAttribute({ position: geom.getVS() })
			.addAttribute({ uv: geom.getUVS() })
			.setIndices( geom.getIVS() );
	}
	private createMaterial(param: FixScreenPlaneEntityParam): void {

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode: param.faceCullMode ? param.faceCullMode : "back",
			blendModes: param.blendModes ? param.blendModes : ["solid"]
		};
		const texs = param.textures;
		const texTotal = texs ? texs.length : 0;
		const material = new WGMaterial({
			shadinguuid: "FixScreenPlaneEntity-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		material.addTextures(texs);
		material.uniformValues = [this.mColor];
	}
}
export { FixScreenPlaneEntity };

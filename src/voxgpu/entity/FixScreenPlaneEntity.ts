import { Entity3DParam, getUniformValueFromParam, FixScreenEntity } from "./FixScreenEntity";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import Color4 from "../material/Color4";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlane.frag.wgsl";
import texFragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";

interface FixScreenPlaneEntityParam extends Entity3DParam {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
}
class FixScreenPlaneEntity extends FixScreenEntity {
	private colorV: WGRUniformValue;
	constructor(param?: FixScreenPlaneEntityParam) {
		super(param);
		if (!param) {
			param = {};
		}
		this.createGeometry(param);
		this.createMaterial(param);
	}
	setColor(c: Color4): FixScreenPlaneEntity {
		if (c) {
			c.toArray4(this.colorV.data as Float32Array);
			this.colorV.upate();
		}
		return this;
	}
	private createGeometry(param: FixScreenPlaneEntityParam): void {
		let geom = new RectPlaneGeometry();
		geom.axisType = 0;
		geom.initialize(
			param.x === undefined ? -1 : param.x,
			param.y === undefined ? -1 : param.y,
			param.width === undefined ? 2 : param.width,
			param.height === undefined ? 2 : param.height
		);
		this.geometry = new WGGeometry()
			.addAttribute({ position: geom.getVS() })
			.addAttribute({ uv: geom.getUVS() })
			.setIndices(geom.getIVS());
	}
	private createMaterial(param: Entity3DParam): void {
		const texs = param.textures;
		const texTotal = texs ? texs.length : 0;
		if (!param.uniformValues) {
			this.colorV = getUniformValueFromParam("color", param, new WGRUniformValue({ data: new Float32Array([0.5, 0.5, 0.5, 1]) }));
		}
		let frag_uuid = texTotal > 0 ? "fragTexShdCode" : "fragShdCode";
		const shdSrc = param.shaderSrc
			? param.shaderSrc
			: {
					vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
					fragShaderSrc: { code: texTotal > 0 ? texFragWGSL : fragWGSL, uuid: frag_uuid }
			  };
		let depthWriteEnabled = param.depthWriteEnabled === undefined ? false : param.depthWriteEnabled;
		let pipelineDefParam = {
			depthWriteEnabled: depthWriteEnabled,
			faceCullMode: param.faceCullMode ? param.faceCullMode : "back",
			blendModes: param.blendModes ? param.blendModes : ["solid"]
		};

		const material = new WGMaterial({
			shadinguuid: param.shadinguuid !== undefined ? param.shadinguuid : "FixScreenPlaneEntity-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});
		material.addTextures(texs);
		material.uniformValues = param.uniformValues ? param.uniformValues : [this.colorV];
		if(material.uniformValues) {
			this.colorV = material.uniformValues[ 0 ];
		}
		this.materials = [material];
	}
	destroy(): void {
		super.destroy();
	}
}
export { FixScreenPlaneEntity };

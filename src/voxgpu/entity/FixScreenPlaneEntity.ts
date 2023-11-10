import { Entity3DParam, getUniformValueFromParam, FixScreenEntity } from "./FixScreenEntity";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Color4 from "../material/Color4";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlane.frag.wgsl";
import texFragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";
import Extent2 from "../math/Extent2";

interface FixScreenPlaneEntityParam extends Entity3DParam {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	extent?: Extent2DataType;
	/**
	 * flip vertical uv value
	 */
	flipY?: boolean;
}
class FixScreenPlaneEntity extends FixScreenEntity {
	private mColorV: WGRBufferData;
	private mColor = new Color4();
	private mExtent = new Extent2();
	constructor(param?: FixScreenPlaneEntityParam) {
		super(param);
		if (!param) {
			param = {};
		}
		this.createGeometry(param);
		this.createMaterial(param);
	}
	setColor(c: ColorDataType): FixScreenPlaneEntity {
		if (c && this.mColorV) {
			this.mColor.setColor(c).toArray4(this.mColorV.data as Float32Array);
			this.mColorV.version ++;
		}
		return this;
	}
	private createGeometry(param: FixScreenPlaneEntityParam): void {
		if (param.geometry) {
			this.geometry = param.geometry;
		} else {

			let geom = new RectPlaneGeometry();
			geom.axisType = 0;
			geom.flipY = param.flipY === true;
			if(param.extent !== undefined) {
				const t = this.mExtent;
				t.setExtent(param.extent);
				geom.initialize( t.x, t.y, t.width, t.height);
			}else {
				geom.initialize(
					param.x === undefined ? -1 : param.x,
					param.y === undefined ? -1 : param.y,
					param.width === undefined ? 2 : param.width,
					param.height === undefined ? 2 : param.height
				);
			}
			this.geometry = new WGGeometry()
				.addAttribute({ position: geom.getVS() })
				.addAttribute({ uv: geom.getUVS() })
				.setIndices(geom.getIVS());
		}
	}
	private createMaterial(param: Entity3DParam): void {
		if (param.materials) {
			this.materials = param.materials;
		} else {
			if (!param.uniformValues) {
				this.mColorV = getUniformValueFromParam('color', param, new WGRUniformValue({ data: new Float32Array([0.5, 0.5, 0.5, 1]), shdVarName: 'color' }));
			}
			const texs = param.textures;
			const texTotal = texs ? texs.length : 0;
			let frag_uuid = texTotal > 0 ? "fragTexShdCode" : "fragShdCode";
			const shaderCodeSrc = param.shaderSrc
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
				shaderCodeSrc,
				pipelineDefParam
			});
			material.addTextures(texs);
			if(param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues ? param.uniformValues : [this.mColorV];
			if (material.uniformValues && material.uniformValues.length > 0) {
				this.mColorV = material.uniformValues[0];
			}
			this.materials = [material];
		}
		const rpasses = param.rpasses;
		if(rpasses) {
			const ms = this.materials;
			// 这里的实现需要优化, 因为一个material实际上可以加入到多个rpass中去
			let len = Math.min(rpasses.length, ms.length);
			for(let i = 0; i < len; ++i) {
				const rpass = ms[i].rpass;
				if(!rpass || !rpass.rpass.node) {
					ms[i].rpass = rpasses[i];
				}
			}
		}
	}
	destroy(): void {
		super.destroy();
	}
}
export { FixScreenPlaneEntity };

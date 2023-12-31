import { checkEntityMaterialsInfo, Entity3DParam, getUniformValueFromParam, FixScreenEntity } from "./FixScreenEntity";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import { WGGeometry } from "../geometry/WGGeometry";
import { checkMaterialRPasses, WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Color4 from "../material/Color4";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlane.frag.wgsl";
import texFragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";
import Extent2 from "../cgeom/Extent2";
import Vector3 from "../math/Vector3";

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
const tempV3 = new Vector3();
class FixScreenPlaneEntity extends FixScreenEntity {
	private mColorV: WGRBufferData;
	private mColor = new Color4();
	private mUVParam: WGRBufferData;
	private mUVScale = new Vector3();
	private mExtent = new Extent2();
	constructor(param?: FixScreenPlaneEntityParam) {
		super(param);
		if (!param) param = {};
		if (!(param.building === false)) {
			this.createGeometry(param);
			this.createMaterial(param);
		}
	}
	setUVScale(sUV: Vector3DataType): FixScreenPlaneEntity {
		if (sUV && this.mUVParam) {
			this.mUVScale.setVector2(sUV).toArray4(this.mUVParam.data as Float32Array);
			this.mUVParam.version++;
		}
		return this;
	}
	setUVOffset(offsetUV: Vector3DataType): FixScreenPlaneEntity {
		if (offsetUV && this.mUVParam) {
			tempV3.setVector2(offsetUV);
			this.mUVScale.z = tempV3.x;
			this.mUVScale.w = tempV3.y;
			this.mUVScale.toArray4(this.mUVParam.data as Float32Array);
			this.mUVParam.version++;
		}
		return this;
	}
	set uvScale(sUV: Vector3DataType) {
		this.setUVScale(sUV);
	}
	get uvScale(): Vector3DataType {
		return [this.mUVScale.x, this.mUVScale.y];
	}

	set uvOffset(sUV: Vector3DataType) {
		this.setUVOffset(sUV);
	}
	get uvOffset(): Vector3DataType {
		return [this.mUVScale.z, this.mUVScale.w];
	}

	setColor(c: ColorDataType): FixScreenPlaneEntity {
		if (c && this.mColorV) {
			this.mColor.setColor(c).toArray4(this.mColorV.data as Float32Array);
			this.mColorV.version++;
		}
		return this;
	}
	set color(c: ColorDataType) {
		this.setColor(c);
	}
	get color(): ColorDataType {
		return this.mColor;
	}
	private createGeometry(param: FixScreenPlaneEntityParam): void {
		if (param.geometry) {
			this.geometry = param.geometry;
		} else {
			let geom = new RectPlaneGeometry();
			geom.axisType = 0;
			geom.flipY = param.flipY === true;
			if (param.extent !== undefined) {
				const t = this.mExtent;
				t.setExtent(param.extent);
				geom.initialize(t.x, t.y, t.width, t.height);
			} else {
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
				this.mColorV = getUniformValueFromParam(
					"color",
					param,
					new WGRUniformValue({ data: new Float32Array([1, 1, 1, 1]), shdVarName: "color" })
				);
				this.mUVParam = getUniformValueFromParam(
					"uvParam",
					param,
					new WGRUniformValue({ data: new Float32Array([1, 1, 0, 0]), shdVarName: "uvParam" })
				);
			}
			const texs = param.textures;
			const texTotal = texs ? texs.length : 0;
			let fragUuid = texTotal > 0 ? "fragTex" : "frag";
			const shaderSrc = param.shaderSrc
				? param.shaderSrc
				: {
						vertShaderSrc: { code: vertWGSL, uuid: "fixScreenPlaneVertShdCode" },
						fragShaderSrc: { code: texTotal > 0 ? texFragWGSL : fragWGSL, uuid: "fixScreenPlaneFragShdCode" + fragUuid }
				  };

			let b = param.depthWriteEnabled;
			b = b === undefined ? false : b;
			let f = param.faceCullMode;
			f = f ? f : "back";
			let bl = param.blendModes;
			bl = bl ? bl : ["solid"];

			let pipelineDefParam = {
				depthWriteEnabled: b,
				faceCullMode: f,
				blendModes: bl
			};

			let shadinguuid = param.shadinguuid !== undefined ? param.shadinguuid : "FixScreenPlaneEntity-material-tex" + texTotal;
			const material = new WGMaterial({
				shadinguuid,
				shaderSrc,
				pipelineDefParam
			});
			material.addTextures(texs);
			if (param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues ? param.uniformValues : [this.mColorV, this.mUVParam];
			if (material.uniformValues && material.uniformValues.length > 0) {
				this.mColorV = material.uniformValues[0];
			}
			this.materials = [material];
		}
		checkEntityMaterialsInfo(this.materials, param);
		// checkMaterialRPasses(this.materials, param.rpasses);
	}
	destroy(): void {
		super.destroy();
	}
}
export { FixScreenPlaneEntity };

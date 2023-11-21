import { checkEntityMaterialsInfo, Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";
import RectPlaneGeometry from "../geometry/primitive/RectPlaneGeometry";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import Color4 from "../material/Color4";
import vertWGSL from "../material/shader/wgsl/billboard.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/billboard.frag.wgsl";
import Vector3 from "../math/Vector3";

interface BillboardEntityParam extends Entity3DParam {
	width?: number;
	height?: number;
	size?: number;
	/**
	 * flip vertical uv value
	 */
	flipY?: boolean;
}
const tempV3 = new Vector3();
class BillboardEntity extends Entity3D {
	private mColorV: WGRBufferData;
	private mBillParamV: WGRBufferData;
	private mColor = new Color4();
	private mBillParam = new Vector3(0, 0, 0, 0);
	private mUVParam: WGRBufferData;
	private mUVScale = new Vector3();
	constructor(param?: BillboardEntityParam) {
		super(param);
		if (!param) param = {};
		if (!(param.building === false)) {
			this.createGeometry(param);
			this.createMaterial(param);
		}
	}

	setUVScale(sUV: Vector3DataType): BillboardEntity {
		if (sUV && this.mUVParam) {
			this.mUVScale.setVector2(sUV).toArray4(this.mUVParam.data as Float32Array);
			this.mUVParam.version++;
		}
		return this;
	}
	setUVOffset(offsetUV: Vector3DataType): BillboardEntity {
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
	setColor(c: ColorDataType): BillboardEntity {
		if (c && this.mColorV) {
			this.mColor.setColor(c).toArray4(this.mColorV.data as Float32Array);
			this.mColorV.version++;
			console.log("this.mColorV: ", this.mColorV);
		}
		return this;
	}
	set color(c: ColorDataType) {
		this.setColor(c);
	}
	get color(): ColorDataType {
		return this.mColor;
	}
	setScaleXY(sx: number, sy: number): BillboardEntity {
		this.scaleXY = [sx, sy];
		return this;
	}
	set rotation(r: number) {
		this.mBillParam.z = r;
		if (this.mBillParamV) {
			this.mBillParam.toArray4(this.mBillParamV.data as Float32Array);
			this.mBillParamV.version++;
		}
	}
	get rotation(): number {
		return this.mBillParam.z;
	}

	set scale(s: number) {
		this.scaleXY = [s, s];
	}
	get scale(): number {
		return this.mBillParam.x;
	}

	set scaleXY(sxy: Vector3DataType) {
		this.mBillParam.setVector2(sxy);
		if (this.mBillParamV) {
			this.mBillParam.toArray4(this.mBillParamV.data as Float32Array);
			this.mBillParamV.version++;
		}
	}
	get scaleXY(): Vector3DataType {
		const p = this.mBillParam;
		return [p.x, p.y];
	}
	set scaleX(s: number) {
		this.mBillParam.x = s;
		this.setScaleXY(this.mBillParam.x, this.mBillParam.y);
	}
	get scaleX(): number {
		return this.mBillParam.x;
	}
	set scaleY(s: number) {
		this.mBillParam.y = s;
		this.setScaleXY(this.mBillParam.x, this.mBillParam.y);
	}
	get scaleY(): number {
		return this.mBillParam.y;
	}

	private createGeometry(param: BillboardEntityParam): void {
		if (param.geometry) {
			this.geometry = param.geometry;
		} else {
			let geom = new RectPlaneGeometry();
			geom.axisType = 0;
			geom.flipY = param.flipY === true;

			let w = param.width !== undefined ? param.width : 100;
			let h = param.height !== undefined ? param.height : 100;
			if (param.size !== undefined) {
				w = param.size;
				h = param.size;
			}
			geom.initialize(-0.5 * w, -0.5 * h, w, h);
			let radius = Math.sqrt(w * w + h * h);
			geom.bounds.min.setXYZ(-radius, -radius, -radius);
			geom.bounds.max.setXYZ(radius, radius, radius);
			geom.bounds.updateFast();

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
				this.mBillParamV = getUniformValueFromParam(
					"billParam",
					param,
					new WGRUniformValue({ data: new Float32Array([1, 1, 0, 0]), shdVarName: "billParam" })
				);
				this.mUVParam = getUniformValueFromParam(
					"uvParam",
					param,
					new WGRUniformValue({ data: new Float32Array([1, 1, 0, 0]), shdVarName: "uvParam" })
				);
			}
			const texs = param.textures;
			const texTotal = texs ? texs.length : 0;

			const shaderSrc = param.shaderSrc
				? param.shaderSrc
				: {
						vertShaderSrc: { code: vertWGSL, uuid: "billboardEntityVertShdCode" },
						fragShaderSrc: { code: fragWGSL, uuid: "billboardEntityFragShdCode" }
				  };

			let b = param.depthWriteEnabled;
			b = b === undefined ? false : b;
			let f = param.faceCullMode;
			f = f ? f : "back";
			let bl = param.blendModes;
			bl = bl ? bl : ["add"];

			let pipelineDefParam = {
				depthWriteEnabled: b,
				faceCullMode: f,
				blendModes: bl
			};

			let shadinguuid = param.shadinguuid !== undefined ? param.shadinguuid : "BillboardEntity-material-tex" + texTotal;
			const material = new WGMaterial({
				shadinguuid,
				shaderSrc,
				pipelineDefParam
			});
			material.addTextures(texs);
			if (param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues ? param.uniformValues : [this.mBillParamV, this.mColorV, this.mUVParam];
			if (material.uniformValues && material.uniformValues.length > 1) {
				this.mColorV = material.uniformValues[1];
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
export { BillboardEntity };

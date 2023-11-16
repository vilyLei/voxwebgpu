import { WGGeometry } from "../geometry/WGGeometry";
import DashedLineGeometry from "../geometry/primitive/DashedLineGeometry";
import GeometryBase from "../geometry/primitive/GeometryBase";
import Color4 from "../material/Color4";
import { checkMaterialRPasses, WGMaterial } from "../material/WGMaterial";
import Vector3 from "../math/Vector3";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";

import vertWGSL from "../material/shader/wgsl/line.vert.wgsl";
import vertColorWGSL from "../material/shader/wgsl/lineColor.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/line.frag.wgsl";
import fragColorWGSL from "../material/shader/wgsl/lineColor.frag.wgsl";
import IVector3 from "../math/IVector3";

interface Line3DEntityParam extends Entity3DParam {
	linePositions?: Vector3DataType[];
	lineColors?: ColorDataType[];
	/**
	 * The default value is false
	 */
	dashedData?: boolean;
}
class Line3DEntity extends Entity3D {
	private mHaveCVS = false;
	private mColor = new Color4();
	protected mColorV: WGRBufferData;
	
	constructor(param?: Line3DEntityParam) {
		super(param);

		if (!param) param = {};
		if (!(param.building === false)) {
			this.createGeometry(param);
			this.createMaterial(param);
		}
		this.mDescParam = param;
	}	
	clone(param?: Entity3DParam): Line3DEntity {
		if(param) {
			if(!param.geometry) param.geometry = this.geometry;
		}else {
			param = this.mDescParam;
			param.materials = this.materials;
			param.geometry = this.geometry;
		}
		let p = new Line3DEntity( param  );
		p.color = this.color;
		return p;
	}
	setColor(c: ColorDataType): Line3DEntity {
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

	protected getGeometryData(param: Line3DEntityParam): GeometryBase {
		if (param.linePositions === undefined) {
			param.linePositions = [new Vector3(), new Vector3(100)];
		}
		let g = new DashedLineGeometry();
		g.dashedData = param.dashedData === true ? true : false;
		g.initialize(param.linePositions, param.lineColors);
		return g;
	}

	private createGeometry(param: Entity3DParam): void {
		if (param && param.geometry) {
			this.geometry = param.geometry;
		} else {
			const geom = this.getGeometryData(param);
			if (geom) {
				const g = new WGGeometry().addAttribute({ position: geom.getVS() });
				if (geom.getCVS()) {
					this.mHaveCVS = true;
					g.addAttribute({ color: geom.getCVS() });
				}
				g.drawMode = geom.drawMode;
				g.bounds = geom.bounds;
				g.geometryData = geom;
				this.geometry = g;
			}
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
			}
			const flag = this.mHaveCVS;
			let ns = flag ? "color-" : "";
			const shaderCodeSrc = param.shaderSrc
				? param.shaderSrc
				: {
						vertShaderSrc: { code: this.mHaveCVS ? vertColorWGSL : vertWGSL, uuid: ns + "line3DEntityVertShdCode" },
						fragShaderSrc: { code: this.mHaveCVS ? fragColorWGSL : fragWGSL, uuid: ns + "line3DEntityFragShdCode" }
				  };

			let b = param.depthWriteEnabled;
			b = b === false ? false : true;
			let f = param.faceCullMode;
			f = f ? f : "back";
			let bl = param.blendModes;
			bl = bl ? bl : ["solid"];

			let pipelineDefParam = {
				depthWriteEnabled: b,
				faceCullMode: f,
				blendModes: bl
			};

			let shadinguuid = param.shadinguuid !== undefined ? param.shadinguuid : ns + "line3DEntity-material";
			const material = new WGMaterial({
				shadinguuid,
				shaderCodeSrc,
				pipelineDefParam
			});

			if (param.instanceCount !== undefined) {
				material.instanceCount = param.instanceCount;
			}
			material.uniformValues = param.uniformValues ? param.uniformValues : [this.mColorV];
			if (material.uniformValues && material.uniformValues.length > 0) {
				this.mColorV = material.uniformValues[0];
			}
			this.materials = [material];
		}

		checkMaterialRPasses(this.materials, param.rpasses);
	}
}


function createCircleData(ix: number, iy: number, iz: number, radius: number, segsTotal: number, center: IVector3, beginRad = 0.0, rangeRad = 0.0): IVector3[] {
	if(segsTotal === undefined) segsTotal = 50;
	if (radius < 0.001) radius = 0.001;
	if (segsTotal < 3) segsTotal = 3;
	if (!center) center = new Vector3();

	let posList = new Array(segsTotal + 1);
	let vs = new Array(3);
	let j = 0;
	let rad = rangeRad;
	let range = rad > 0.0 ? rad : Math.PI * 2;
	let cvs = [center.x, center.y, center.z];
	let i = 0;
	for (; i < segsTotal; ++i) {
		rad = beginRad + range * i / segsTotal;
		vs[ix] = cvs[ix] + radius * Math.cos(rad);
		vs[iy] = cvs[iy] + radius * Math.sin(rad);
		vs[iz] = cvs[iz];
		posList[i] = new Vector3().setVector3(vs);
		j += 3;
	}
	posList[i] = posList[0];
	return posList;
}

function createLineCircleXOY(radius: number, segsTotal?: number, center?: IVector3, beginRad = 0.0, rangeRad = 0.0): Line3DEntity {

	let linePositions = createCircleData(0, 1, 2, radius, segsTotal, center, beginRad, rangeRad);
	return new Line3DEntity({linePositions});
}
function createLineCircleXOZ(radius: number, segsTotal?: number, center?: IVector3, beginRad = 0.0, rangeRad = 0.0): Line3DEntity {

	let linePositions = createCircleData(0, 2, 1, radius, segsTotal, center, beginRad, rangeRad);
	return new Line3DEntity({linePositions});
}
function createLineCircleYOZ(radius: number, segsTotal?: number, center?: IVector3, beginRad = 0.0, rangeRad = 0.0): Line3DEntity {

	let linePositions = createCircleData(1, 2, 0, radius, segsTotal, center, beginRad, rangeRad);
	return new Line3DEntity({linePositions});
}

export { createLineCircleXOY, createLineCircleXOZ, createLineCircleYOZ, Line3DEntityParam, Line3DEntity };

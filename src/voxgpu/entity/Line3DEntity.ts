import { WGGeometry } from "../geometry/WGGeometry";
import DashedLineGeometry from "../geometry/primitive/DashedLineGeometry";
import GeometryBase from "../geometry/primitive/GeometryBase";
import Color4 from "../material/Color4";
import { WGMaterial } from "../material/WGMaterial";
import Vector3 from "../math/Vector3";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { Entity3DParam, getUniformValueFromParam, Entity3D } from "./Entity3D";

import vertWGSL from "../material/shader/wgsl/line.vert.wgsl";
import vertColorWGSL from "../material/shader/wgsl/lineColor.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/line.frag.wgsl";
import fragColorWGSL from "../material/shader/wgsl/lineColor.frag.wgsl";

interface Line3DEntityParam extends Entity3DParam {
	linePositions?: Vector3DataType[]
	lineColors?: ColorDataType[]
}
class Line3DEntity extends Entity3D {
	private mHaveCVS = false;
	private mColor = new Color4();
	protected mColorV: WGRBufferData;
	constructor(param?: Line3DEntityParam) {
		super(param);
		if(!param) param = {};
		this.createGeometry(param);
		this.createMaterial(param);
	}
	setColor(c: ColorDataType): Line3DEntity {
		if (c && this.mColorV) {
			this.mColor.setColor(c).toArray4(this.mColorV.data as Float32Array);
			this.mColorV.version++;
		}
		return this;
	}

	protected getGeometryData(param: Line3DEntityParam): GeometryBase {

		if(param.linePositions === undefined) {
			param.linePositions = [new Vector3(), new Vector3(100)];
		}
		let g = new DashedLineGeometry();
		g.initialize(param.linePositions, param.lineColors);
		return g;
	}

	private createGeometry(param: Entity3DParam): void {

		if (param && param.geometry) {
			this.geometry = param.geometry;
		} else {
			const geom = this.getGeometryData(param);
			if(geom) {

				console.log("geom.getCVS(): ", geom.getCVS());
				const g = new WGGeometry()
					.addAttribute({ position: geom.getVS() });
				if(geom.getCVS()) {
					this.mHaveCVS = true;
					g.addAttribute({ color: geom.getCVS() })
				}
				g.drawMode = geom.drawMode;
				this.geometry = g;
			}
		}
	}

	private createMaterial(param: Entity3DParam): void {
		if (param.materials) {
			this.materials = param.materials;
		} else {
			if (!param.uniformValues) {
				this.mColorV = getUniformValueFromParam('color', param, new WGRUniformValue({ data: new Float32Array([1,1,1, 1]), shdVarName: 'color' }));
			}
			const flag = this.mHaveCVS;
			let ns = flag ? 'color-' : '';
			const shaderCodeSrc = param.shaderSrc
				? param.shaderSrc
				: {
					vertShaderSrc: { code: this.mHaveCVS ? vertColorWGSL : vertWGSL, uuid: ns + 'line3DEntityVertShdCode' },
					fragShaderSrc: { code: this.mHaveCVS ? fragColorWGSL : fragWGSL, uuid: ns + 'line3DEntityFragShdCode' }
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
		const rpasses = param.rpasses;
		if (rpasses) {
			const ms = this.materials;
			// 这里的实现需要优化, 因为一个material实际上可以加入到多个rpass中去
			let len = Math.min(rpasses.length, ms.length);
			for (let i = 0; i < len; ++i) {
				const rpass = ms[i].rpass;
				if (!rpass || !rpass.rpass.node) {
					ms[i].rpass = rpasses[i];
				}
			}
		}
	}
}
export { Entity3DParam, getUniformValueFromParam, Line3DEntity };

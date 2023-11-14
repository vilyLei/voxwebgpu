import AABB from "../cgeom/AABB";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { VtxPipelinDescParam } from "../render/pipeline/WGRPipelineContextImpl";
import { WGRDrawMode } from "../render/Define";
import GeometryBase from "./primitive/GeometryBase";
interface WGGeomAttributeParam {
	shdVarName?: string;
	data?: NumberArrayViewType;
	strides?: number[];
	offset?: number;

	position?: NumberArrayViewType;
	uv?: NumberArrayViewType;
	uv2?: NumberArrayViewType;
	normal?: NumberArrayViewType;
	color?: NumberArrayViewType;
}
class WGGeomAttributeBlock {
	shdVarName = "";
	bindIndex = 0;
	strides = [3];
	/**
	 * buffer bytes offset
	 */
	bufferOffset = 0;
	data: NumberArrayViewType;
}
class WGGeomIndexBuffer {
	name? = "";
	data: IndexArrayViewType;
	gpuibuf?: GPUBuffer;
	constructor(param: { name?: string; data: IndexArrayViewType }) {
		this.name = param.name;
		this.data = param.data;
	}
}

class WGGeometry {
	name = "WGGeometry";

	readonly descParam: VtxPipelinDescParam = { vertex: { buffers: [] as GPUBuffer[], attributeIndicesArray: [] as number[][] } };
	attributes: WGGeomAttributeBlock[];
	gpuvbufs?: GPUBuffer[];
	indexBuffer: WGGeomIndexBuffer;
	bounds: AABB;
	drawMode = WGRDrawMode.TRIANGLES;
	geometryData: GeometryBase;
	setIndexBuffer(param: { name?: string, data: IndexArrayViewType }): WGGeometry {
		this.indexBuffer = new WGGeomIndexBuffer(param);
		return this;
	}
	setIndices(indicesData: IndexArrayViewType): WGGeometry {
		this.indexBuffer = new WGGeomIndexBuffer( {data: indicesData } );
		return this;
	}
	private filterParam(param: any, key: string, strides: number[]): void {
		if(param[key]) {
			param.data = param[key];
			if(!param.shdVarName) {
				param.shdVarName = key;
			}
			if(!param.strides) {
				param.strides = strides;
			}
			param[key] = undefined;
		}
	}
	/**
	 * 每次添加，实际上是添加一个 attribute 组合
	 */
	addAttribute(param: WGGeomAttributeParam): WGGeometry {

		if (param) {

			this.filterParam(param, 'position', [3]);
			this.filterParam(param, 'uv', [2]);
			this.filterParam(param, 'uv2', [2]);
			this.filterParam(param, 'normal', [3]);
			this.filterParam(param, 'color', [3]);

			const p = new WGGeomAttributeBlock();
			const ab = p as any;
			for (var k in param) {
				ab[k] = (param as any)[k];
			}
			if (this.attributes) {
				this.attributes.push(p);
			} else {
				this.attributes = [p];
			}
		}
		return this;
	}
	addAttributes(params: WGGeomAttributeParam[]): WGGeometry {
		if(params) {
			for(let i = 0; i < params.length; ++i) {
				this.addAttribute(params[i]);
			}
		}
		return this;
	}

	isREnabled(): boolean {
		let flag = true;
		const ats = this.attributes;
		if(ats) {
			for(let i = 0; i < ats.length; ++i) {
				if(!ats[i].data) {
					flag = false;
					break;
				}
			}
		}
		return flag;
	}
	destroy(): void {}
}
export { WGGeomAttributeParam, WGGeomIndexBuffer, WGGeomAttributeBlock, WGGeometry };

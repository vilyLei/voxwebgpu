import AABB from "../cgeom/AABB";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
interface WGGeomAttributeParam {
	shdVarName?: string;
	data: NumberArrayViewType;
	strides?: number[];
	offset?: number;
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
	setIndexBuffer(param: { name?: string; data: IndexArrayViewType }): WGGeometry {
		this.indexBuffer = new WGGeomIndexBuffer(param);
		return this;
	}
	/**
	 * 每次添加，实际上是添加一个 attribute 组合
	 */
	addAttribute(param: WGGeomAttributeParam): WGGeometry {
		if (param) {
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

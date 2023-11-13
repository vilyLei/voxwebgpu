import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniform } from "./WGRUniform";
import { BindGroupDataParamType, BufDataParamType } from "../pipeline/WGRPipelineContextImpl";
import { WGRUniformValue } from "./WGRUniformValue";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRBufferData } from "../../render/buffer/WGRBufferData";

type WGRUniformTexParam = { texView: GPUTextureView, sampler?: GPUSampler };
type WGRUniformParam = { layoutName: string, groupIndex: number, values: WGRBufferData[], texParams?: WGRUniformTexParam[] };
class WGRUniformWrapper {
	uniform: WGRUniform;
	bufDataParams?: BufDataParamType[];
	bufDataDescs?: BindGroupDataParamType[];
	texParams?: { sampler?: GPUSampler; texView: GPUTextureView }[];
	usage = 0;
	groupIndex = 0;
	enabled = true;
	uniformAppend = true;
	// buffers: GPUBuffer[];
	// oldBufs: GPUBuffer[];
	bufObj: WGRUniformBufObj;// = new WGRUniformBufObj();
}
class WGRUniformBufObj {
	uniformAppend = true;
	/**
	 * all bufs, include some shared or private bufs
	 */
	buffers: GPUBuffer[];
	/**
	 * private bufs
	 */
	oldBufs: GPUBuffer[];
	destroy(): void {
		if(this.oldBufs) {
			for (let i = 0; i < this.oldBufs.length; ++i) {
				this.oldBufs[i].destroy();
				this.oldBufs[i] = null;
			}
		}
		this.oldBufs = null;
		this.buffers = null;
	}
}

interface IWGRUniformContext {
	createUniformsWithValues(params: WGRUniformParam[], uniformAppend?: boolean): WGRUniform[];
	createUniformWithValues(
		layoutName: string,
		groupIndex: number,
		values: WGRUniformValue[],
		texParams?: WGRUniformTexParam[],
		uniformAppend?: boolean
	): WGRUniform | null;
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: { size: number; usage: number }[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[],
		uniformAppend?: boolean
	): WGRUniform | null;

	removeUniforms(us: WGRUniform[]): void;
	removeUniform(u: WGRUniform): void;
}
export { WGRUniformBufObj, WGRUniformTexParam, WGRUniformWrapper, WGRUniformParam, BufDataParamType, IWGRUniformContext };

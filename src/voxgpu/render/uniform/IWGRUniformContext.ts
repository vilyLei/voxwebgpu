import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniform } from "./WGRUniform";
import { BindGroupDataParamType,BufDataParamType} from "../pipeline/IWGRPipelineContext";
import { WGRUniformValue } from "./WGRUniformValue";

type WGRUniformTexParam = { texView: GPUTextureView, sampler?: GPUSampler };
type WGRUniformParam = { layoutName: string, groupIndex: number, values: WGRUniformValue[], texParams?: WGRUniformTexParam[] };
class WGRUniformWrapper {
	uniform: WGRUniform | null = null;
	bufDataParams?: BufDataParamType[];
	bufDataDescs?: BindGroupDataParamType[];
	texParams?: { sampler?: GPUSampler, texView: GPUTextureView }[];
	usage = 0;
	groupIndex = 0;
	enabled = true;
}

interface IWGRUniformContext {

	createUniformsWithValues(params: WGRUniformParam[]): WGRUniform[]
	createUniformWithValues(layoutName: string, groupIndex: number, values: WGRUniformValue[], texParams?: WGRUniformTexParam[]): WGRUniform | null;
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: { size: number, usage: number }[],
		texParams?: { texView: GPUTextureView, sampler?: GPUSampler }[]
	): WGRUniform | null;

	removeUniforms(us: WGRUniform[]): void;
	removeUniform(u: WGRUniform): void;
}
export { WGRUniformTexParam, WGRUniformWrapper, WGRUniformParam, BufDataParamType, IWGRUniformContext };

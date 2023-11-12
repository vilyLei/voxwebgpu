
import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import { IWGRMaterialPassView } from "../render/pipeline/IWGRMaterialPassView";
import { WGRBufferData } from "../render/buffer/WGRBufferValueParam";

interface WGMaterialDescripter {
	shadinguuid: string;
	uid?:number;
	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass?: IWGRMaterialPassView;
	/**
	 * material uniforms append to pipeline, or not
	 */
	uniformAppend?: boolean;
	instanceCount?: number;
	uniformValues?: WGRBufferData[];
}
export { WGRShderSrcType, VtxPipelinDescParam, WGRPipelineContextDefParam, WGMaterialDescripter };


import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";

interface WGMaterialDescripter {
	shadinguuid: string;
	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass?: IWGRPassRef;
};
export { WGRShderSrcType, VtxPipelinDescParam, WGRPipelineContextDefParam, WGMaterialDescripter };

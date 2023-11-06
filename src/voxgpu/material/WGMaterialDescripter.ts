
import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";

interface WGMaterialDescripter {
	shadinguuid: string;
	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass?: IWGRPassRef;
	instanceCount?: number;
	uniformValues?: WGRUniformValue[];
}
export { WGRShderSrcType, VtxPipelinDescParam, WGRPipelineContextDefParam, WGMaterialDescripter };

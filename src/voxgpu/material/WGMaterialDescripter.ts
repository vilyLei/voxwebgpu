
import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam } from "../render/pipeline/IWGRPipelineContext";
import { IWGRMaterialPassView } from "../render/pipeline/IWGRMaterialPassView";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";

interface WGMaterialDescripter {
	shadinguuid: string;
	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass?: IWGRMaterialPassView;
	/**
	 * material uniforms append to pipeline, or not
	 */
	uniformAppend?: boolean;
	instanceCount?: number;
	uniformValues?: WGRUniformValue[];
}
export { WGRShderSrcType, VtxPipelinDescParam, WGRPipelineContextDefParam, WGMaterialDescripter };

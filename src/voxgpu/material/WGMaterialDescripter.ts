
import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam } from "../render/pipeline/WGRPipelineContextImpl";
import { WGRMaterialPassViewImpl } from "../render/pipeline/WGRMaterialPassViewImpl";
import { WGRBufferData } from "../render/buffer/WGRBufferValueParam";

interface WGMaterialDescripter {
	shadinguuid?: string;
	uid?:number;
	shaderSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass?: WGRMaterialPassViewImpl;
	
	/**
	 * 如果这个属性有值，则这个material会经过 material pipeline 动态组装
	 */
	pipeline?: MaterialPipelineParam;
	/**
	 * material uniforms append to pipeline, or not
	 */
	uniformAppend?: boolean;
	instanceCount?: number;
	uniformValues?: WGRBufferData[];
}
export { WGRShderSrcType, VtxPipelinDescParam, WGRPipelineContextDefParam, WGMaterialDescripter };

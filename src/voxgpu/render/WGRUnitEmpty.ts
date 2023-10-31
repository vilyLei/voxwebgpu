import { WGRUniform } from "./uniform/WGRUniform";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../cgeom/IAABB";

/**
 * 大部分时候作为异步操作的占位符对象
 */
class WGRUnitEmpty implements IWGRUnit {

	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;
	enabled = true;
	setUniformValues(values: WGRUniformValue[]): void {
	}
	runBegin(): void {
	}
	run(): void {
	}
}

export { WGRUnitEmpty };

import { WGRUniform } from "./uniform/WGRUniform";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import IAABB from "../cgeom/IAABB";
import { WGRUnitState } from "./WGRUnitState";

interface IWGRUnit {
	uniforms?: WGRUniform[];
	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;

	enabled: boolean;
	passes?: IWGRUnit[];

	st: WGRUnitState;

	getRF(): boolean;
	setUniformValues(values: WGRUniformValue[]): void;
	runBegin(): void;
	run(): void;
}

export { IWGRUnit };

import { WGRUniform } from "./uniform/WGRUniform";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import IAABB from "../cgeom/IAABB";
import { WGRUnitState } from "./WGRUnitState";
import { IWGMaterial } from "../material/IWGMaterial";

interface IWGRUnit {
	uniforms?: WGRUniform[];
	pipelinectx: IWGRPipelineContext;
	geometry?: WGRPrimitive;
	bounds: IAABB;
	etuuid?: string;
	enabled: boolean;
	passes?: IWGRUnit[];
	st: WGRUnitState;
	__$rever: number;
	material: IWGMaterial;
	getRF(): boolean;
	setUniformValues(values: WGRUniformValue[]): void;
	runBegin(): void;
	run(): void;
	destroy(): void;
}

export { IWGRUnit };

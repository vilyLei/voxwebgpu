import { WGRUniform } from "./uniform/WGRUniform";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { WGRPipelineContextImpl } from "./pipeline/WGRPipelineContextImpl";
import IAABB from "../cgeom/IAABB";
import { WGRUnitState } from "./WGRUnitState";
import { IWGMaterial } from "../material/IWGMaterial";

interface IWGRUnit {
	uniforms?: WGRUniform[];
	pipelinectx: WGRPipelineContextImpl;
	geometry?: WGRPrimitive;
	bounds: IAABB;
	etuuid?: string;
	enabled: boolean;
	passes?: IWGRUnit[];
	pst: WGRUnitState;
	st: WGRUnitState;
	__$rever: number;
	material: IWGMaterial;

	workcounts?: Uint16Array;

	getRF(): boolean;
	// setUniformValues(values: WGRUniformValue[]): void;
	runBegin(): void;
	run(): void;
	destroy(): void;
}

export { IWGRUnit };

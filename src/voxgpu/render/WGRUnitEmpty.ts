import { WGRUniform } from "./uniform/WGRUniform";;
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { WGRPipelineContextImpl } from "./pipeline/WGRPipelineContextImpl";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../cgeom/IAABB";
import { WGRUnitState } from "./WGRUnitState";
import { IWGMaterial } from "../material/IWGMaterial";

/**
 * 大部分时候作为异步操作的占位符对象
 */
class WGRUnitEmpty implements IWGRUnit {
	uniforms?: WGRUniform[];
	pipelinectx: WGRPipelineContextImpl;
	geometry: WGRPrimitive;

	etuuid?: string;

	__$rever = 0;
	bounds: IAABB;
	pst: WGRUnitState;
	st: WGRUnitState;
	enabled = true;
	material: IWGMaterial;

	getRF(): boolean {
		return true;
	}
	setUniformValues(values: WGRUniformValue[]): void {}
	runBegin(): void {}
	run(): void {}
	destroy(): void {}
}

export { WGRUnitEmpty };

import { Entity3DParam } from "../../entity/Entity3DParam"

type DataDrivenEntityParamType = { [key: string]: DataDrivenEntityParam };
type Entity3DParamType = Entity3DParam | unknown;
interface DataDrivenEntityParam {
	uid?: number;
    uuid?: string;
	version?: string;
	name?: string;
    entity?: Entity3DParamType;
    entities?: Entity3DParamType[];
    entityType?: string;
}

interface PrimitiveDDEParam extends DataDrivenEntityParam {

    axis?: DataDrivenEntityParam;
    line?: DataDrivenEntityParam;
    rectLineGrid?: DataDrivenEntityParam;
    boundsFrame?: DataDrivenEntityParam;

    plane?: DataDrivenEntityParam;
    box?: DataDrivenEntityParam;
    cube?: DataDrivenEntityParam;

    sphere?: DataDrivenEntityParam;
    cylinder?: DataDrivenEntityParam;
    cone?: DataDrivenEntityParam;
    torus?: DataDrivenEntityParam;

    model?: DataDrivenEntityParam;
    container?: DataDrivenEntityParam;
}
export { DataDrivenEntityParamType, PrimitiveDDEParam, DataDrivenEntityParam }

import { Entity3DParam } from "../../entity/Entity3DParam"

interface DataDrivenEntityParam {
    uuid?: string;
    entity?: Entity3DParam | unknown;
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
}
export { PrimitiveDDEParam, DataDrivenEntityParam }
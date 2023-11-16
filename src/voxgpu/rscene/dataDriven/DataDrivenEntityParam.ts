import { Entity3DParam } from "../../entity/Entity3DParam"

interface DataDrivenEntityParam {
    entity?: Entity3DParam;
}
interface PrimitiveDDEParam {
    axis?: DataDrivenEntityParam;
    plane?: DataDrivenEntityParam;
    line?: DataDrivenEntityParam;
    boundsFrame?: DataDrivenEntityParam;
    box?: DataDrivenEntityParam;
    cube?: DataDrivenEntityParam;
    sphere?: DataDrivenEntityParam;
    cylinder?: DataDrivenEntityParam;
    cone?: DataDrivenEntityParam;
    torus?: DataDrivenEntityParam;
}
export { PrimitiveDDEParam, DataDrivenEntityParam }
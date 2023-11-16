import { Entity3D } from "../../entity/Entity3D";
import { PrimitiveDDEParam, DataDrivenEntityParam } from "./DataDrivenEntityParam";

/*

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
*/
const ettyes = [
    'axis', 'line', 'rectLineGrid', 'boundsFrame',
    'plane', 'box', 'cube',
    'sphere', 'cylinder', 'cone', 'torus'
];
function ddeParamFilter(d: PrimitiveDDEParam): DataDrivenEntityParam {
	if(!d) {
		return d;
	}
	let rd = d;
    for(let i = 0; i < ettyes.length; ++i) {
        rd = (d as any)[ettyes[i]];
        console.log('rd: ', rd, ', key: ', ettyes[i]);
        if(rd) {
            rd.entityType = ettyes[i];
            console.log("rd.entityType: ", rd.entityType);
            break;
        }
    }
    if(!rd) rd = d;
	// if (d.axis) {
    //     rd.entityType = 'axis'
	// 	rd = d.axis;
	// }
    /*
	if (d.line) {
		rd = d.line;
	}
	if (d.rectLineGrid) {
		rd = d.rectLineGrid;
	}
	if (d.boundsFrame) {
		rd = d.boundsFrame;
	}
	if (d.plane) {
		rd = d.plane;
	}    
	if (d.box) {
		rd = d.box;
	}
	if (d.cube) {
		rd = d.cube;
	}

	if (d.sphere) {
		rd = d.sphere;
	}
	if (d.cylinder) {
		rd = d.cylinder;
	}
	if (d.cone) {
		rd = d.cone;
	}
	if (d.torus) {
		rd = d.torus;
	}
    //*/
    return rd;
}
class DataDrivenEntityBuilder {
    constructor() { }
    createEntity(param: PrimitiveDDEParam): Entity3D {
        if(param) {
            let p = param as PrimitiveDDEParam;
            ddeParamFilter(p);
        }else {
            throw Error('Illegal Operation !!!');
        }
        return null;
    }
}
export { DataDrivenEntityBuilder };
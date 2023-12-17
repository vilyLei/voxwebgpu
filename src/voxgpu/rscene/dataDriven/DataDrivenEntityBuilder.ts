import { AxisEntity } from "../../entity/AxisEntity";
import { BoundsFrameEntity } from "../../entity/BoundsFrameEntity";
import { BoxEntity } from "../../entity/BoxEntity";
import { ConeEntity } from "../../entity/ConeEntity";
import { CubeEntity } from "../../entity/CubeEntity";
import { CylinderEntity } from "../../entity/CylinderEntity";
import { Entity3D } from "../../entity/Entity3D";
import { Line3DEntity } from "../../entity/Line3DEntity";
import { ModelEntity } from "../../entity/ModelEntity";
import { PlaneEntity } from "../../entity/PlaneEntity";
import { RectLineGridEntity } from "../../entity/RectLineGridEntity";
import { SphereEntity } from "../../entity/SphereEntity";
import { TorusEntity } from "../../entity/TorusEntity";
import { createMaterials } from "./DataMaterialParser";
import { 
	DataDrivenEntityParamType,
	PrimitiveDDEParam,
	DataDrivenEntityParam } from "./DataDrivenEntityParam";

const ettyes = [
    'axis', 'line', 'rectLineGrid', 'boundsFrame',
    'plane', 'box', 'cube',
    'sphere', 'cylinder', 'cone', 'torus',
	'model', 'container'
];
function ddeParamFilter(d: PrimitiveDDEParam): DataDrivenEntityParam {
	if(!d) {
		return d;
	}
	let rd = d;
    for(let i = 0; i < ettyes.length; ++i) {
        rd = (d as any)[ettyes[i]];
        if(rd) {
            rd.entityType = ettyes[i];
            console.log("rd.entityType: ", rd.entityType);
            break;
        }
    }
    if(!rd) rd = d;
    return rd;
}
function createEntity(param: DataDrivenEntityParam, resource?: any): Entity3D {
	let entity: Entity3D;
	if(param) {
		let et = param.entity as DataDrivenEntityParamType;
		let entityParam = param.entity;
		let materials = createMaterials(entityParam, resource);
		switch(param.entityType) {
			case 'axis':

				if(et.size !== undefined) {
					et.axisLength = et.size;
				}
				et.size = undefined;
				entity = new AxisEntity(entityParam);
				break;
			case 'line':
				entity = new Line3DEntity(entityParam);
				break;
			case 'rectLineGrid':
				entity = new RectLineGridEntity(entityParam);
				break;
			case 'boundsFrame':
				entity = new BoundsFrameEntity(entityParam);
				break;

			case 'plane':
				entity = new PlaneEntity(entityParam);
				break;
			case 'box':
				et = param.entity as DataDrivenEntityParamType;
				if(et.size !== undefined) {
					et.cubeSize = et.size;
				}
				et.size = undefined;				
				entity = new BoxEntity(entityParam);
				break;
			case 'cube':
				et = param.entity as DataDrivenEntityParamType;
				if(et.size !== undefined) {
					et.cubeSize = et.size;
				}
				et.size = undefined;
				entity = new CubeEntity(entityParam);
				break;

			case 'sphere':
				entity = new SphereEntity(entityParam);
				break;
			case 'cylinder':
				entity = new CylinderEntity(entityParam);
				break;
			case 'cone':
				entity = new ConeEntity(entityParam);
				break;
			case 'torus':
				entity = new TorusEntity(entityParam);
				break;

			case 'model':
				et = param.entity as DataDrivenEntityParamType;
				if(et.url !== undefined) {
					et.modelUrl = et.url;
				}
				et.url = undefined;
				entity = new ModelEntity(entityParam);
				break;
			case 'container':
				// entity = new AxisEntity(entityParam);
				break;
			default:
				break;

		}
		if(entity) {
			param.uid = entity.uid;
		}
	}
	return entity;
}
class DataDrivenEntityBuilder {
    constructor() { }
    createEntity(param: PrimitiveDDEParam, resource?: any): Entity3D {
		let et: Entity3D;
        if(param) {
            let p = param as PrimitiveDDEParam;
            let ep = ddeParamFilter(p);
			et = createEntity(ep, resource);
        }else {
            throw Error('Illegal Operation !!!');
        }
        return et;
    }
}
export { DataDrivenEntityBuilder };

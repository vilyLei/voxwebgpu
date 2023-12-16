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
import { WGMaterial } from "../../material/WGMaterial";
import { 
	Entity3DParamType,
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
        // console.log('rd: ', rd, ', key: ', ettyes[i]);
        if(rd) {
            rd.entityType = ettyes[i];
            console.log("rd.entityType: ", rd.entityType);
            break;
        }
    }
    if(!rd) rd = d;
    return rd;
}
function createMaterials(entityParam: Entity3DParamType): WGMaterial[] {
	let pedata = entityParam as any;
	let pdataMaterials = pedata.materials;
	pedata.materials = undefined;
	if(pdataMaterials) {
		console.log("find some materials.");
	}
	return null;
}
function createEntity(param: DataDrivenEntityParam): Entity3D {
	let entity: Entity3D;
	if(param) {
		let et = param.entity as DataDrivenEntityParamType;
		// let pdata: any = param;
		// let pdmaterials = pdata.materials;
		// pdata.materials = undefined;
		switch(param.entityType) {
			case 'axis':

				if(et.size !== undefined) {
					et.axisLength = et.size;
				}
				et.size = undefined;
				entity = new AxisEntity(param.entity);
				break;
			case 'line':
				entity = new Line3DEntity(param.entity);
				break;
			case 'rectLineGrid':
				entity = new RectLineGridEntity(param.entity);
				break;
			case 'boundsFrame':
				entity = new BoundsFrameEntity(param.entity);
				break;

			case 'plane':
				entity = new PlaneEntity(param.entity);
				break;
			case 'box':
				et = param.entity as DataDrivenEntityParamType;
				if(et.size !== undefined) {
					et.cubeSize = et.size;
				}
				et.size = undefined;
				entity = new BoxEntity(param.entity);
				break;
			case 'cube':
				// let materials = createMaterials(pdmaterials);
				let materials = createMaterials(param.entity);
				entity = new CubeEntity(param.entity);
				break;

			case 'sphere':
				entity = new SphereEntity(param.entity);
				break;
			case 'cylinder':
				entity = new CylinderEntity(param.entity);
				break;
			case 'cone':
				entity = new ConeEntity(param.entity);
				break;
			case 'torus':
				entity = new TorusEntity(param.entity);
				break;

			case 'model':
				et = param.entity as DataDrivenEntityParamType;
				if(et.url !== undefined) {
					et.modelUrl = et.url;
				}
				et.url = undefined;
				entity = new ModelEntity(param.entity);
				break;
			case 'container':
				// entity = new AxisEntity(param.entity);
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
    createEntity(param: PrimitiveDDEParam): Entity3D {
		let et: Entity3D;
        if(param) {
            let p = param as PrimitiveDDEParam;
            let ep = ddeParamFilter(p);
			et = createEntity(ep);
        }else {
            throw Error('Illegal Operation !!!');
        }
        return et;
    }
}
export { DataDrivenEntityBuilder };

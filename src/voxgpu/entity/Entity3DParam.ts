import ROTransform from "./ROTransform";
import IMatrix4 from "../math/IMatrix4";
import { WGGeometry } from "../geometry/WGGeometry";
import { checkMaterialRPasses, WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRMaterialPassViewImpl } from "../render/pipeline/WGRMaterialPassViewImpl";
import { TransformParam } from "./TransformParam";
import { WGRUnitState } from "../render/WGRUnitState";

interface Entity3DParam {
	processIndex?:number,
	cameraViewing?: boolean;
	transformEnabled?: boolean;
	transform?: ROTransform | IMatrix4 | Float32Array | TransformParam;
	rstate?: WGRUnitState;
	transufvShared?: boolean;
	materials?: WGMaterial[];
	geometryDynamic?: boolean;
	geometry?: WGGeometry;
	textures?: WGTextureDataDescriptor[];
	/**
	 * Possible values are: "transparent", "add", "alpha_add", "solid"
	 */
	blendModes?: string[];
	faceCullMode?: string;
	depthWriteEnabled?: boolean;
	shaderSrc?: WGRShderSrcType;
	uniformValues?: WGRBufferData[];
	shadinguuid?: string;
	instanceCount?: number;
	doubleFace?: boolean;
	wireframe?: boolean;
	rpasses?: WGRMaterialPassViewImpl[];
	/**
	 * build geometry/material object, yes or no
	 */
	building?: boolean;
}

function getUniformValueFromParam(key: string, param: Entity3DParam, defaultV?: WGRBufferData): WGRBufferData {
	const ufvs = param.uniformValues;
	if (param.uniformValues) {
		for (let i = 0; i < ufvs.length; ++i) {
			if (ufvs[i].shdVarName == key) {
				return ufvs[i];
			}
		}
	}
	return defaultV;
}
function checkEntityMaterialsInfo(ms: WGMaterial[], param: Entity3DParam): void {

	if(param.doubleFace !== undefined) {
		let flag = param.doubleFace === true;
		for(let i = 0; i < ms.length; ++i) {
			if(ms[i].doubleFace === undefined && flag) {
				ms[i].doubleFace = flag;
				ms[i].shadinguuid += '-dface';
			}
		}
	}
	if(param.wireframe !== undefined) {
		let flag = param.wireframe === true;
		for(let i = 0; i < ms.length; ++i) {
			if(ms[i].wireframe === undefined && flag) {
				ms[i].wireframe = flag;
				ms[i].shadinguuid += '-wframe';
			}
		}
	}
	checkMaterialRPasses(ms, param.rpasses);
}
export { checkEntityMaterialsInfo, TransformParam, Entity3DParam, getUniformValueFromParam };

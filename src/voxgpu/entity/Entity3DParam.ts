import ROTransform from "./ROTransform";
import IMatrix4 from "../math/IMatrix4";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRMaterialPassViewImpl } from "../render/pipeline/WGRMaterialPassViewImpl";

interface Entity3DParam {
	cameraViewing?: boolean;
	transformEnabled?: boolean;
	transform?: ROTransform | IMatrix4 | Float32Array;
	transufvShared?: boolean;
	materials?: WGMaterial[];
	geometry?: WGGeometry;
	textures?: WGTextureDataDescriptor[];
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
export { Entity3DParam, getUniformValueFromParam };

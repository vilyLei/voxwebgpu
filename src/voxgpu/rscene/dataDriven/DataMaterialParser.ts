import { BaseMaterial } from "../../material/BaseMaterial";
import { WGMaterial } from "../../material/WGMaterial";
import { Entity3DParamType } from "./DataDrivenEntityParam";

function parseBaseMaterialPpt(mdata: any, resource?: any): WGMaterial {

	let mt: BaseMaterial;
	if (mdata) {
		console.log("parseBaseMaterialPpt(), resource: ", resource);
		let faceCullMode = 'back';
		if(mdata.faceCullMode !== undefined) {
			faceCullMode = mdata.faceCullMode;
		}
		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode
		}
		mt = new BaseMaterial({ pipelineDefParam });
		let ppt = mt.property;
		ppt.lighting = mdata.lighting === true;
		ppt.shadow = mdata.shadow === true;
		ppt.shadowReceived = mdata.shadowReceived === true;
		ppt.fogging = mdata.fogging === true;
		ppt.armsBase.value = [1.0, 0.2, 0.0, 0.0];
		if (mdata.arms) {
			ppt.arms.value = mdata.arms;
		}
		if (mdata.albedo) {
			ppt.albedo.value = mdata.albedo;
		}
		if(mdata.uvParam) {
			ppt.uvParam.value = mdata.uvParam;
		}
		if(mdata.emissive) {
			ppt.ambient.value = mdata.emissive;
		}
		if(mdata.textures !== undefined) {
			if(resource && resource.textures) {
				let texObj = resource.textures[mdata.textures];
				let textures = texObj.list;
				console.log("vvvv textures: ", textures);
				mt.addTextures( textures );
			}
		}
	}
	return mt;
}

function createMaterials(entityParam: Entity3DParamType, resource?: any): WGMaterial[] {
	let pedata = entityParam as any;
	if (pedata) {
		let pdataMaterials = pedata.materials;
		pedata.materials = undefined;
		if (pdataMaterials) {
			// console.log("find some materials, resource: ", resource);
			let ms = [] as WGMaterial[];
			let dms = pdataMaterials;
			for (let i = 0; i < dms.length; ++i) {
				let m = dms[i];
				switch (m.type) {
					case "default":
						let baseMt = parseBaseMaterialPpt(m, resource);
						if(baseMt) {
							ms.push(baseMt);
						}
						break;
					default:
						break;
				}
			}
			pedata.materials = ms;
			return ms;
		}
	}
	return null;
}
export { createMaterials };

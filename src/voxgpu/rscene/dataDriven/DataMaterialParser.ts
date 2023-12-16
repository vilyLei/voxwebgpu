import { BaseMaterial } from "../../material/BaseMaterial";
import { WGMaterial } from "../../material/WGMaterial";
import { Entity3DParamType } from "./DataDrivenEntityParam";

function parseBaseMaterialPpt(mdata: any): WGMaterial {

	let mt: BaseMaterial;
	if (mdata) {
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
		if (mdata.arms) {
			ppt.arms.value = mdata.arms;
		}
		if (mdata.albedo) {
			ppt.albedo.value = mdata.albedo;
		}
	}
	return mt;
}

function createMaterials(entityParam: Entity3DParamType): WGMaterial[] {
	let pedata = entityParam as any;
	if (pedata) {
		let pdataMaterials = pedata.materials;
		pedata.materials = undefined;
		if (pdataMaterials) {
			// console.log("find some materials.");
			let ms = [] as WGMaterial[];
			let dms = pdataMaterials;
			for (let i = 0; i < dms.length; ++i) {
				let m = dms[i];
				switch (m.type) {
					case "default":
						// let mt = new BaseMaterial({ pipelineDefParam });
						// let ppt = mt.property;
						// ppt.arms.roughness = 0.3;
						// ppt.arms.metallic = 0.2;
						let baseMt = parseBaseMaterialPpt(m);
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

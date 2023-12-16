
import { SpecularEnvBrnTexture } from "./SpecularEnvBrnTexture";
import { TextureDataDescriptor } from "./WGTextureDataDescriptor";
import { WGRTTTextureData, WGImage2DTextureData, WGDataTextureData, WGImageCubeTextureData, WGTextureData, WGTextureDataDescriptor } from "./WGTextureWrapper";

const __$texDataMap: Map<string, WGTextureData> = new Map();
const __$hdrEnvtex = new SpecularEnvBrnTexture();

function texDescriptorFilter(d: WGTextureDataDescriptor): TextureDataDescriptor {
    
	if (!d) {
		return d;
	}
	let rd = d;
	if (d.diffuse) {
		rd = d.diffuse;
		if (!rd.shdVarName) {
			rd.shdVarName = "diffuse";
		}
		return rd;
	}
	if (d.baseColor) {
		rd = d.baseColor;
		if (!rd.shdVarName) {
			rd.shdVarName = "baseColor";
		}
		return rd;
	}
	if (d.albedo) {
		rd = d.albedo;
		if (!rd.shdVarName) {
			rd.shdVarName = "albedo";
		}
		return rd;
	}

	if (d.normal) {
		rd = d.normal;
		if (!rd.shdVarName) {
			rd.shdVarName = "normal";
		}
		return rd;
	}
	if (d.ao) {
		rd = d.ao;
		if (!rd.shdVarName) {
			rd.shdVarName = "ao";
		}
		return rd;
	}
	if (d.metallic) {
		rd = d.metallic;
		if (!rd.shdVarName) {
			rd.shdVarName = "metallic";
		}
	}

	if (d.roughness) {
		rd = d.roughness;
		if (!rd.shdVarName) {
			rd.shdVarName = "roughness";
		}
		return rd;
	}
	if (d.specularEnv) {
		rd = d.specularEnv;
        if(rd.dataTexture === undefined) {
            __$hdrEnvtex.update();
            rd = __$hdrEnvtex.specularEnv;
        }
		if (!rd.shdVarName) {
			rd.shdVarName = "specularEnv";
		}
		return rd;
	}
	if (d.arm) {
		rd = d.arm;
		rd.shdVarName = "arm";
	}

	if (d.parallax) {
		rd = d.parallax;
		if (!rd.shdVarName) {
			rd.shdVarName = "parallax";
		}
		return rd;
	}
	if (d.heightmap) {
		rd = d.heightmap;
		if (!rd.shdVarName) {
			rd.shdVarName = "heightmap";
		}
	}
	if (d.displacement) {
		rd = d.displacement;
		if (!rd.shdVarName) {
			rd.shdVarName = "displacement";
		}
		return rd;
	}

	if (d.opacity) {
		rd = d.opacity;
		if (!rd.shdVarName) {
			rd.shdVarName = "opacity";
		}
		return rd;
	}
	if (d.emissive) {
		rd = d.emissive;
		if (!rd.shdVarName) {
			rd.shdVarName = "emissive";
		}
		return rd;
	}
	if (d.specular) {
		rd = d.specular;
		if (!rd.shdVarName) {
			rd.shdVarName = "specular";
		}
		return rd;
	}

	return rd;
}
function createDataWithDescriptor(descriptor: WGTextureDataDescriptor): WGTextureData {
	
	if(descriptor && descriptor.update !== undefined) {
		descriptor.update();
	}
	let td: WGTextureData;
	const dpt = texDescriptorFilter(descriptor);
	let viewDimension = dpt.viewDimension ? dpt.viewDimension : "2d";
	const map = __$texDataMap;
	let key = "";
	if (dpt.url !== undefined) {
		key = dpt.url;
	} else if (dpt.urls !== undefined) {
		key = dpt.urls[0];
	}
	if (key === "") {
		if (dpt.uuid !== undefined) {
			key = dpt.uuid;
		}
	}
	if (key !== "") {
		if (map.has(key)) {
			return map.get(key);
		}
	}

	switch (viewDimension) {
		case "2d":
			// console.log("create a 2d texture instance ...");
			if (dpt.rttTexture) {
				td = new WGRTTTextureData().setDescripter(dpt);
			} else if (dpt.dataTexture) {
				td = new WGDataTextureData().setDescripter(dpt);
			} else {
				td = new WGImage2DTextureData().setDescripter(dpt);
			}
			break;
		case "cube":
			// console.log("create a cube texture instance ...");
			if (dpt.dataTexture) {
				td = new WGDataTextureData().setDescripter(dpt);
			} else {
				td = new WGImageCubeTextureData().setDescripter(dpt);
			}
			break;
		default:
			throw Error("Illegal Operation !!!");
			break;
	}
	if (td) {
		if (key !== "") {
			map.set(key, td);
		}
	}
	return td;
}

export {
	texDescriptorFilter,
	createDataWithDescriptor,
}
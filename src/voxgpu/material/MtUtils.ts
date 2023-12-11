import { WebGPUContext } from "../gpu/WebGPUContext";
import { IWGMaterial } from "./IWGMaterial";

export function updateMaterialData(wgctx: WebGPUContext, m: IWGMaterial): void {
	if (wgctx && !m.isREnabled()) {
		const texs = m.textures;
		for (let i = 0; i < texs.length; ++i) {
			const tex = texs[i];
			if (tex.texture && tex.texture.data && !tex.texture.texture) {
				tex.texture.texture = tex.texture.data.build(wgctx);
			}
		}
	}
}

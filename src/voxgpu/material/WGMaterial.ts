import { WGImageTextureData, WGTextureWrapperParam, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";

class WGMaterial implements WGMaterialDescripter {
	private mRCtx: IWGRPipelineContext;
	/**
	 * unique shading process uuid
	 */
	shadinguuid = "base-material";

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	uniformValues: WGRUniformValue[];

	// textures: { [key: string]: WGTextureWrapper } = {};

	textures: WGTextureWrapper[];

	constructor(descriptor?: WGMaterialDescripter) {
		this.setDescriptor(descriptor);
	}
	addTextureWithDatas(datas: WGImageTextureData[], shdVarNames?: string[]): void {

		if (datas) {
			if (shdVarNames) {
				for (let i = 0; i < datas.length; ++i) {
					this.addTextureWithData(datas[i], shdVarNames[i]);
				}
			} else {
				for (let i = 0; i < datas.length; ++i) {
					this.addTextureWithData(datas[i]);
				}
			}
		}
	}
	addTextureWithData(data: WGImageTextureData, shdVarName = ""): void {
		if (shdVarName === "") {
			shdVarName = "texture" + (this.textures ? this.textures.length : 0);
		}
		this.addTextureWithParam({ texture: { data: data, shdVarName } });
	}
	addTextureWithParam(param: WGTextureWrapperParam): void {
		if (this.textures) {
			this.textures.push(new WGTextureWrapper(param));
		} else {
			this.textures = [new WGTextureWrapper(param)];
		}
	}
	addTextureWithParams(params: WGTextureWrapperParam[]): void {
		for (let i = 0; i < params.length; ++i) {
			this.addTextureWithParam(params[i]);
		}
	}
	isREnabled(): boolean {
		const texs = this.textures;
		if (texs) {
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				if (!tex.texture || !tex.texture.texture) {
					return false;
				}
			}
		}
		return true;
	}
	getRCtx(): IWGRPipelineContext {
		return this.mRCtx;
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		if (descriptor) {
			this.shadinguuid = descriptor.shadinguuid;
			this.shaderCodeSrc = descriptor.shaderCodeSrc;
			this.pipelineVtxParam = descriptor.pipelineVtxParam;
			this.pipelineDefParam = descriptor.pipelineDefParam;
		}
	}
	initialize(pipelineCtx: IWGRPipelineContext): void {
		if (!this.mRCtx) {
			if (!pipelineCtx) {
				throw Error("pipelineCtx is undefined.");
			}
			this.mRCtx = pipelineCtx;
		}
	}
	copyfrom(src: WGMaterial): WGMaterial {
		return this;
	}
	destroy(): void { }
}
export { WGMaterial };

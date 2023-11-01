import { WGTextureDataDescriptor, createDataWithDescriptor, WGImageTextureData, WGTextureWrapperParam, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRUniform } from "../render/uniform/WGRUniform";
import { IWGMaterial } from "./IWGMaterial";

class WGMaterial implements IWGMaterial {
	private mRCtx: IWGRPipelineContext;
	private mREnabled = false;
	name?: string;
	/**
	 * unique shading process uuid
	 */
	shadinguuid = "default-material";

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;
	rpass: IWGRPassRef = {index: 0};

	uniformValues: WGRUniformValue[];

	// textures: { [key: string]: WGTextureWrapper } = {};

	textures: WGTextureWrapper[];

	__$ufs?: WGRUniform[];

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

	addTexture(descriptor: WGTextureDataDescriptor): void {
		const td = createDataWithDescriptor(descriptor);
		this.addTextureWithData(td, descriptor.shdVarName);
	}
	addTextures(descriptors: WGTextureDataDescriptor[]): void {
		for (let i = 0; i < descriptors.length; ++i) {
			this.addTexture(descriptors[i]);
		}
	}
	isREnabled(): boolean {
		if(this.mREnabled) {
			return this.mREnabled;
		}
		const texs = this.textures;
		if (texs) {
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				if (!tex.texture || !tex.texture.texture) {
					return false;
				}
			}
		}
		this.mREnabled = true;
		return this.mREnabled;
	}
	getRCtx(): IWGRPipelineContext {
		return this.mRCtx;
	}
	setDescriptor(descriptor: WGMaterialDescripter): void {
		const d = descriptor;
		if (d) {
			if (d.shadinguuid) this.shadinguuid = d.shadinguuid;
			if (d.shaderCodeSrc) this.shaderCodeSrc = d.shaderCodeSrc;
			if (d.pipelineVtxParam) this.pipelineVtxParam = d.pipelineVtxParam;
			if (d.pipelineDefParam) this.pipelineDefParam = d.pipelineDefParam;
			if (d.rpass) this.rpass = d.rpass;
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
	destroy(): void {
		if (this.mRCtx) {
			this.mRCtx = null;
		}
	}
}
export { WGTextureDataDescriptor, WGMaterial };

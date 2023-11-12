import {
	WGTextureDataDescriptor,
	createDataWithDescriptor,
	WGTextureData,
	WGTextureWrapperParam,
	WGTextureWrapper
} from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { IWGRMaterialPassView } from "../render/pipeline/IWGRMaterialPassView";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { IWGMaterial } from "./IWGMaterial";
import { IWGMaterialGraph } from "./IWGMaterialGraph";
import { WGRBufferData } from "../render/buffer/WGRBufferValueParam";

class WGMaterial implements IWGMaterial {
	private static sUid = 0;
	private mUid = WGMaterial.sUid ++;

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
	rpass: IWGRMaterialPassView = {rpass: { index: 0 } };

	/**
	 * material uniforms append to pipeline, or not
	 */
	uniformAppend?: boolean;
	// uniformValues: WGRUniformValue[];
	uniformValues: WGRBufferData[];

	instanceCount = 1;

	// textures: { [key: string]: WGTextureWrapper } = {};
	textures: WGTextureWrapper[];

	visible = true;
	graph?: IWGMaterialGraph;

	constructor(descriptor?: WGMaterialDescripter) {
		this.setDescriptor(descriptor);
	}
	get uid(): number {
		return this.mUid;
	}
	addTextureWithDatas(datas: WGTextureData[], shdVarNames?: string[]): WGMaterial {
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
		return this;
	}
	addTextureWithData(data: WGTextureData, shdVarName = ""): void {
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
		if (descriptors) {
			for (let i = 0; i < descriptors.length; ++i) {
				this.addTexture(descriptors[i]);
			}
		}
	}
	isREnabled(): boolean {
		if (this.mREnabled) {
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
			if (d.uniformAppend !== undefined) this.uniformAppend = d.uniformAppend;

			if (d.uniformValues) this.uniformValues = d.uniformValues;
			if (d.instanceCount !== undefined) this.instanceCount = d.instanceCount;
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

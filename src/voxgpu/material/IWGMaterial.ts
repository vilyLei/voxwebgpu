import { WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";

interface IWGMaterial extends WGMaterialDescripter {

	/**
	 * unique shading process uuid
	 */
	shadinguuid: string;

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	uniformValues: WGRUniformValue[];

	// textures: { [key: string]: WGTextureWrapper } = {};

	textures: WGTextureWrapper[];

	addTextureWithDatas(datas: WGImageTextureData[], shdVarNames?: string[]): void;

	isREnabled(): boolean;
	getRCtx(): IWGRPipelineContext;
	setDescriptor(descriptor: WGMaterialDescripter): void;
	initialize(pipelineCtx: IWGRPipelineContext): void;
	destroy(): void;
}
export { IWGMaterial };

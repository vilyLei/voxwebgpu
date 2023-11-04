import { WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, IWGRPipelineContext } from "../render/pipeline/IWGRPipelineContext";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
// import { WGRUniform } from "../render/uniform/WGRUniform";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";
import { IWGMaterialShaderLayout } from "./IWGMaterialShaderLayout";
import { IWGMaterialGraph } from "./IWGMaterialGraph";

interface IWGMaterial extends WGMaterialDescripter {

	name?: string;
	/**
	 * unique shading process uuid
	 */
	shadinguuid: string;

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	rpass: IWGRPassRef;
	uniformValues: WGRUniformValue[];

	// textures: { [key: string]: WGTextureWrapper } = {};
	textures: WGTextureWrapper[];

	visible: boolean;
	graph?: IWGMaterialGraph;

	instanceCount: number;

	addTextureWithDatas(datas: WGImageTextureData[], shdVarNames?: string[]): void;

	isREnabled(): boolean;
	getRCtx(): IWGRPipelineContext;
	setDescriptor(descriptor: WGMaterialDescripter): void;
	initialize(pipelineCtx: IWGRPipelineContext): void;
	destroy(): void;
}
export { IWGMaterial };

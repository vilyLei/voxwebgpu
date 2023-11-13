import { WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContextImpl } from "../render/pipeline/WGRPipelineContextImpl";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
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

	// uniformValues: WGRUniformValue[];
	// uniformValues: WGRBufferData[];

	// textures: { [key: string]: WGTextureWrapper } = {};
	textures: WGTextureWrapper[];

	visible: boolean;
	graph?: IWGMaterialGraph;

	instanceCount: number;

	addTextureWithDatas(datas: WGImageTextureData[], shdVarNames?: string[]): void;

	isREnabled(): boolean;
	getRCtx(): WGRPipelineContextImpl;
	setDescriptor(descriptor: WGMaterialDescripter): void;
	initialize(pipelineCtx: WGRPipelineContextImpl): void;
	destroy(): void;
}
export { IWGMaterial };

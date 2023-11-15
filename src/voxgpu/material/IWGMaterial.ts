import { WGImageTextureData, WGTextureWrapper } from "../texture/WGTextureWrapper";

import { WGRPipelineContextDefParam, WGRShderSrcType } from "../render/pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContextImpl } from "../render/pipeline/WGRPipelineContextImpl";
import { WGMaterialDescripter } from "./WGMaterialDescripter";
import { IWGMaterialGraph } from "./IWGMaterialGraph";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRMaterialPassViewImpl } from "../render/pipeline/WGRMaterialPassViewImpl";

interface IWGMaterial extends WGMaterialDescripter {

	name?: string;
	/**
	 * unique shading process uuid
	 */
	shadinguuid: string;

	shaderCodeSrc?: WGRShderSrcType;
	pipelineVtxParam?: VtxPipelinDescParam;
	pipelineDefParam?: WGRPipelineContextDefParam;

	uniformValues: WGRBufferData[];

	// textures: { [key: string]: WGTextureWrapper } = {};
	textures: WGTextureWrapper[];

	rpass: WGRMaterialPassViewImpl;

	wireframe?: boolean;
	doubleFace?: boolean;

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
function checkMaterialRPasses(ms: IWGMaterial[], rpasses: WGRMaterialPassViewImpl[]): void {
	// const rpasses = param.rpasses;
	if (rpasses) {
		const ms = this.materials;
		// 这里的实现需要优化, 因为一个material实际上可以加入到多个rpass中去
		let len = Math.min(rpasses.length, ms.length);
		for (let i = 0; i < len; ++i) {
			const rpass = ms[i].rpass;
			if (!rpass || !rpass.rpass.node) {
				ms[i].rpass = rpasses[i];
			}
		}
	}
}
export { checkMaterialRPasses, IWGMaterial };

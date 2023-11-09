import { WGRPassParam, WGRendererPass } from "./pipeline/WGRendererPass";
import { WGRPipelineContextDefParam, WGRShderSrcType, WGRPipelineCtxParams } from "./pipeline/WGRPipelineCtxParams";
import { VtxPipelinDescParam, WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { GPUCommandBuffer } from "../gpu/GPUCommandBuffer";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import { IWGRenderPassNodeRef } from "./IWGRenderPassNodeRef";
import { WGRenderPassNode } from "./WGRenderPassNode";
import Color4 from "../material/Color4";
import Camera from "../view/Camera";
interface IWGRPassNodeBuilder {
	readonly camera: Camera;
	getWGCtx(): WebGPUContext;
	getPassNodeWithMaterial(material: WGMaterialDescripter): WGRenderPassNode;
	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext;
}
export { IWGRPassNodeBuilder };

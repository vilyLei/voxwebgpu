import { WGRPipelineContext } from "./pipeline/WGRPipelineContext";
import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";
import { WGRenderPassNode } from "./WGRenderPassNode";
import Camera from "../view/Camera";
interface IWGRPassNodeBuilder {
	readonly camera: Camera;
	getWGCtx(): WebGPUContext;
	hasMaterial(material: WGMaterialDescripter): boolean;
	getPassNodeWithMaterial(material: WGMaterialDescripter): WGRenderPassNode;
	createRenderPipelineCtxWithMaterial(material: WGMaterialDescripter): WGRPipelineContext;
}
export { IWGRPassNodeBuilder };

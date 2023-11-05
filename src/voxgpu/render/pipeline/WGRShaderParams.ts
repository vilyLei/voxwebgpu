import { GPUFragmentState } from "../../gpu/GPUFragmentState";
import { GPUComputeState } from "../../gpu/GPUComputeState";
import { GPUShaderModule } from "../../gpu/GPUShaderModule";

interface WGRShadeSrcParam {
	code: string;
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string
}
interface WGRShderSrcType {
	shaderSrc?: WGRShadeSrcParam;
	vertShaderSrc?: WGRShadeSrcParam;
	fragShaderSrc?: WGRShadeSrcParam;
	compShaderSrc?: WGRShadeSrcParam;
}

function createFragmentState(shaderModule?: GPUShaderModule): GPUFragmentState {
	const st = {
		module: shaderModule,
		entryPoint: "main",
		targets: [
			{
				format: "bgra8unorm"
			}
		]
	} as GPUFragmentState;
	return st;
}
function createComputeState(shaderModule?: GPUShaderModule): GPUComputeState {
	const st = {
		module: shaderModule,
		entryPoint: "main"
	} as GPUComputeState;
	return st;
}

export { WGRShderSrcType, WGRShadeSrcParam, createFragmentState, createComputeState };

import { GPUFragmentState } from "../../gpu/GPUFragmentState";
import { GPUComputeState } from "../../gpu/GPUComputeState";
import { GPUShaderModule } from "../../gpu/GPUShaderModule";
import { GPUColorTargetState } from "../../gpu/GPUColorTargetState";
import { WGRShadeSrcParam, WGRShderSrcType } from "./WGRShderSrcType";

// interface WGRShadeSrcParam {
// 	code?: string;
// 	uuid?: string;
// 	vertEntryPoint?: string;
// 	fragEntryPoint?: string;
// 	compEntryPoint?: string
// }
// interface WGRShderSrcType extends WGRShadeSrcParam {
// 	shaderSrc?: WGRShadeSrcParam;
// 	vertShaderSrc?: WGRShadeSrcParam;
// 	fragShaderSrc?: WGRShadeSrcParam;
// 	compShaderSrc?: WGRShadeSrcParam;

// 	vert?: WGRShadeSrcParam;
// 	frag?: WGRShadeSrcParam;
// 	comp?: WGRShadeSrcParam;
// }

function findShaderEntryPoint(keyStr: string, src: string): string {
	let i = src.indexOf(keyStr);
	if(i < 0) {
		// throw Error("Illegal Operation !!!");
		return "";
	}
	i = src.indexOf('fn',i + keyStr.length) + 2;
	let j = src.indexOf('(',i);

	return src.slice(i, j).trim();
}
function createFragmentState(shaderModule?: GPUShaderModule, targetStates?: GPUColorTargetState[]): GPUFragmentState {
	const st = {
		module: shaderModule,
		entryPoint: "main",
		targets: [
			{
				format: "bgra8unorm"
			}
		]
	} as GPUFragmentState;
	if(targetStates !== undefined && targetStates.length > 0) {
		st.targets = targetStates;
	}
	return st;
}
function createComputeState(shaderModule?: GPUShaderModule): GPUComputeState {
	const st = {
		module: shaderModule,
		entryPoint: "main"
	} as GPUComputeState;
	return st;
}

export { WGRShderSrcType, WGRShadeSrcParam, findShaderEntryPoint, createFragmentState, createComputeState };

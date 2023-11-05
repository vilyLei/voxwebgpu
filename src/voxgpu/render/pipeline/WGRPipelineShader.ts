import { GPUShaderModule } from "../../gpu/GPUShaderModule";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRShadeSrcParam, WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { createFragmentState, createComputeState } from "./WGRShaderParams";

class WGRPipelineShader {
	private mWGCtx: WebGPUContext;
	private mShdModuleMap: Map<string, GPUShaderModule> = new Map();
	constructor(wgCtx?: WebGPUContext) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}

	initialize(wgCtx: WebGPUContext): void {
		if (wgCtx && !this.mWGCtx) {
			this.mWGCtx = wgCtx;
		}
	}
	private createShaderModule(type: string, param: WGRShadeSrcParam): GPUShaderModule {
		if(param) {
			const device = this.mWGCtx.device;
			if (param.uuid && param.uuid !== "") {
				const ns = param.uuid + "-" + type;
				const map = this.mShdModuleMap;
				if (map.has(ns)) {
					console.log("WGRPipelineShader::createShaderModule(), use old shader module ...");
					return map.get(ns);
				}
				const module = device.createShaderModule({
					label: ns,
					code: param.code
				});
				map.set(ns, module);
				return module;
			}
			const module = device.createShaderModule({
				code: param.code
			});
			return module;
		}
		return null;
	}
	build(params: WGRPipelineCtxParams): void {
		
		let shdModule = params.shaderSrc ? this.createShaderModule("Shader", params.shaderSrc) : null;
		let vertShdModule = params.vertShaderSrc ? this.createShaderModule("VertShader", params.vertShaderSrc) : shdModule;
		let fragShdModule = params.fragShaderSrc ? this.createShaderModule("FragShader", params.fragShaderSrc) : shdModule;
		let compShdModule = params.compShaderSrc ? this.createShaderModule("CompShader", params.compShaderSrc) : shdModule;

		const vert = params.vertex;
		let shdSrc = params.shaderSrc ? params.shaderSrc : params.vertShaderSrc;
		if(shdSrc) {
			vert.module = vertShdModule;
			if (shdSrc.vertEntryPoint !== undefined) {
				vert.entryPoint = shdSrc.vertEntryPoint;
			}
		}else {
			params.vertex = null;
		}

		let frag = params.fragment;
		shdSrc = params.shaderSrc ? params.shaderSrc : params.fragShaderSrc;
		if(shdSrc) {
			if(!frag) {
				frag = params.fragment = createFragmentState();
			}
			frag.module = fragShdModule;
			if (shdSrc.fragEntryPoint !== undefined) {
				frag.entryPoint = shdSrc.fragEntryPoint;
			}
		}else {
			params.fragment = null;
		}
		const comp = params.compShaderSrc;
		if(comp && compShdModule) {
			params.compute = createComputeState( compShdModule );
		}
	}
}
export { WGRPipelineShader };

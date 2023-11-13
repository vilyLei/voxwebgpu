import { GPUShaderModule } from "../../gpu/GPUShaderModule";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRShadeSrcParam, WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { findShaderEntryPoint, createFragmentState, createComputeState } from "./WGRShaderParams";

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

		let entryPoint = "";
		const vert = params.vertex;
		let shdSrc = params.shaderSrc ? params.shaderSrc : params.vertShaderSrc;
		if(shdSrc) {
			entryPoint = shdSrc.vertEntryPoint !== undefined ? shdSrc.vertEntryPoint : findShaderEntryPoint('@vertex', shdSrc.code);
			if(entryPoint !== '') {
				vert.module = vertShdModule;
				vert.entryPoint = entryPoint;
			}
		}else {
			params.vertex = null;
		}

		let frag = params.fragment;
		shdSrc = params.shaderSrc ? params.shaderSrc : params.fragShaderSrc;
		if(shdSrc) {
			entryPoint = shdSrc.fragEntryPoint !== undefined ? shdSrc.fragEntryPoint : findShaderEntryPoint('@fragment', shdSrc.code);
			if(entryPoint !== '') {
				if(!frag) {
					frag = params.fragment = createFragmentState();
				}
				frag.module = fragShdModule;
				frag.entryPoint = entryPoint;
			}
		}else {
			params.fragment = null;
		}
		shdSrc = params.compShaderSrc;
		if(shdSrc && compShdModule) {
			shdSrc = params.compShaderSrc;
			params.compute = createComputeState( compShdModule );
			if (shdSrc.compEntryPoint !== undefined) {
				params.compute.entryPoint = shdSrc.compEntryPoint;
			}else {
				shdSrc.compEntryPoint = params.compute.entryPoint = findShaderEntryPoint('@compute', shdSrc.code);
			}
		}else if(compShdModule){
			shdSrc = params.shaderSrc;
			entryPoint = findShaderEntryPoint('@compute', shdSrc.code);
			if(entryPoint != '') {
				params.compute = createComputeState( compShdModule );
				params.compute.entryPoint = entryPoint;
			}
		}
	}
}
export { WGRPipelineShader };

import { GPUShaderModule } from "../../gpu/GPUShaderModule";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { IWGRShadeSrcParam, WGRPipelineCtxParams } from "./WGRPipelineCtxParams";

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
	private createShaderModule(type: string, param: IWGRShadeSrcParam): GPUShaderModule {
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
		// const device = this.mWGCtx.device;
		// let shdModule = params.shaderSrc
		// 	? device.createShaderModule({
		// 			label: "shd",
		// 			code: params.shaderSrc.code
		// 	  })
		// 	: null;
		// let vertShdModule = params.vertShaderSrc
		// 	? device.createShaderModule({
		// 			label: "vertShd",
		// 			code: params.vertShaderSrc.code
		// 	  })
		// 	: shdModule;
		// let fragShdModule = params.fragShaderSrc
		// 	? device.createShaderModule({
		// 			label: "fragShd",
		// 			code: params.fragShaderSrc.code
		// 	  })
		// 	: shdModule;

		let shdModule = params.shaderSrc ? this.createShaderModule("Shader", params.shaderSrc) : null;
		let vertShdModule = params.vertShaderSrc ? this.createShaderModule("VertShader", params.vertShaderSrc) : shdModule;
		let fragShdModule = params.fragShaderSrc ? this.createShaderModule("FragShader", params.fragShaderSrc) : shdModule;
		let compShdModule = params.compShaderSrc ? this.createShaderModule("CompShader", params.compShaderSrc) : shdModule;

		const vert = params.vertex;
		vert.module = vertShdModule;
		if (params.vertShaderSrc.vertEntryPoint) {
			vert.entryPoint = params.vertShaderSrc.vertEntryPoint;
		}

		const frag = params.fragment;
		if (frag) {
			frag.module = fragShdModule;
			if (params.fragShaderSrc.fragEntryPoint) {
				frag.entryPoint = params.fragShaderSrc.fragEntryPoint;
			}
		}
	}
}
export { WGRPipelineShader };

import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRPipelineCtxParams } from "./WGRPipelineCtxParams";

class WGRPipelineShader {
	private mWGCtx: WebGPUContext;
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
	build(params: WGRPipelineCtxParams): void {
		const device = this.mWGCtx.device;

		let shdModule = params.shaderSrc
			? device.createShaderModule({
					label: "shd",
					code: params.shaderSrc.code
			  })
			: null;
		let vertShdModule = params.vertShaderSrc
			? device.createShaderModule({
					label: "vertShd",
					code: params.vertShaderSrc.code
			  })
			: shdModule;
		let fragShdModule = params.fragShaderSrc
			? device.createShaderModule({
					label: "fragShd",
					code: params.fragShaderSrc.code
			  })
			: shdModule;

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

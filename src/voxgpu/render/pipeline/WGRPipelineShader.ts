import { GPUFragmentState } from "../../gpu/GPUFragmentState";
import { GPUShaderModule } from "../../gpu/GPUShaderModule";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRBufferData } from "../buffer/WGRBufferData";
import { WGRBufferValue } from "../buffer/WGRBufferValue";
import { WGRTexLayoutParam } from "../uniform/IWGRUniformContext";
import { WGRShadeSrcParam, WGRPipelineCtxParams } from "./WGRPipelineCtxParams";
import { WGRShderSrcType, findShaderEntryPoint, createFragmentState, createComputeState } from "./WGRShaderParams";
import { WGRendererPassImpl } from "./WGRendererPassImpl";
import { getCodeLine, codeLineCommentTest } from "../../material/shader/utils";

const bufValue = new WGRBufferValue({ shdVarName: 'mpl-bufValue' });
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

	private shaderCodeCorrect(shdSrc: WGRShderSrcType, uvalues: WGRBufferData[], utexes: WGRTexLayoutParam[]): WGRShderSrcType {
		let shd = shdSrc.shaderSrc;
		if (shd) {

			let code = shd.code;
			let bi = code.indexOf('@binding(');
			for (let i = 0; i < 30; ++i) {
				if (bi >= 0) {
					let codeLine = getCodeLine(code, bi);
					if (!codeLineCommentTest(codeLine)) {
						break;
					}
				} else {
					break;
				}
			}
			if (bi >= 0) {
				let begin = code.indexOf('@group(');
				let end = code.lastIndexOf(' @binding(');
				end = code.indexOf(';', end + 1);
				code = code.slice(0, begin) + code.slice(end + 1);
				// console.log('oooooooooo begin, end: ', begin, end);
			}
			// console.log('oooooooooo uvalues: ', uvalues);
			// console.log('oooooooooo utexes: ', utexes);
			// console.log('oooooooooo code: ', code);
			// console.log(`code.indexOf('@binding(') < 0: `, code.indexOf('@binding(') < 0);
			if (bi < 0) {
				let codeStr = '';
				let index = 0;
				if (uvalues && uvalues.length > 0) {
					// @group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
					for (let i = 0; i < uvalues.length; ++i) {
						bufValue.usage = uvalues[i].usage;
						let varType = bufValue.isStorage() ? 'storage' : 'uniform';
						let str = `@group(0) @binding(${index++}) var<${varType}> ${uvalues[i].shdVarName} : ${uvalues[i].shdVarFormat};\n`;
						codeStr += str;
					}
				}
				if (utexes && utexes.length > 0) {
					// console.log('utexes: ', utexes);
					for (let i = 0; i < utexes.length; ++i) {
						let tex = utexes[i];
						let varType = 'texture_2d';
						switch (tex.viewDimension) {
							case 'cube':
								varType = 'texture_cube';
								break;
							default:
								break;
						}
						let str = `@group(0) @binding(${index++}) var ${tex.shdVarName}Sampler: sampler;\n`;
						str += `@group(0) @binding(${index++}) var ${tex.shdVarName}Texture: ${varType}<f32>;\n`;
						codeStr += str;
					}
				}
				// console.log("shaderCodeCorrect(), codeStr:");
				// console.log(codeStr);
				if (codeStr !== '') {
					// codeStr = codeStr + code;
					// let shaderSrc = {
					//     // shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
					//     shaderSrc: { code: codeStr, uuid: shd.uuid },
					//     // shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
					// };
					// // console.log("shaderCodeCorrect() VVVVVVVVVVVVVVVVVVVVVVVV, codeStr: ");
					// // console.log( codeStr );
					// return shaderSrc;
					shd.code = codeStr + code;
				}
			}
		}
		return shdSrc;
	}
	private createShaderModule(type: string, param: WGRShadeSrcParam): GPUShaderModule {
		if (param) {
			const device = this.mWGCtx.device;
			if (param.uuid && param.uuid !== "") {
				let uuid = param.moduleKey !== undefined ? param.uuid + "-" + param.moduleKey : param.uuid;
				const ns = uuid + "-" + type;
				const map = this.mShdModuleMap;
				if (map.has(ns)) {
					console.log("WGRPipelineShader::createShaderModule(), use old shader module ...");
					console.log("				ns: ", ns);
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

	build(params: WGRPipelineCtxParams, rpass: WGRendererPassImpl): void {
		// console.log("vvv params.shaderSrc: ", params.shaderSrc);

		let shdModule: GPUShaderModule;
		let vertShdModule: GPUShaderModule;
		let fragShdModule: GPUShaderModule;
		let compShdModule: GPUShaderModule;

		let shd = params.shaderSrc;
		if (shd && (shd.uvalues !== undefined || shd.utexes !== undefined)) {
			const map = this.mShdModuleMap;
			const type = "Shader";
			let uuid = shd.moduleKey !== undefined ? shd.uuid + "$" + shd.moduleKey : shd.uuid;
			const ns = uuid + "-" + type;
			if (map.has(ns)) {
				console.log("WGRPipelineShader::build(), use old shader module ...");
				console.log("				ns: ", ns);
				shdModule = map.get(ns);
			} else {
				console.log("WGRPipelineShader::build(), create new shader module ...");
				console.log("vvv shd ns: ", ns);
				// console.log("vvv shd: ", shd);
				if(shd.code === '' && shd.coder !== undefined) {
					shd.code = shd.coder.build(shd.predefine !== undefined ? shd.predefine : "");
				}
				this.shaderCodeCorrect(params, shd.uvalues, shd.utexes);
				shdModule = this.createShaderModule(type, shd);
			}
		} else {
			shdModule = params.shaderSrc ? this.createShaderModule("Shader", params.shaderSrc) : null;
		}
		vertShdModule = params.vertShaderSrc ? this.createShaderModule("VertShader", params.vertShaderSrc) : shdModule;
		fragShdModule = params.fragShaderSrc ? this.createShaderModule("FragShader", params.fragShaderSrc) : shdModule;
		compShdModule = params.compShaderSrc ? this.createShaderModule("CompShader", params.compShaderSrc) : shdModule;

		let entryPoint = "";
		const vert = params.vertex;
		let shdSrc = params.shaderSrc ? params.shaderSrc : params.vertShaderSrc;
		if (shdSrc) {
			entryPoint = shdSrc.vertEntryPoint !== undefined ? shdSrc.vertEntryPoint : findShaderEntryPoint('@vertex', shdSrc.code);
			if (entryPoint !== '') {
				vert.module = vertShdModule;
				vert.entryPoint = entryPoint;
			}
		} else {
			params.vertex = null;
		}

		let frag = params.fragment;
		shdSrc = params.shaderSrc ? params.shaderSrc : params.fragShaderSrc;
		if (shdSrc) {
			entryPoint = shdSrc.fragEntryPoint !== undefined ? shdSrc.fragEntryPoint : findShaderEntryPoint('@fragment', shdSrc.code);
			if (entryPoint !== '') {
				if (!frag) {
					frag = params.fragment = createFragmentState();
				}
				frag.module = fragShdModule;
				frag.entryPoint = entryPoint;
			}
			this.checkFrag(frag, rpass);
		} else {
			params.fragment = null;
		}
		shdSrc = params.compShaderSrc;
		if (shdSrc && compShdModule) {
			shdSrc = params.compShaderSrc;
			params.compute = createComputeState(compShdModule);
			if (shdSrc.compEntryPoint !== undefined) {
				params.compute.entryPoint = shdSrc.compEntryPoint;
			} else {
				shdSrc.compEntryPoint = params.compute.entryPoint = findShaderEntryPoint('@compute', shdSrc.code);
			}
		} else if (compShdModule) {
			shdSrc = params.shaderSrc;
			entryPoint = findShaderEntryPoint('@compute', shdSrc.code);
			if (entryPoint != '') {
				params.compute = createComputeState(compShdModule);
				params.compute.entryPoint = entryPoint;
			}
		}
	}
	private checkFrag(frag: GPUFragmentState, rpass: WGRendererPassImpl): void {
		if (frag) {
			let cs = rpass.passColors;
			let ts = frag.targets;
			for (let i = 0; i < cs.length; ++i) {
				// console.log('checkFrag(), textureFormat: ', cs[i].textureFormat);
				// console.log('checkFrag(), AAA, textureFormat: ', cs[i].textureFormat, ', target format: ', ts[i].format);
				if (ts.length > i) {
					ts[i].format = cs[i].textureFormat;
				} else {
					ts.push({ format: cs[i].textureFormat });
				}
				// console.log('checkFrag(), textureFormat: ', cs[i].textureFormat, ', target format: ', ts[i].format);
			}
		}
	}
}
export { WGRPipelineShader };

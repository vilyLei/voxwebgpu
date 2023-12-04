import shaderSrcCode from "./shadow/shadowReceive2.wgsl";
import { WGShaderPredefine } from "./WGShaderPredefine";

import matrixWGSL from "./include/matrix.wgsl";
import vsmShadowHeadWGSL from "./include/vsmShadowHead.wgsl";

const shdSrcModules: Map<string, string> = new Map();
function initModules() {
	shdSrcModules.set("matrix", matrixWGSL);
	shdSrcModules.set("vsmShadowHead", vsmShadowHeadWGSL);
}
initModules();
class ShadowReceiveShdCtor {
	private moduleNames: string[] = [];
	readonly predefine = new WGShaderPredefine();
	constructor() { }
	reset(): void {
		this.predefine.reset();
	}

	build(predefine: string): string {

		// const preDef = this.predefine;
		// preDef.parsePredefineVar(predefine);

		console.log("ShadowReceiveShdCtor::build() ...");

		let shdWGSL = shaderSrcCode;
		
		shdWGSL = this.parseInclude(shdWGSL);
		// console.log("\n###### predefine:");
		// console.log(predefine);
		// console.log("\n###### shdWGSL:");
		// console.log(shdWGSL);
		return shdWGSL;
	}
	parseInclude(src: string): string {
		// 第一步, 去除注释, 然后再接着处理(或者想法子越过注释)
		let dst = src;
		let keyStr = "#include ";
		let index = src.indexOf(keyStr);

		const moduleNames = this.moduleNames;

		for (; index >= 0;) {
			let begin = dst.indexOf("<", index + 1);
			let end = dst.indexOf(">", begin + 1);
			// console.log("parseInclude(), begin, end: ", begin, end);
			if (end > 0) {
				let moduleName = dst.slice(begin + 1, end).trim();
				// console.log("parseInclude(), moduleName: ", moduleName);
				let includeCmd = dst.slice(index, end + 1);
				// 同一个代码块不用载入两次
				if (moduleNames.includes(moduleName)) {
					dst = dst.replace(includeCmd, `\n\r`);
					end = index + 1;
				} else {
					moduleNames.push(moduleName);
					let moduleCode = shdSrcModules.get(moduleName);
					// console.log("parseInclude(), includeCmd: ", includeCmd);
					dst = dst.replace(includeCmd, `\n\r${moduleCode}\n\r`);
				}
				// console.log('parseInclude(), dst:');
				// console.log(dst);
				index = dst.indexOf(keyStr, end);
			} else {
				break;
			}
		}
		return dst;
	}
}
export { ShadowReceiveShdCtor };

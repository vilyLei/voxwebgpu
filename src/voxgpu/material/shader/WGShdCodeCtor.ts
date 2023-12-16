
import { WGShaderPredefine } from "./WGShaderPredefine";
import { getCodeLine, codeLineCommentTest } from "./utils";
import { WGShdCodeCtorImpl } from "./WGShdCodeCtorImpl";

class WGShdCodeCtor implements WGShdCodeCtorImpl {
	
	readonly predefine = new WGShaderPredefine();
	protected moduleNames: string[] = [];
	codeModules: Map<string, string>;
	constructor() { }
	reset(): void {
		this.moduleNames = [];
		this.predefine.reset();
	}
	destroy(): void {
		this.codeModules = null;
	}
	build(predefine: string): string {
		return '';
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
				let codeLine = getCodeLine(dst, begin + 1);
				if (codeLineCommentTest(codeLine)) {
					index = end + 1;
					continue;
				}
				let moduleName = dst.slice(begin + 1, end).trim();
				// console.log("parseInclude(), moduleName: ", moduleName);
				let includeCmd = dst.slice(index, end + 1);
				// 同一个代码块不用载入两次
				if (moduleNames.includes(moduleName)) {
					dst = dst.replace(includeCmd, `\n\r`);
					end = index + 1;
				} else {
					moduleNames.push(moduleName);
					let moduleCode = this.codeModules.get(moduleName);
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
export { WGShdCodeCtor };

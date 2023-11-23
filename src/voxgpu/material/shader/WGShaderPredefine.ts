import { getCodeLine, codeLineCommentTest } from "./utils";

class PreDefItem {
	name = "";
	value?: number;
	constructor(name: string, value?: number) {
		this.name = name;
		this.value = value;
	}
	hasValue(): boolean {
		return this.value !== undefined;
	}
}
class WGShaderPredefine {
	private preVarDict: Map<string, PreDefItem> = new Map();
	constructor() { }
	reset(): void {
		this.preVarDict.clear();
	}
	hasDefine(ns: string): boolean {
		return this.preVarDict.has(ns);
	}
	hasDefineValue(ns: string): boolean {
		if (this.preVarDict.has(ns)) {
			return this.preVarDict.get(ns).hasValue();
		}
		return false;
	}
	getDefine(ns: string): PreDefItem {
		let item: PreDefItem;
		if (this.preVarDict.has(ns)) {
			return this.preVarDict.get(ns);
		}
		return item;
	}
	parsePredefineVar(src: string): void {
		let keyStr = "#define ";

		// 第一步, 去除注释, 然后再接着处理

		let index = src.indexOf(keyStr);
		for (; index >= 0;) {
			let begin = src.indexOf(" ", index + 1);
			let end0 = src.indexOf(" ", begin + 1);
			if (end0 < 0) {
				end0 = src.length;
			}
			let end1 = src.indexOf(`\n`, begin + 1);
			if (end1 < 0) {
				end1 = src.length;
			}
			let end = Math.min(end0, end1);
			// console.log("WGShaderPredefine::parsePredefineVar(), begin, end: ", begin, end);
			if (end > 0 && end > begin) {
				let defineName = src.slice(begin + 1, end).trim();
				let codeLine = getCodeLine(src, begin + 1);
				if (!codeLineCommentTest(codeLine)) {
					if (end0 < end1) {
						let defineValue = Number(src.slice(end0 + 1, end1).trim());
						console.log("WGShaderPredefine::parsePredefineVar(), defineName: ", defineName, ", defineValue: ", defineValue);
						this.preVarDict.set(defineName, new PreDefItem(defineName, defineValue));
						let pstr = src.slice(index, end1);
						// console.log("AAAAA pstr: ", pstr);
						let regex = new RegExp(pstr, "g");
						src = src.replace(regex, "");
					} else {
						console.log("WGShaderPredefine::parsePredefineVar(), defineName: ", defineName);
						this.preVarDict.set(defineName, new PreDefItem(defineName));
						let pstr = src.slice(index, end);
						let regex = new RegExp(pstr, "g");
						src = src.replace(regex, "");
						// console.log("BBBBB pstr: ", pstr,'>>>>>>');
					}

					// console.log("A TTTTTTTTTT src: ", src);
					index = src.indexOf(keyStr, index + 1);
				} else {
					// console.log("B TTTTTTTTTT src: ", src);
					index = src.indexOf(keyStr, end);
				}
			} else {
				break;
			}
		}
		// console.log("end TTTTTTTTTT src: ", src);
	}

	applyPredefine(src: string): string {
		let keyDef = "#if";
		// let keyDef = "#ifdef";
		let keyEndDef = "#endif";
		let index = src.indexOf(keyDef);
		for (; index >= 0;) {
			let end = src.indexOf(keyEndDef, index + 1);
			console.log(">>> $$$ AAA index: ", index, ', end: ', end);
			if (index < end) {
				let endI = end + keyEndDef.length;
				let codeLine = getCodeLine(src, index);//src.slice(index, endI);
				let flag = codeLineCommentTest(codeLine);
				console.log("isCommentLine flag: ", flag);
				if (!flag) {
					let chunk = this.parseChunk(src.slice(index, endI));
					src = src.slice(0, index) + chunk + src.slice(endI);
				}
				index = src.indexOf(keyDef, index + 1);
				console.log(">>> $$$ BBB index: ", index);
			} else {
				break;
			}
		}
		return src;
	}
	private parseChunk(src: string): string {
		let keyDef = "#if";
		// let keyDef = "#ifdef";
		let keyEndDef = "#endif";
		let keyElse = "#else";

		console.log('parseChunk() ############### XXXXXXXXXXXXX');
		console.log("parseChunk(), src: ");
		console.log(src);
		let defName = this.getChunkDefName(src);
		let flag = this.hasDefine(defName);
		console.log("parseChunk(), defName: ", defName, ', flag: ', flag);
		// if (this.hasDefine(defName)) {

		// const varDict = this.preVarDict;

		let index = src.indexOf(keyDef);
		let elseIndex = src.indexOf(keyElse, index + 1);
		let endIndex = src.indexOf(keyEndDef, index + 1);
		let end = endIndex;
		let defFlag = this.hasDefine(defName);
		if (defFlag) {
			index = src.indexOf(`\n`, index + 1);
			end = elseIndex > 0 ? elseIndex : endIndex;
		} else {
			index = elseIndex > 0 ? src.indexOf(`\n`, elseIndex + 1) : src.indexOf(`\n`, index + 1);
		}
		if (elseIndex > 0 || defFlag) {
			src = `\n${src.slice(index, end)}\n`;
		} else {
			src = `\n`;
		}
		// src = `\n${src.slice(index, end)}\n`;
		// }else {
		// 	src = `\n`;
		// }

		console.log('parseChunk() end, src: ', src);
		return src;
	}
	private getChunkDefName(src: string): string {
		// let keyDef = "#ifdef";
		let index = 0;
		let begin = src.indexOf(" ", index + 1);
		let end0 = src.indexOf(" ", begin + 1);
		if (end0 < 0) {
			end0 = src.length;
		}
		let end1 = src.indexOf(`\n`, begin + 1);
		if (end1 < 0) {
			end1 = src.length;
		}
		let end = Math.min(end0, end1);
		let defineName = src.slice(begin + 1, end).trim();
		return defineName;
	}
}
export { WGShaderPredefine };

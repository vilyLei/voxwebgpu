import { ShdPredefinTracer } from "./ShdPredefinTracer";
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
	private defTracer = new ShdPredefinTracer();
	constructor() { }
	reset(): void {
		this.preVarDict.clear();
	}
	getDefItem(ns: string): PreDefItem {
		return this.preVarDict.get(ns);
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
						// console.log("WGShaderPredefine::parsePredefineVar(), defineName: ", defineName, ", defineValue: ", defineValue);
						this.preVarDict.set(defineName, new PreDefItem(defineName, defineValue));
						let pstr = src.slice(index, end1);
						// console.log("AAAAA pstr: ", pstr);
						let regex = new RegExp(pstr, "g");
						src = src.replace(regex, "");
					} else {
						// console.log("WGShaderPredefine::parsePredefineVar(), defineName: ", defineName);
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
			// console.log(">>> $$$ AAA index: ", index, ', end: ', end);
			if (index < end) {
				let endI = end + keyEndDef.length;
				let codeLine = getCodeLine(src, index);
				let flag = codeLineCommentTest(codeLine);
				// console.log("isCommentLine flag: ", flag);
				if (!flag) {
					
					// test #if string between the index and endI
					let k = src.indexOf(keyDef, index + keyDef.length);
					if (k > 0 && k < endI) {
						let tracer = this.defTracer;
						let obj = tracer.applyPredefine(src, index);
						// let defName = this.getChunkDefName(src);
						// let flag = this.hasDefine(defName);
						// if(obj.elseI > 0) {
						// }else {
						// }
						let chunk = this.parseChunk("", obj);
						src = src.slice(0, index) + chunk + src.slice(obj.posEndI);
						// index = obj.endI;
						// for test
						// return src;
					}else{
						let chunk = this.parseChunk(src.slice(index, endI));
						src = src.slice(0, index) + chunk + src.slice(endI);
					}
				}
				index = src.indexOf(keyDef, index + 1);
				// console.log(">>> $$$ BBB index: ", index);
			} else {
				break;
			}
		}
		return src;
	}
	private parseChunk(src: string, param?: { src: string, elseI: number, posEndI: number }): string {
		let keyDef = "#if";
		// let keyDef = "#ifdef";
		let keyEndDef = "#endif";
		let keyElse = "#else";
		if(param) {
			src = param.src;
		}
		// console.log('parseChunk() ############### XXXXXXXXXXXXX');
		// console.log("parseChunk(), src: ");
		// console.log(src);

		let defNames = this.getChunkDefNames(src);
		let defFlag = this.hasDefine(defNames[1]);
		// console.log("parseChunk(), defNames: ", defNames, ', defFlag: ', defFlag);
		if(defNames[0] === '#ifndef') {
			defFlag = !defFlag;
		}

		// let defFlag = this.checkDefNames( src );

		// if(param) {
		// 	console.log("parseChunk(), param.elseI, param.endI: ", param.elseI);
		// }
		// if (this.hasDefine(defName)) {

		// const varDict = this.preVarDict;

		let index = param ? 0 : src.indexOf(keyDef);
		let elseIndex = param ? param.elseI - keyElse.length : src.indexOf(keyElse, index + 1);
		let endIndex = param ? src.length - keyEndDef.length : src.indexOf(keyEndDef, index + 1);
		let end = endIndex;
		// let defFlag = this.hasDefine(defNames[1]);
		if (defFlag) {
			index = src.indexOf(`\n`, index + 1);
			end = elseIndex > 0 ? elseIndex: endIndex;
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

		// console.log('parseChunk() end, src: ', src);
		return src;
	}
	// private parseOpCode(value: number, operator: string): boolean {
	// }
	private checkDefNames(src: string): boolean {
		let defNames = this.getChunkDefNames(src);
		let defOp = defNames[0];
		let ns = defNames[1];
		let defFlag = this.hasDefine(ns);
		// console.log("checkDefNames(), defNames: ", defNames, ', defFlag: ', defFlag);
		if( defFlag ) {
			switch(defOp) {
				case '#ifndef':
					defFlag = !defFlag;
					break;
				case '#if':
					let defItem = this.getDefItem(ns);
					// let value = Number(defItem.value);
					var opsFlag = false;
					// console.log("checkDefNames(), A opsFlag: ", opsFlag);
					let opsStr = 'opsFlag = ' + defItem.value + ' '+ defNames[2] + ' ' + defNames[3] + ';';
					eval(opsStr);
					// console.log("checkDefNames(), opsStr: ", opsStr);
					// console.log("checkDefNames(), B opsFlag: ", opsFlag);
					defFlag = opsFlag;
					break;
				default:
					break;
			}
		}else {
			if(defOp === '#ifndef') {
				defFlag = !defFlag;
			}
		}
		return defFlag;
	}
	private getChunkDefNames(src: string): string[] {
		
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
		let end2 = src.indexOf(`//`, begin + 1);
		if(end2 > 0 && end2 < end1) {
			end1 = end2;
		}

		let lineStr = src.slice(index, end1);
		console.log(">>> lineStr: ", lineStr);
		// let end = Math.min(end0, end1);
		// let defineName = src.slice(begin + 1, end).trim();
		// return [src.slice(index, begin).trim(), defineName];
		return lineStr.split(' ');
	}
}
export { WGShaderPredefine };

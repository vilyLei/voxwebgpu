import { getCodeLine, codeLineCommentTest } from "./utils";


class ShdPredefinTracer {
	constructor() { }
	applyPredefine(src: string, index: number): { src: string, elseI: number, posEndI: number } {
		let keyDef = "#if";
		let keyElseDef = "#else";
		let keyEndDef = "#endif";

		let tot_if = 0;
		let tot_elseif = 0;
		let elseI = -1;
		let posEndI = -1;
		let k = index;
		let k_if = 0;
		let k_else = 0;
		let k_end = 0;
		for (let i = 0; i < 50; ++i) {

			k_if = src.indexOf(keyDef, k);
			k_else = src.indexOf(keyElseDef, k);
			k_end = src.indexOf(keyEndDef, k);
			
			// console.log("VVVVVV k_if, k_else, k_end: ", k_if, k_else, k_end);
			k = -1;
			if (k_if >= 0) {
				let codeLine = getCodeLine(src, k_if);
				// console.log('找到对应的 #if');
				// console.log("VVVVVV strs: ", codeLine);
				let flag = codeLineCommentTest(codeLine);
				if (!flag) {
					k = k_if;
				}
			}
			if (k_else > 0) {
				let codeLine = getCodeLine(src, k_else);
				let flag = codeLineCommentTest(codeLine);
				if (!flag) {
					// if(k_if === 595) {
					// 	console.log(">>>>>>>>>> k, k_else: ", k, k_else, ", A Math.min(k, k_else): ", Math.min(k, k_else));
					// }
					k = k < 0 ? k_else : Math.min(k, k_else);
					// if(k_if === 595) {
					// 	console.log(">>>>>>>>>> k, k_else: ", k, k_else, ", B ", (k === k_else));
					// }
				}
			}
			if (k_end > 0) {
				let codeLine = getCodeLine(src, k_end);
				let flag = codeLineCommentTest(codeLine);
				if (!flag) {
					k = k < 0 ? k_end : Math.min(k, k_end);
				}
			}
			if (k > 0) {
				if(k === k_if) {
					tot_if++;
					tot_elseif++;
				}else if(k === k_else) {
					tot_elseif--;
					// console.log('遇到 #else, tot_elseif: ', tot_elseif);
					if (tot_elseif < 1) {
						// let codeLine = getCodeLine(src, k_else);
						// console.log("VVVVVV strs: ", codeLine);
						elseI = k_else + keyElseDef.length;
					}
				}else if(k === k_end) {
					tot_if--;
					// console.log('遇到 #endif, tot_if: ', tot_if);
					if (tot_if < 1) {
						// console.log('找到对应的 #endif');
						// let codeLine = getCodeLine(src, k_end);
						// console.log("VVVVVV strs: ", codeLine);
						posEndI = k_end + keyEndDef.length;
						break;
					}
				}
				k += keyDef.length;
			} else {
				break;
			}
		}
		// console.log('############# find, elseI, endI: ', elseI, posEndI);
		src = src.slice(index, posEndI);
		elseI -= index;
		return { src, elseI, posEndI };
	}
}
export { ShdPredefinTracer };

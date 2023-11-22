export function getCodeLine(str: string, pos: number): string {
	let a = str.lastIndexOf(`\n`, pos);
	let b = str.indexOf(`\n`, pos);
	return str.slice(a, b);
}
export function codeLineCommentTest(str: string): boolean {
	let flagIndex = str.indexOf(`//`);
	// console.log('flagIndex A: ', flagIndex);
	if(flagIndex < 0) {
		return false;
	}
	// let index = 0;
	// flagIndex = str.indexOf(`//`, index);
	// console.log('flagIndex B: ', flagIndex);
	str = str.slice(0, flagIndex + 2).trim();
	// console.log('flagIndex C, str: ', str);
	// console.log('flagIndex D str.length: ', str.length);
	return str.length === 2;
}

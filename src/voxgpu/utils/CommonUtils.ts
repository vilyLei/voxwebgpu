function copyFromObjectValueWithKey(src: any, dst: any): void {
	for(var k in src) {
		if(src[k] != undefined) {
			dst[k] = src[k];
		}
	}
}
export {copyFromObjectValueWithKey}

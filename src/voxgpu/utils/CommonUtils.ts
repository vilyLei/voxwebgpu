function copyFromObjectValueWithKey(src: any, dst: any): void {
	for(var k in src) {
		dst[k] = src[k];
	}
}
export {copyFromObjectValueWithKey}
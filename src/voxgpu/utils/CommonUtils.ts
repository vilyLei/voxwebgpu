function copyFromObjectValueWithKey(src: any, dst: any): void {
	for(var k in src) {
		if(src[k] != undefined) {
			dst[k] = src[k];
		}
	}
}
function createIndexArrayWithSize(size: number): IndexArrayViewType {
	return size > 65536 ? new Uint32Array(size) : new Uint16Array(size);
}
function createIndexArray(array: IndexArrayDataType): IndexArrayViewType {
	return array.length > 65536 ? new Uint32Array(array) : new Uint16Array(array);
}
export {copyFromObjectValueWithKey, createIndexArrayWithSize, createIndexArray}

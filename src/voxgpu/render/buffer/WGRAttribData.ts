export class WGRAttribData {
	shdVarName = "";
	attrTypeName?: string;
	bindIndex = 0;
	strides = [3];
	/**
	 * buffer bytes offset
	 */
	bufferOffset = 0;
	dataUsage = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;
	dataVer = -3;
	private mData: NumberArrayViewType;
	set data(d: NumberArrayViewType) {
		this.mData = d;
		this.dataVer ++;
	}
	get data(): NumberArrayViewType {
		return this.mData;
	}
	update(): void {
		this.dataVer ++;
	}
}
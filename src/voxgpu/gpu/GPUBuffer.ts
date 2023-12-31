interface GPUBuffer {
	uid?: number;
	/**
	 * for example: 'uint16', 'uint32'
	 */
	dataFormat?: string;
	enabled?: boolean;
	shared?: boolean;
	/**
	 * for example: ['float32x4', 'float32x2']
	 */
	vectorFormats?: string[];
	vectorOffsets?: number[];
	vectorLengths?: number[];
	vectorCount?: number;
	/**
	 * If the value is 3, it is a vec3 type data
	 */
	arrayStride?: number;

	elementCount?: number;
	label?: string;
	mapState: string;

	segs?: {index: number, size: number}[];
	/**
	 * buffer size bytes total
	 */
	size: number;
	/**
	 * Bitwise flags value, come from GPUBufferUsage set.
	 */
	usage: number;

	unmap(): void;
	/**
	 * Returns an ArrayBuffer containing the mapped contents of the GPUBuffer in the specified range.
	 */
	getMappedRange(): ArrayBuffer;
	destroy(): void;
	/**
	 * @param mode Bitwise flags value, come from GPUMapMode set.
	 */
	mapAsync(mode: number, offset?:number, size?: number): any;
}
export { GPUBuffer };

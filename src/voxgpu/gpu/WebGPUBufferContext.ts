import { GPUBuffer } from "./GPUBuffer";
import { GPUBufferDescriptor } from "./GPUBufferDescriptor";
import { GPUQueue } from "./GPUQueue";
import { WebGPUContextImpl } from "./WebGPUContextImpl";

class WebGPUBufferContext {
	private static sVtxUid = 0;
	private mWGCtx: WebGPUContextImpl;
	private queue: GPUQueue;
	constructor(wgCtx?: WebGPUContextImpl) {
		if (wgCtx) {
			this.initialize(wgCtx);
		}
	}
	initialize(wgCtx: WebGPUContextImpl): void {
		if (!this.mWGCtx && wgCtx) {
			this.mWGCtx = wgCtx;
			this.queue = wgCtx.queue;
		}
	}

	createIndices(dataArray: number[]): Uint32Array | Uint16Array {
		if (dataArray.length <= 65536) {
			return new Uint16Array(dataArray);
		}
		return new Uint32Array(dataArray);
	}
	createIndicesWithSize(size: number): Uint32Array | Uint16Array {
		if (size <= 65536) {
			return new Uint16Array(size);
		}
		return new Uint32Array(size);
	}

	createIndexBuffer(data: IndexArrayViewType, offset = 0, mappedAtCreation = true): GPUBuffer {
		return this.createVtxBuffer(data, offset, GPUBufferUsage.INDEX, mappedAtCreation);
	}
	createVertexBuffer(data: NumberArrayViewType, offset = 0, vectorLengths?: number[], mappedAtCreation = true): GPUBuffer {
		return this.createVtxBuffer(data, offset, GPUBufferUsage.VERTEX, mappedAtCreation, vectorLengths);
	}

	createVtxBuffer(
		data: NumberArrayViewType,
		offset = 0,
		usage = GPUBufferUsage.VERTEX,
		mappedAtCreation = true,
		vectorLengths?: number[]
	): GPUBuffer {
		let size = data.byteLength % 4;
		// 如果不是4的倍数会报错
		size = data.byteLength + (size > 0 ? 4 - size : 0);
		// const buf = this.mWGCtx.device.createBuffer({
		// 	size: size,
		// 	usage: usage,
		// 	mappedAtCreation
		// });
		const buf = this.createBuffer({
			size: size,
			usage: usage,
			mappedAtCreation
		});

		if (mappedAtCreation) {
			const b = buf.getMappedRange();
			let eleBytes = 0;
			if (data instanceof Float32Array) {
				new Float32Array(b).set(data, offset);
				buf.dataFormat = "float32";
				eleBytes = 4;
			} else if (data instanceof Uint32Array) {
				new Uint32Array(b).set(data, offset);
				buf.dataFormat = "uint32";
				eleBytes = 4;
			} else if (data instanceof Uint16Array) {
				new Uint16Array(b).set(data, offset);
				buf.dataFormat = "uint16";
				eleBytes = 2;
			} else if (data instanceof Int32Array) {
				new Int32Array(b).set(data, offset);
				buf.dataFormat = "int32";
				eleBytes = 4;
			} else if (data instanceof Int16Array) {
				new Int16Array(b).set(data, offset);
				buf.dataFormat = "int16";
				eleBytes = 2;
			} else if (data instanceof Int8Array) {
				new Int8Array(b).set(data, offset);
				buf.dataFormat = "int8";
				eleBytes = 1;
			} else if (data instanceof Uint8Array) {
				new Uint8Array(b).set(data, offset);
				buf.dataFormat = "uint8";
				eleBytes = 1;
			} else {
				throw Error("Illegal data type, need: Float32Array | Uint32Array | Uint16Array  | Int32Array | Int16Array | Uint8Array | Int8Array");
			}
			buf.unmap();

			buf.elementCount = data.length;

			if (vectorLengths && vectorLengths.length > 0) {
				let arrayStride = 0;
				const offsets: number[] = new Array(vectorLengths.length);
				const formats: string[] = new Array(vectorLengths.length);
				for (let i = 0; i < formats.length; ++i) {
					offsets[i] = arrayStride;
					arrayStride += vectorLengths[i] * eleBytes;
					formats[i] = buf.dataFormat + "x" + vectorLengths[i];
				}
				buf.vectorOffsets = offsets;
				buf.vectorFormats = formats;
				buf.arrayStride = arrayStride;
				buf.vectorLengths = vectorLengths.slice();
				buf.vectorCount = buf.elementCount / vectorLengths[0];
			}
		}

		buf.enabled = true;
		buf.shared = false;
		buf.uid = WebGPUBufferContext.sVtxUid++;
		return buf;
	}
	createBuffer(desc: GPUBufferDescriptor): GPUBuffer {
		const buf = this.mWGCtx.device.createBuffer(desc);
		buf.uid = WebGPUBufferContext.sVtxUid++;
		return buf;
	}

	updateUniformBuffer(buffer: GPUBuffer, td: NumberArrayDataType, index: number, offset = 0): void {
		// console.log("WebGPUBufferContext::updateUniformBuffer() index: ", index,",segs: ", buffer.segs);
		// console.log("WebGPUBufferContext::updateUniformBuffer() buffer.size: ", buffer.size);
		// console.log("WebGPUBufferContext::updateUniformBuffer() buffer.segs[index].index + offset: ", buffer.segs[index].index + offset);
		// console.log("WebGPUBufferContext::updateUniformBuffer() td: ", td);
		this.queue.writeBuffer(buffer, buffer.segs[index].index + offset, td.buffer, td.byteOffset, td.byteLength);
	}
}
export { WebGPUBufferContext };

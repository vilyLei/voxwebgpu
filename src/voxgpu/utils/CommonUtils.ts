import { GPUTexture } from "../gpu/GPUTexture";

function copyFromObjectValueWithKey(src: any, dst: any): void {
	for (var k in src) {
		if (src[k] != undefined) {
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
/**
 * Determines the number of mip levels needed for a full mip chain given the width and height of texture level 0.
 *
 * @param {number} width of texture level 0.
 * @param {number} height of texture level 0.
 * @returns {number} Ideal number of mip levels.
 */
function calculateMipLevels(width: number, height: number): number {
	return Math.floor(Math.log2(Math.max(width, height))) + 1;
}
// thanks: http://stackoverflow.com/questions/32633585/how-do-you-convert-to-half-floats-in-javascript
// thanks: https://esdiscuss.org/topic/float16array
const toFloat16 = (function() {
	const floatView = new Float32Array(1);
	const int32View = new Int32Array(floatView.buffer);
	/* This method is faster than the OpenEXR implementation (very often
	 * used, eg. in Ogre), with the additional benefit of rounding, inspired
	 * by James Tursa?s half-precision code. */
	return function toHalf(val: number) {
		floatView[0] = val;
		let x = int32View[0];

		let bits = (x >> 16) & 0x8000; /* Get the sign */
		let m = (x >> 12) & 0x07ff; /* Keep one extra bit for rounding */
		let e = (x >> 23) & 0xff; /* Using int is faster here */

		/* If zero, or denormal, or exponent underflows too much for a denormal
		 * half, return signed zero. */
		if (e < 103) {
			return bits;
		}

		/* If NaN, return NaN. If Inf or exponent overflow, return Inf. */
		if (e > 142) {
			bits |= 0x7c00;
			/* If exponent was 0xff and one mantissa bit was set, it means NaN,
			 * not Inf, so make sure we set one mantissa bit too. */
			bits |= (e == 255 ? 0 : 1) && x & 0x007fffff;
			return bits;
		}

		/* If exponent underflows but not too much, return a denormal */
		if (e < 113) {
			m |= 0x0800;
			/* Extra rounding may overflow and set mantissa to 0 and exponent
			 * to 1, which is OK. */
			bits |= (m >> (114 - e)) + ((m >> (113 - e)) & 1);
			return bits;
		}

		bits |= ((e - 112) << 10) | (m >> 1);
		/* Extra rounding. An overflow will set mantissa to 0 and increment
		 * the exponent, which is OK. */
		bits += m & 1;
		return bits;
	};
})();

// webgpu hdr usage: https://stackoverflow.com/questions/77032862/load-hdr-10-bit-avif-image-into-a-rgba16float-texture-in-webgpu

function createSolidColorTexture(r: number, g: number, b: number, a: number): GPUTexture {
	let rc: any;
	let wgctx = rc.getWGCtx();
	const data = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
	const texture = wgctx.device.createTexture({
		size: { width: 1, height: 1 },
		format: "rgba8unorm",
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	});
	wgctx.device.queue.writeTexture({ texture }, data, {}, { width: 1, height: 1 });
	return texture;
}
function createFloatColorTexture(width: number, height: number): GPUTexture {
	let rc: any;
	let wgctx = rc.getWGCtx();

	let data = new Uint16Array(width * height * 4);
	let scale = 10.0;
	let k = 0;
	for (let i = 0; i < height; ++i) {
		for (let j = 0; j < width; ++j) {
			k = (width * i + j) * 4;
			data[k] = toFloat16(scale * (j / width));
			data[k + 1] = toFloat16(scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width))));
			data[k + 2] = toFloat16(scale * (1.0 - (i * j) / (width * height)));
			data[k + 3] = toFloat16(scale * 1.0);
		}
	}

	const texture = wgctx.device.createTexture({
		size: { width, height },
		format: "rgba16float",
		usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
	});
	wgctx.device.queue.writeTexture({ texture }, data, { bytesPerRow: width * 8, rowsPerImage: height }, { width, height });
	return texture;
}

export { calculateMipLevels, toFloat16, copyFromObjectValueWithKey, createIndexArrayWithSize, createIndexArray };

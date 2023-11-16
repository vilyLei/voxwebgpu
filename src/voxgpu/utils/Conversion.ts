import { assert } from './util';
import { clamp } from './math';
// thanks: https://github.com/vilyLei/cts/blob/main/src/webgpu/util/conversion.ts

/**
 * Encodes three JS `number` values into RGB9E5, returned as an integer-valued JS `number`.
 *
 * RGB9E5 represents three partial-precision floating-point numbers encoded into a single 32-bit
 * value all sharing the same 5-bit exponent.
 * There is no sign bit, and there is a shared 5-bit biased (15) exponent and a 9-bit
 * mantissa for each channel. The mantissa does NOT have an implicit leading "1.",
 * and instead has an implicit leading "0.".
 *
 * @see https://registry.khronos.org/OpenGL/extensions/EXT/EXT_texture_shared_exponent.txt
 */
export function packRGB9E5UFloat(r: number, g: number, b: number): number {
	const N = 9; // number of mantissa bits
	const Emax = 31; // max exponent
	const B = 15; // exponent bias
	const sharedexp_max = (((1 << N) - 1) / (1 << N)) * 2 ** (Emax - B);
	const red_c = clamp(r, { min: 0, max: sharedexp_max });
	const green_c = clamp(g, { min: 0, max: sharedexp_max });
	const blue_c = clamp(b, { min: 0, max: sharedexp_max });
	const max_c = Math.max(red_c, green_c, blue_c);
	const exp_shared_p = Math.max(-B - 1, Math.floor(Math.log2(max_c))) + 1 + B;
	const max_s = Math.floor(max_c / 2 ** (exp_shared_p - B - N) + 0.5);
	const exp_shared = max_s === 1 << N ? exp_shared_p + 1 : exp_shared_p;
	const scalar = 1 / 2 ** (exp_shared - B - N);
	const red_s = Math.floor(red_c * scalar + 0.5);
	const green_s = Math.floor(green_c * scalar + 0.5);
	const blue_s = Math.floor(blue_c * scalar + 0.5);
	assert(red_s >= 0 && red_s <= 0b111111111);
	assert(green_s >= 0 && green_s <= 0b111111111);
	assert(blue_s >= 0 && blue_s <= 0b111111111);
	assert(exp_shared >= 0 && exp_shared <= 0b11111);
	return ((exp_shared << 27) | (blue_s << 18) | (green_s << 9) | red_s) >>> 0;
  }

import { assert } from './util';
/** Clamp a number to the provided range. */
export function clamp(n: number, { min, max }: { min: number; max: number }): number {
	assert(max >= min);
	return Math.min(Math.max(n, min), max);
  }

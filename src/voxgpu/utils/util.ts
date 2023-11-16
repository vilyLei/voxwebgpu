/**
 * Asserts `condition` is true. Otherwise, throws an `Error` with the provided message.
 */
export function assert(condition: boolean, msg?: string | (() => string)): asserts condition {
	if (!condition) {
		throw new Error(msg && (typeof msg === "string" ? msg : msg()));
	}
}

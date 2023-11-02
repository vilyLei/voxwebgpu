import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WebGPUContextImpl } from "../../gpu/WebGPUContextImpl";

/**
 * 用于统一的gpu端buf资源管理
 */
class WGHBufferStoreIns {
	private mBufMap: Map<number, GPUBuffer> = new Map();
	addWithUid(uid: number, buf: GPUBuffer): void {
		if (buf) {
			const map = this.mBufMap;
			if (!map.has(uid)) {
				map.set(uid, buf);
			}
		}
	}
	removeWithUid(uid: number): void {
		const map = this.mBufMap;
		if (map.has(uid)) {
			map.delete(uid);
		}
	}
	getWithUid(uid: number): GPUBuffer {
		return this.mBufMap.get(uid);
	}
	hasWithUid(uid: number): boolean {
		const map = this.mBufMap;
		return map.has(uid);
	}
}
class WGHBufferStore {
	private static sStores: WGHBufferStoreIns[] = new Array(1024);

	static getStore(ctx: WebGPUContextImpl): WGHBufferStoreIns {
		const i = ctx.getUid();
		const sts = WGHBufferStore.sStores;
		if (!sts[i]) {
			sts[i] = new WGHBufferStoreIns();
		}
		return sts[i];
	}
}
export { WGHBufferStore };

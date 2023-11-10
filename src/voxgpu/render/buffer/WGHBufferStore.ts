import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WebGPUContextImpl } from "../../gpu/WebGPUContextImpl";
import { WGRBufferData } from "./WGRBufferData";

/**
 * 用于统一的gpu端buf资源管理
 * WGH(Web GPU Hardware)
 */
class WGHBufferStoreIns {
	private mBufMap: Map<number, WGRBufferData> = new Map();
	addWithUid(uid: number, buf: WGRBufferData): void {
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
	getWithUid(uid: number): WGRBufferData {
		return this.mBufMap.get(uid);
	}
	getBufWithUid(uid: number): GPUBuffer {
		if(this.mBufMap.has(uid)) {
			return this.mBufMap.get(uid).buffer;
		}
		return null;
	}
	hasWithUid(uid: number): boolean {
		const map = this.mBufMap;
		return map.has(uid);
	}
}
class WGHBufferStore {
	private static sStores: WGHBufferStoreIns[] = new Array(1024);

	static getStore(ctx: WebGPUContextImpl): WGHBufferStoreIns {
		const i = ctx.uid;
		const sts = WGHBufferStore.sStores;
		if (!sts[i]) {
			sts[i] = new WGHBufferStoreIns();
		}
		return sts[i];
	}
}
export { WGHBufferStore };

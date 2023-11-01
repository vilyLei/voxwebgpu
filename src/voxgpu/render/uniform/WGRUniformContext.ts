import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { WGRUniform } from "./WGRUniform";
import { BufDataParamType, IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";
import { WGRUniformValue } from "./WGRUniformValue";
import { WGRUniformParam, WGRUniformTexParam, WGRUniformWrapper, IWGRUniformContext } from "./IWGRUniformContext";

class UCtxInstance {
	private static sUid = 0;
	private mUid = UCtxInstance.sUid++;

	private mList: WGRUniformWrapper[] = [];
	private mPipelineCtx: IWGRPipelineContext | null = null;
	private mBuffers: GPUBuffer[] = [];
	private mFreeIds: number[] = [];
	constructor() {}

	private getFreeIndex(): number {
		if (this.mFreeIds.length > 0) return this.mFreeIds.pop();
		return -1;
	}
	initialize(pipelineCtx: IWGRPipelineContext | null): void {
		this.mPipelineCtx = pipelineCtx;
	}
	isEnabled(): boolean {
		return this.mBuffers.length > 0;
	}
	runBegin(): void {
		// console.log("UCtxInstance::runBegin(), XXX XXX runBegin(), this.isEnabled(): ", this.isEnabled());
		if (this.mBuffers.length < 1) {
			let ls = this.mList;
			console.log("UCtxInstance::runBegin(), XXX XXX runBegin(), this.mList.length: ", this.mList.length);
			if (ls.length > 0) {
				this.mBuffers = [];
				let wp = ls[0];

				if (wp.bufDataParams) {
					// console.log("XXX XXX wp.bufDataParams: ", wp.bufDataParams);

					for (let i = 0; i < wp.bufDataParams.length; ++i) {
						const uniformParams = { sizes: new Array(ls.length), usage: wp.bufDataParams[i].usage };

						for (let j = 0; j < ls.length; ++j) {
							uniformParams.sizes[j] = ls[j].bufDataParams[i].size;
						}
						console.log("XXX XXX uniformParams.sizes: ", uniformParams.sizes);
						const buffer = this.mPipelineCtx.createUniformsBuffer(uniformParams);
						this.mBuffers.push(buffer);
					}
				}
				// console.log("XXX XXX this.mBuffers: ", this.mBuffers);
				// console.log("XXX XXX ls: ", ls);
				for (let i = 0; i < ls.length; ++i) {
					wp = ls[i];
					this.createUniformWithWP(wp, i);
				}
				// console.log("UCtxInstance::runBegin(), this.mList: ", this.mList);
			}
		}
	}
	private static sBindGroupIndex = 0
	private createUniformWithWP(wp: WGRUniformWrapper, index: number): void {
		// console.log("createUniformWithWP(), wp.groupIndex: ", wp.groupIndex);
		const uf = wp.uniform;
		if (uf && !uf.bindGroup) {
			uf.buffers = this.mBuffers;
			uf.versions = new Array(uf.buffers.length);
			uf.versions.fill(-1);
			if (wp.bufDataParams) {
				if (!wp.bufDataDescs) {
					const dataParams = [];
					for (let j = 0; j < wp.bufDataParams.length; ++j) {
						dataParams.push({ index: index, buffer: uf.buffers[j], bufferSize: wp.bufDataParams[j].size });
					}
					wp.bufDataDescs = dataParams;
				}
				uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, wp.bufDataDescs, wp.texParams);
			} else {
				uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, null, wp.texParams);
			}
			uf.bindGroup.index = UCtxInstance.sBindGroupIndex++;
			console.log("XXX XXX createUniformWithWP(), create a bindGroup.");
			uf.__$$updateSubUniforms();
		}
	}
	runEnd(): void {}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: BufDataParamType[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[]
	): WGRUniform {
		if (!((bufDataParams && bufDataParams.length) || (texParams && texParams.length))) {
			throw Error("Illegal operation !!!");
		}
		const index = this.getFreeIndex();
		console.log("UCtxInstance::createUniform(), index: ", index, ", mUid: ", this.mUid);

		const u = new WGRUniform(this.mPipelineCtx, this);
		u.layoutName = layoutName;
		u.groupIndex = groupIndex;
		let wp: WGRUniformWrapper;
		if (index >= 0) {
			wp = this.mList[index];
			u.index = index;
		} else {
			wp = new WGRUniformWrapper();
			u.index = this.mList.length;
			this.mList.push(wp);
		}
		wp.texParams = texParams;
		wp.bufDataParams = bufDataParams;
		wp.uniform = u;
		wp.enabled = true;

		if (index >= 0) {
			this.createUniformWithWP(wp, index);
		}
		// console.log("UCtxInstance::createUniform(), this.mList.length: ", this.mList.length);

		return u;
	}
	updateUniformTextureView(u: WGRUniform, texParams: { texView: GPUTextureView; sampler?: GPUSampler }[]): void {
		if (u && u.index >= 0 && this.mList[u.index]) {
			const wp = this.mList[u.index];
			const uf = wp.uniform;
			if (uf) {
				uf.bindGroup = this.mPipelineCtx.createUniformBindGroup(wp.groupIndex, wp.bufDataDescs, texParams);
			}
		}
	}
	removeUniform(u: WGRUniform): void {
		if (u && u.index >= 0 && this.mList[u.index]) {
			const wp = this.mList[u.index];
			if (wp.enabled) {
				// 注: remove 不一定是destroy，目前暂且这么处理，后续资源管理机制梳理的时候再调整。
				this.mFreeIds.push(u.index);
				wp.uniform = null;
				wp.texParams = null;
				wp.enabled = false;
				u.__$$destroy();
				console.log("UCtxInstance::removeUniform(), clear an uniform wp instance.");
			}
		}
	}
	destroy(): void {
		if (this.mPipelineCtx) {
			if (this.mBuffers) {
				for (let i = 0; i < this.mBuffers.length; ++i) {
					this.mBuffers[i].destroy();
				}
				this.mBuffers = null;
			}
			this.mPipelineCtx = null;
			let ls = this.mList;
			for (let i = 0; i < ls.length; ++i) {
				if (this.mList[i]) {
					this.removeUniform(this.mList[i].uniform);
				}
			}
		}
	}
}
class WGRUniformContext implements IWGRUniformContext {
	private mMap: Map<string, UCtxInstance> = new Map();
	private mInsList: UCtxInstance[] = [];
	private mPipelineCtx: IWGRPipelineContext | null = null;
	constructor() {}

	private getUCtx(layoutName: string, creation: boolean = true): UCtxInstance | null {
		let uctx: UCtxInstance = null;
		const m = this.mMap;
		if (m.has(layoutName)) {
			uctx = m.get(layoutName);
		} else {
			if (creation) {
				uctx = new UCtxInstance();
				uctx.initialize(this.mPipelineCtx);
				m.set(layoutName, uctx);
			}
		}
		return uctx;
	}
	initialize(pipelineCtx: IWGRPipelineContext): void {
		if (!this.mPipelineCtx && pipelineCtx) {
			this.mPipelineCtx = pipelineCtx;
		}
	}
	runBegin(): void {
		const ls = this.mInsList;
		// console.log("WGRUniformContext::runBegin(), ls.length: ", ls.length);
		for (let i = 0; i < ls.length; ) {
			ls[i].runBegin();
			if (ls[i].isEnabled()) {
				ls.splice(i, 1);
			} else {
				i++;
			}
		}
	}
	runEnd(): void {}

	createUniformsWithValues(params: WGRUniformParam[]): WGRUniform[] {
		// console.log("WGRUniformContext::createUniformsWithValues(), params: ", params);
		let uniforms: WGRUniform[] = [];
		for (let i = 0; i < params.length; ++i) {
			const p = params[i];
			uniforms.push(this.createUniformWithValues(p.layoutName, p.groupIndex, p.values, p.texParams));
		}
		return uniforms;
	}
	createUniformWithValues(layoutName: string, groupIndex: number, values: WGRUniformValue[], texParams?: WGRUniformTexParam[]): WGRUniform {
		if (this.mPipelineCtx) {
			const uctx = this.getUCtx(layoutName);
			this.mInsList.push(uctx);
			const bufDataParams: { size: number; usage: number }[] = [];
			for (let i = 0; i < values.length; ++i) {
				bufDataParams.push({ size: values[i].arrayStride, usage: values[i].usage });
				values[i].bufferIndex = i;
			}
			return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams);
		}
		throw Error("Illegal operation !!!");
		return null;
	}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: { size: number; usage: number }[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[]
	): WGRUniform | null {
		if (this.mPipelineCtx) {
			const uctx = this.getUCtx(layoutName);
			this.mInsList.push(uctx);
			return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams);
		}
		return null;
	}

	removeUniforms(ufs: WGRUniform[]): void {
		if (ufs && this.mPipelineCtx) {
			// console.log("WGRUniformContext::removeUniforms(), ufs.length: ", ufs.length);
			for (let i = 0; i < ufs.length; ++i) {
				this.removeUniform(ufs[i]);
			}
		}
	}
	removeUniform(u: WGRUniform): void {
		if (this.mPipelineCtx) {
			// console.log("WGRUniformContext::removeUniform(), u: ", u);
			if (u.layoutName) {
				const m = this.mMap;
				if (m.has(u.layoutName)) {
					const uctx = m.get(u.layoutName);
					uctx.removeUniform(u);
				}
			}
		}
	}
	destroy(): void {
		if (this.mPipelineCtx) {
			for (var [k, v] of this.mMap) {
				v.destroy();
			}
			this.mPipelineCtx = null;
		}
	}
}
export { WGRUniformParam, BufDataParamType, WGRUniformContext };

import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { UniformVerType, WGRUniform } from "./WGRUniform";
import { BindGroupDataParamType, BufDataParamType, UniformBufferParam, IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";
import { WGRUniformValue } from "./WGRUniformValue";
import { WGRUniformParam, WGRUniformTexParam, WGRUniformWrapper, IWGRUniformContext } from "./IWGRUniformContext";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { WGHBufferStore } from "../buffer/WGHBufferStore";
import { WGRShaderVisibility } from "./WGRShaderVisibility";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
class SharedUniformObj {
	map: Map<number, UniformVerType> = new Map();
}
class UCtxInstance {
	private static sUid = 0;
	private mUid = UCtxInstance.sUid++;

	private mList: WGRUniformWrapper[] = [];
	private mBuildTotal = 0;
	private mPipelineCtx: IWGRPipelineContext | null = null;
	private mBuffers: GPUBuffer[] = [];
	private mFreeIds: number[] = [];
	private mBindGroupDesc: GPUBindGroupDescriptor;
	private mBufDataDescs: BindGroupDataParamType[];
	private mOldPrivateBufs: GPUBuffer[] = [];
	private mBindGroupLayout: GPUBindGroupLayout;

	ready = false;
	shdUniform: SharedUniformObj;
	layoutAuto = true;
	constructor() {}

	private getFreeIndex(): number {
		if (this.mFreeIds.length > 0) return this.mFreeIds.pop();
		return -1;
	}
	initialize(pipelineCtx: IWGRPipelineContext | null): void {
		this.mPipelineCtx = pipelineCtx;
	}
	isEnabled(): boolean {
		return this.mBuildTotal > 0;
	}
	getBindGroupLayout(multisampled?: boolean): GPUBindGroupLayout {
		const ls = this.mList;
		const wp = ls[0];
		const ets: WGRShaderVisibility[] = [];
		if (wp.bufDataParams) {
			const dps = wp.bufDataParams;
			for (let i = 0; i < dps.length; ++i) {
				const p = dps[i];
				p.visibility.binding = ets.length;
				if (!p.visibility.buffer) {
					p.visibility.toBufferForUniform();
				}
				ets.push(p.visibility);
			}
		}
		if (wp.texParams) {
			const tps = wp.texParams;
			for (let i = 0; i < tps.length; ++i) {
				const p = tps[i];
				let v = new WGRShaderVisibility().toSamplerFiltering();
				v.binding = ets.length;
				ets.push(v);
				v = new WGRShaderVisibility().toTextureFloat(p.texView.dimension);
				v.texture.multisampled = multisampled === true ? true : false;
				v.binding = ets.length;
				ets.push(v);
			}
		}
		// console.log("UCtxInstance:: getBindGroupLayout(), CCCCCCC ets: ", ets);
		const desc = {
			label: "(BindGroupLayout)UCtxInstance" + this.mUid,
			entries: ets
		};
		this.mBindGroupLayout = this.mPipelineCtx.createBindGroupLayout(desc);
		return this.mBindGroupLayout;
	}
	runBegin(): void {
		// console.log("UCtxInstance::runBegin(), XXX XXX runBegin(), this.isEnabled(): ", this.isEnabled());
		const ls = this.mList;
		if (this.ready && this.mBuildTotal < ls.length) {
			this.mBuildTotal = ls.length;
			// console.log("UCtxInstance::runBegin(), XXX XXX XXX runBegin(), this.mList.length: ", this.mList.length);
			if (ls.length > 0) {
				let bufs = this.mOldPrivateBufs;
				for (let i = 0; i < bufs.length; ++i) {
					bufs[i].destroy();
					// console.log("destroy a private separate gpu buffer...");
				}
				this.mOldPrivateBufs = [];

				this.mBuffers = [];
				this.mBindGroupDesc = null;
				this.mBufDataDescs = null;
				// this.mBindGroupLayout = null;

				const wp = ls[0];
				if (wp.bufDataParams) {
					// let disableShared = true;
					// if (disableShared) {
					// 	// for debug
					// 	for (let i = 0; i < ls.length; ++i) {
					// 		const wp = ls[i];
					// 		const dps = wp.bufDataParams;
					// 		for (let i = 0; i < dps.length; ++i) {
					// 			dps[i].shared = false;
					// 		}
					// 	}
					// }
					// console.log("XXX XXX wp.bufDataParams: ", wp.bufDataParams);
					const wgctx = this.mPipelineCtx.getWGCtx();
					const store = WGHBufferStore.getStore(wgctx);

					const dps = wp.bufDataParams;
					for (let i = 0; i < dps.length; ++i) {
						const dp = dps[i];
						dp.visibility.binding = i;

						const sizes = new Array(dp.shared ? 1 : ls.length);
						const uniformParam = { sizes, usage: dp.usage, arrayStride: dp.arrayStride } as UniformBufferParam;
						let buf: GPUBuffer;
						const sharedData = dp.ufvalue.sharedData;
						if (sharedData) {
							buf = sharedData.buffer;
						}
						if (!buf) {
							if (dp.shared) {
								// console.log("BBBBBBBBBB uniformParam.sizes: ", uniformParam.sizes);
								if (store.hasWithUid(dp.vuid)) {
									buf = store.getWithUid(dp.vuid);
									console.log("apply old shared uniform gpu buffer...");
								} else {
									console.log("create new shared uniform gpu buffer...");
									uniformParam.sizes[0] = ls[0].bufDataParams[i].size;
									buf = this.mPipelineCtx.createUniformsBuffer(uniformParam);
									// dp.ufvalue.__$gbuf = buf;
									store.addWithUid(dp.vuid, buf);
								}
								buf.shared = true;
							} else {
								for (let j = 0; j < ls.length; ++j) {
									uniformParam.sizes[j] = ls[j].bufDataParams[i].size;
								}
								buf = this.mPipelineCtx.createUniformsBuffer(uniformParam);
								// this.mOldPrivateBufs.push(buf);
							}
						}
						if (!dp.shared) {
							this.mOldPrivateBufs.push(buf);
						}
						if (sharedData && !sharedData.buffer) {
							sharedData.buffer = buf;
						}
						// console.log("XXX XXX dps[",i,"].shared: ", dp.shared);
						// console.log("XXX XXX uniformParam.sizes: ", uniformParam.sizes);
						// const buffer = this.mPipelineCtx.createUniformsBuffer(uniformParam);
						this.mBuffers.push(buf);
						// console.log("PPP PPP PPP ,i: ",i," buf.size: ", buf.size);
					}
					// const desc = {
					// 	label: 'UCtxInstance' + this.mUid,
					// 	entries: vbList
					// };
					// console.log("XXXXXXXXXYYYYY desc: ", desc);
					// this.mBindGroupLayout = this.mPipelineCtx.createBindGroupLayout(desc);
				}
				console.log("XXX XXX this.mBuffers: ", this.mBuffers);
				// console.log("XXX XXX ls: ", ls);
				for (let i = 0; i < ls.length; ++i) {
					this.createUniformWithWP(ls[i], i, true);
				}
				// console.log("UCtxInstance::runBegin(), this.mList: ", this.mList);
			}
		}
	}
	private static sBindGroupIndex = 0;
	private createVers(wp: WGRUniformWrapper): { ver: number; shared: boolean }[] {
		const dps = wp.bufDataParams;
		const map = this.shdUniform.map;

		let versions = new Array(dps.length);
		for (let i = 0; i < dps.length; ++i) {
			// console.log("*** *** *** createVers(), dps[",i,"].shared: ", dps[i].shared);
			if (dps[i].shared) {
				const vid = dps[i].vuid;
				if (!map.has(vid)) {
					map.set(vid, { ver: -1, shared: true });
				}
				versions[i] = map.get(vid);
			} else {
				versions[i] = { ver: -1, shared: false };
			}
		}
		return versions;
	}
	private createUniformWithWP(wp: WGRUniformWrapper, index: number, force = false): void {
		console.log("createUniformWithWP(), wp.groupIndex: ", wp.groupIndex);
		const uf = wp.uniform;
		if (uf && (!uf.bindGroup || force)) {
			uf.buffers = this.mBuffers;
			uf.versions = this.createVers(wp);
			const dps = wp.bufDataParams;
			if (dps) {
				let desc = this.mBindGroupDesc;
				let ps = this.mBufDataDescs;
				if (!desc) {
					if (!ps) {
						ps = [];
						for (let j = 0; j < dps.length; ++j) {
							const dp = dps[j];
							ps.push({ index: index, buffer: uf.buffers[j], bufferSize: dp.size, shared: dp.shared, usageType: dp.usageType });
						}
						this.mBufDataDescs = ps;
					}
					for (let j = 0; j < ps.length; ++j) {
						ps[j].index = index;
					}

					const layout = this.layoutAuto ? null : this.mBindGroupLayout;
					console.log("XXX XXX createUniformWithWP(), layout: ", layout);

					desc = this.mPipelineCtx.createBindGroupDesc(wp.groupIndex, ps, wp.texParams, 0, layout);
					this.mBindGroupDesc = desc;
				}
				this.mPipelineCtx.bindGroupDescUpdate(desc, ps, wp.texParams, index);
				uf.bindGroup = this.mPipelineCtx.createBindGroupWithDesc(desc);
			} else {
				uf.bindGroup = this.mPipelineCtx.createBindGroup(wp.groupIndex, null, wp.texParams);
			}
			uf.bindGroup.index = UCtxInstance.sBindGroupIndex++;
			console.log("XXX XXX createUniformWithWP(), create a bindGroup: ", uf.bindGroup);
			uf.__$$updateSubUniforms();
		}
	}
	runEnd(): void {
		// if(this.mOldBufs) {
		// 	for (let i = 0; i < this.mOldBufs.length; ++i) {
		// 		this.mOldBufs[i].destroy();
		// 		console.log("destroy a gpu buffer...");
		// 	}
		// 	this.mOldBufs = [];
		// }
	}
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
		// console.log("UCtxInstance::createUniform(), index: ", index, ", mUid: ", this.mUid);

		if (this.mBuffers.length > 0) {
			console.warn("need build other many append new uniforms...");
		}
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
				uf.bindGroup = this.mPipelineCtx.createBindGroup(wp.groupIndex, wp.bufDataDescs, texParams);
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
			this.shdUniform = null;
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
	private mUCtxIns: UCtxInstance;
	private mInsList: UCtxInstance[] = [];
	private mPipelineCtx: IWGRPipelineContext | null = null;
	private static shdUniform = new SharedUniformObj();
	private mLayoutAuto = true;
	constructor(layoutAuto: boolean) {
		this.mLayoutAuto = layoutAuto;
		console.log("WGRUniformContext::constructor() ...");
	}
	isLayoutAuto(): boolean {
		return this.mLayoutAuto;
	}
	private getUCtx(layoutName: string, creation = true): UCtxInstance | null {
		let uctx: UCtxInstance = null;
		const m = this.mMap;
		if (m.has(layoutName)) {
			uctx = m.get(layoutName);
		} else {
			if (creation) {
				uctx = new UCtxInstance();
				uctx.layoutAuto = this.mLayoutAuto;
				uctx.shdUniform = WGRUniformContext.shdUniform;
				uctx.initialize(this.mPipelineCtx);
				m.set(layoutName, uctx);
				this.mUCtxIns = uctx;
			}
		}
		return uctx;
	}
	initialize(pipelineCtx: IWGRPipelineContext): void {
		if (!this.mPipelineCtx && pipelineCtx) {
			this.mPipelineCtx = pipelineCtx;
		}
	}
	getBindGroupLayout(multisampled?: boolean): GPUBindGroupLayout {
		if (this.mUCtxIns) {
			return this.mUCtxIns.getBindGroupLayout(multisampled);
		}
		return null;
	}
	runBegin(): void {
		const ls = this.mInsList;
		// console.log("WGRUniformContext::runBegin(), ls.length: ", ls.length);
		for (let i = 0; i < ls.length; ) {
			ls[i].runBegin();
			if (ls[i].isEnabled()) {
				ls[i].ready = false;
				ls.splice(i, 1);
				console.log("finish and remove a old ready uniform ctx ins.");
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
			if (!uctx.ready) {
				this.mInsList.push(uctx);
				uctx.ready = true;
				console.log("add a new ready uniform ctx ins.");
			}
			const bufDataParams: BufDataParamType[] = [];
			for (let i = 0; i < values.length; ++i) {
				const v = values[i];
				v.bufferIndex = i;
				const usageType = v.isStorage() ? 1 : 0;
				const vuid = v.getUid();
				const arrayStride = v.arrayStride;
				const visibility = v.visibility.clone();
				bufDataParams.push({
					arrayStride,
					size: v.data.byteLength,
					usage: v.usage,
					shared: v.shared,
					usageType,
					vuid,
					visibility,
					ufvalue: v
				});
			}
			return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams);
		}
		throw Error("Illegal operation !!!");
		return null;
	}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: BufDataParamType[],
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

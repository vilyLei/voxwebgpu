import { GPUBuffer } from "../../gpu/GPUBuffer";
import { GPUSampler } from "../../gpu/GPUSampler";
import { GPUTextureView } from "../../gpu/GPUTextureView";
import { UniformVerType, WGRUniform } from "./WGRUniform";
import { BindGroupDataParamType, BufDataParamType, UniformBufferParam, IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";
import { WGRUniformValue } from "./WGRUniformValue";
import { WGRUniformBufObj, WGRUniformParam, WGRUniformWrapper } from "./IWGRUniformContext";
import { GPUBindGroupDescriptor } from "../../gpu/GPUBindGroupDescriptor";
import { WGHBufferStore } from "../buffer/WGHBufferStore";
import { WGRBufferVisibility } from "../buffer/WGRBufferVisibility";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { WGRBindGroupContext } from "../pipeline/WGRBindGroupContext";

class SharedUniformObj {
	map: Map<number, UniformVerType> = new Map();
}
class WGRUniformCtxInstance {
	private static sUid = 0;
	private mUid = WGRUniformCtxInstance.sUid++;

	private mList: WGRUniformWrapper[] = [];
	private mBuildTotal = 0;
	private mBindGCtx: WGRBindGroupContext;
	private mBufObj = new WGRUniformBufObj();

	private mFreeIds: number[] = [];
	private mBindGroupDesc: GPUBindGroupDescriptor;
	private mBufDataDescs: BindGroupDataParamType[];
	private mBindGroupLayout: GPUBindGroupLayout;


	ready = false;
	shdUniform: SharedUniformObj;
	layoutAuto = true;
	constructor() {}

	private getFreeIndex(): number {
		if (this.mFreeIds.length > 0) return this.mFreeIds.pop();
		return -1;
	}
	initialize(bindGCtx: WGRBindGroupContext): void {
		this.mBindGCtx = bindGCtx;
	}
	isEnabled(): boolean {
		return this.mBuildTotal > 0;
	}
	getBindGroupLayout(multisampled?: boolean): GPUBindGroupLayout {
		const ls = this.mList;
		const wp = ls[0];
		const ets: WGRBufferVisibility[] = [];
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
				let v = new WGRBufferVisibility().toSamplerFiltering();
				v.binding = ets.length;
				ets.push(v);
				v = new WGRBufferVisibility().toTextureFloat(p.texView.dimension);
				v.texture.multisampled = multisampled === true ? true : false;
				v.binding = ets.length;
				ets.push(v);
			}
		}
		// console.log("WGRUniformCtxInstance:: getBindGroupLayout(), CCCCCCC ets: ", ets);
		const desc = {
			label: "(BindGroupLayout)WGRUniformCtxInstance" + this.mUid,
			entries: ets
		};
		this.mBindGroupLayout = this.mBindGCtx.createBindGroupLayout(desc);
		return this.mBindGroupLayout;
	}
	runBegin(): void {
		const ls = this.mList;
		if (this.ready && this.mBuildTotal < ls.length) {
			this.mBuildTotal = ls.length;
			// console.log("WGRUniformCtxInstance::runBegin(), XXX XXX XXX runBegin(), this.mList.length: ", this.mList.length);
			if (ls.length > 0) {

				this.mBindGroupDesc = null;
				this.mBufDataDescs = null;

				const wp = ls[0];
				if (!wp.uniformAppend && !wp.bufObj) {
					wp.bufObj = new WGRUniformBufObj();
				}
				const bo = wp.uniformAppend ? this.mBufObj : wp.bufObj;
				wp.bufObj = bo;
				const bufs = bo.oldBufs;
				if (bufs) {
					for (let i = 0; i < bufs.length; ++i) {
						bufs[i].destroy();
						// console.log("0 destroy a private separate gpu buffer...");
					}
				}
				bo.buffers = [];
				bo.oldBufs = [];
				if (wp.uniformAppend) {
					for (let i = 1; i < ls.length; ++i) {
						ls[i].bufObj = wp.bufObj;
					}
					this.buildBufs(wp);
				} else {
					// console.log("VVVVVVVVVVVVVVVVV 01 ...");
					// console.log("ls: ", ls);
					this.buildBufs(wp);
					// console.log("VVVVVVVVVVVVVVVVV 02 ...");
					for (let i = 1; i < ls.length; ++i) {
						let tbo = ls[i].bufObj;
						if (tbo) {
							const bufs = tbo.oldBufs;
							if (bufs) {
								for (let j = 0; j < bufs.length; ++j) {
									bufs[j].destroy();
									// console.log("1 destroy a private separate gpu buffer...");
								}
							}
						} else {
							tbo = ls[i].bufObj = new WGRUniformBufObj();
						}
						tbo.buffers = [];
						tbo.oldBufs = [];

						// console.log("VVVVVVVVVVVVVVVVV 03 ...");
						this.buildBufs(ls[i]);
						// console.log("VVVVVVVVVVVVVVVVV 04 ...");
					}
				}
				// console.log("XXX XXX this.mBuffers: ", this.mBuffers);
				for (let i = 0; i < ls.length; ++i) {
					this.createUniformWithWP(ls[i], i, true);
				}
				// console.log("WGRUniformCtxInstance::runBegin(), this.mList: ", this.mList);
			}
		}
	}

	private buildBufs(wp: WGRUniformWrapper): void {
		if (wp.bufDataParams) {
			const bo = wp.bufObj;
			const ls = this.mList;
			const wgctx = this.mBindGCtx.getWGCtx();
			const store = WGHBufferStore.getStore(wgctx);
			const append = wp.uniformAppend;
			// console.log("XXXXX A-0 append: ", append);
			const dps = wp.bufDataParams;
			for (let i = 0; i < dps.length; ++i) {
				const dp = dps[i];
				dp.visibility.binding = i;

				const sizes = new Array(dp.shared || !append ? 1 : ls.length);
				const uniformParam = { sizes, usage: dp.usage, arrayStride: dp.arrayStride } as UniformBufferParam;
				let buf: GPUBuffer;
				const sharedData = dp.ufvalue.sharedData;
				if (sharedData) {
					buf = sharedData.buffer;
				}
				if (!buf) {
					if (dp.shared) {
						if (store.hasWithUid(dp.vuid)) {
							buf = store.getWithUid(dp.vuid);
							// console.log("apply old shared uniform gpu buffer...");
						} else {
							// console.log("create new shared uniform gpu buffer...");
							uniformParam.sizes[0] = ls[0].bufDataParams[i].size;
							buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
							store.addWithUid(dp.vuid, buf);
						}
						buf.shared = true;
					} else {
						// console.log("XXXXX A-1 append: ", append);
						if (append) {
							for (let j = 0; j < ls.length; ++j) {
								uniformParam.sizes[j] = ls[j].bufDataParams[i].size;
							}
							buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
						} else {
							// console.log("XXXXX A-2 append: ", append);
							// console.log("XXXXX A-2 uniformParam.sizes: ", uniformParam.sizes);
							uniformParam.sizes[0] = ls[i].bufDataParams[i].size;
							buf = this.mBindGCtx.createUniformsBuffer(uniformParam);
						}
					}
				}
				if (!dp.shared && !sharedData) {
					bo.oldBufs.push(buf);
				}
				if (sharedData && !sharedData.buffer) {
					sharedData.buffer = buf;
				}
				// this.mBuffers.push(buf);
				bo.buffers.push(buf);
				// console.log("PPP PPP PPP ,i: ",i," buf.size: ", buf.size);
			}
		}
	}
	private createVers(wp: WGRUniformWrapper): UniformVerType[] {
		const dps = wp.bufDataParams;
		const map = this.shdUniform.map;

		let versions = new Array(dps.length);
		for (let i = 0; i < dps.length; ++i) {
			const ufv = dps[i].ufvalue;
			if (ufv.shared === true) {
				const vid = ufv.getUid();
				if (!map.has(vid)) {
					map.set(vid, { vid: ufv.getUid(), ver: -1, shared: true, shdVarName: ufv.shdVarName });
				}
				versions[i] = map.get(vid);
			} else {
				versions[i] = { vid: ufv.getUid(), ver: -1, shared: false, shdVarName: ufv.shdVarName };
			}
		}
		return versions;
	}
	private createUvfs(wp: WGRUniformWrapper): WGRUniformValue[] {
		const dps = wp.bufDataParams;
		let uvfs = new Array(dps.length);
		for (let i = 0; i < dps.length; ++i) {
			uvfs[i] = dps[i].ufvalue;
		}
		return uvfs;
	}
	private createUniformWithWP(wp: WGRUniformWrapper, index: number, force = false): void {
		// console.log("createUniformWithWP(), wp.groupIndex: ", wp.groupIndex);
		const uf = wp.uniform;
		if (uf && (!uf.bindGroup || force)) {
			uf.buffers = wp.bufObj.buffers.slice(0);
			uf.versions = this.createVers(wp);
			uf.uvfs = this.createUvfs(wp);
			let ivs: number[] = new Array(uf.uvfs.length);
			for(let i = 0; i < ivs.length; ++i) {
				ivs[i] = (uf.uvfs[i].shared || !wp.uniformAppend) ? 0 : uf.index;
			}
			uf.ivs = ivs;
			const dps = wp.bufDataParams;
			if (dps) {
				let desc = this.mBindGroupDesc;
				let ps = this.mBufDataDescs;
				if (!desc || !wp.uniformAppend) {
					if (!ps || !wp.uniformAppend) {
						ps = new Array( dps.length );
						for (let j = 0; j < dps.length; ++j) {
							const dp = dps[j];
							ps[j] = { index: index, buffer: uf.buffers[j], bufferSize: dp.size, shared: dp.shared, usageType: dp.usageType };
						}
						this.mBufDataDescs = ps;
					}
					if(wp.uniformAppend) {
						for (let j = 0; j < ps.length; ++j) {
							ps[j].index = index;
						}
					}

					const layout = this.layoutAuto ? null : this.mBindGroupLayout;

					desc = this.mBindGCtx.createBindGroupDesc(wp.groupIndex, ps, wp.texParams, 0, layout);
					this.mBindGroupDesc = desc;
				}
				this.mBindGCtx.bindGroupDescUpdate(desc, ps, wp.texParams, index, wp.uniformAppend);
				uf.bindGroup = this.mBindGCtx.createBindGroupWithDesc(desc);
			} else {
				uf.bindGroup = this.mBindGCtx.createBindGroup(wp.groupIndex, null, wp.texParams);
			}
			// console.log("XXX XXX createUniformWithWP(), create a bindGroup: ", uf.bindGroup);
			uf.__$$updateSubUniforms();
		}
	}
	runEnd(): void {}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: BufDataParamType[],
		texParams?: { texView: GPUTextureView; sampler?: GPUSampler }[],
		uniformAppend?: boolean
	): WGRUniform {
		if (!((bufDataParams && bufDataParams.length) || (texParams && texParams.length))) {
			throw Error("Illegal operation !!!");
		}
		const index = this.getFreeIndex();
		// console.log("WGRUniformCtxInstance::createUniform(), index: ", index, ", mUid: ", this.mUid);

		// if (this.mBuffers.length > 0) {
		// 	console.warn("need build other many append new uniforms...");
		// }
		const u = new WGRUniform(this.mBindGCtx, this);
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
		wp.uniformAppend = uniformAppend === false ? false : true;
		wp.texParams = texParams;
		wp.bufDataParams = bufDataParams;
		wp.uniform = u;
		wp.enabled = true;

		if (index >= 0) {
			this.createUniformWithWP(wp, index);
		}
		// console.log("WGRUniformCtxInstance::createUniform(), this.mList.length: ", this.mList.length);
		return u;
	}
	updateUniformTextureView(u: WGRUniform, texParams: { texView: GPUTextureView; sampler?: GPUSampler }[]): void {
		if (u && u.index >= 0 && this.mList[u.index]) {
			const wp = this.mList[u.index];
			const uf = wp.uniform;
			if (uf) {
				uf.bindGroup = this.mBindGCtx.createBindGroup(wp.groupIndex, wp.bufDataDescs, texParams);
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
				wp.bufObj = null;
				wp.texParams = null;
				wp.enabled = false;
				u.__$$destroy();
				console.log("WGRUniformCtxInstance::removeUniform(), clear an uniform wp instance.");
			}
		}
	}
	destroy(): void {
		if (this.mBindGCtx) {
			this.shdUniform = null;
			// if (this.mBuffers) {
			// 	for (let i = 0; i < this.mBuffers.length; ++i) {
			// 		this.mBuffers[i].destroy();
			// 	}
			// 	this.mBuffers = null;
			// }
			if (this.mBufObj) {
				this.mBufObj.destroy();
				this.mBufObj = null;
			}
			this.mBindGCtx = null;
			let ls = this.mList;
			for (let i = 0; i < ls.length; ++i) {
				if (this.mList[i]) {
					this.removeUniform(this.mList[i].uniform);
				}
			}
		}
	}
}
export { SharedUniformObj, WGRUniformParam, BufDataParamType, WGRUniformCtxInstance };

import { WGRUniform } from "./WGRUniform";
import { BufDataParamType } from "../pipeline/WGRPipelineContextImpl";
import { WGRUniformParam, IWGRUniformContext, WGRTexLayoutParam } from "./IWGRUniformContext";
import { GPUBindGroupLayout } from "../../gpu/GPUBindGroupLayout";
import { SharedUniformObj, WGRUniformCtxInstance } from "./WGRUniformCtxInstance";
import { WGRBindGroupContext } from "../pipeline/WGRBindGroupContext";
import { WebGPUContext } from "../../gpu/WebGPUContext";
import { WGRBufferData } from "../buffer/WGRBufferData";

class WGRUniformContext implements IWGRUniformContext {
	private mMap: Map<string, WGRUniformCtxInstance> = new Map();
	private mUCtxIns: WGRUniformCtxInstance;
	private mInsList: WGRUniformCtxInstance[] = [];
	private mBindGCtx: WGRBindGroupContext;
	private static shdUniform = new SharedUniformObj();
	private mLayoutAuto = true;
	constructor(layoutAuto: boolean) {
		this.mLayoutAuto = layoutAuto;
		console.log("WGRUniformContext::constructor() ...");
	}
	isLayoutAuto(): boolean {
		return this.mLayoutAuto;
	}
	getWGCtx(): WebGPUContext {
		return this.mBindGCtx.getWGCtx();
	}
	private getUCtx(layoutName: string, creation = true): WGRUniformCtxInstance | null {
		let uctx: WGRUniformCtxInstance = null;
		const m = this.mMap;
		if (m.has(layoutName)) {
			uctx = m.get(layoutName);
		} else {
			if (creation) {
				uctx = new WGRUniformCtxInstance();
				uctx.layoutAuto = this.mLayoutAuto;
				uctx.shdUniform = WGRUniformContext.shdUniform;
				uctx.initialize(this.mBindGCtx);
				m.set(layoutName, uctx);
				this.mUCtxIns = uctx;
			}
		}
		return uctx;
	}
	initialize(bindGCtx: WGRBindGroupContext): void {
		if (!this.mBindGCtx && bindGCtx) {
			this.mBindGCtx = bindGCtx;
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

	createUniformsWithValues(params: WGRUniformParam[], uniformAppend?: boolean): WGRUniform[] {
		// console.log("WGRUniformContext::createUniformsWithValues(), params: ", params);
		let uniforms: WGRUniform[] = [];
		for (let i = 0; i < params.length; ++i) {
			const p = params[i];
			uniforms.push(this.createUniformWithValues(p.layoutName, p.groupIndex, p.values, p.texParams, uniformAppend));
		}
		return uniforms;
	}
	createUniformWithValues(layoutName: string, groupIndex: number, values: WGRBufferData[], texParams?: WGRTexLayoutParam[], uniformAppend?: boolean): WGRUniform {
		if (this.mBindGCtx) {
			const uctx = this.getUCtx(layoutName);
			if (!uctx.ready) {
				this.mInsList.push(uctx);
				uctx.ready = true;
				console.log("add a new ready uniform ctx ins.");
			}
			const bufDataParams: BufDataParamType[] = [];
			for (let i = 0; i < values.length; ++i) {

				// console.log(values[i], ", A0-KKK v instanceof WGRBufferValue: ", values[i] instanceof WGRBufferValue);
				/*
				let v = values[i];
				v = checkBufferData(v);
				if(v.uid == undefined || v.uid < 0) {
					v.uid = createNewWRGBufferViewUid();
				}
				*/
				let v = values[i];
				// v = checkBufferData(v);
				// if(v.uid == undefined || v.uid < 0) {
				// 	v.uid = createNewWRGBufferViewUid();
				// }
				const vuid = v.uid;
				const arrayStride = v.arrayStride;
				const visibility = v.visibility.clone();

				// console.log(v, ", B1 v instanceof WGRBufferValue: ", v instanceof WGRBufferValue);
				let param = {
					arrayStride,
					size: v.byteLength,
					usage: v.usage,
					shared: v.shared,
					vuid,
					visibility,
					ufvalue: v
				} as BufDataParamType;
				// console.log("XXX XXX param: ", param);
				bufDataParams.push(param);
			}
			return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend);
		}
		throw Error("Illegal operation !!!");
		return null;
	}
	createUniform(
		layoutName: string,
		groupIndex: number,
		bufDataParams?: BufDataParamType[],
		texParams?: WGRTexLayoutParam[],
		uniformAppend?: boolean
	): WGRUniform | null {
		if (this.mBindGCtx) {
			const uctx = this.getUCtx(layoutName);
			this.mInsList.push(uctx);
			return uctx.createUniform(layoutName, groupIndex, bufDataParams, texParams, uniformAppend);
		}
		return null;
	}

	removeUniforms(ufs: WGRUniform[]): void {
		if (ufs && this.mBindGCtx) {
			// console.log("WGRUniformContext::removeUniforms(), ufs.length: ", ufs.length);
			for (let i = 0; i < ufs.length; ++i) {
				this.removeUniform(ufs[i]);
			}
		}
	}
	removeUniform(u: WGRUniform): void {
		if (this.mBindGCtx) {
			// console.log("WGRUniformContext::removeUniform(), u: ", u);
			if (u.layoutName !== undefined) {
				const m = this.mMap;
				if (m.has(u.layoutName)) {
					const uctx = m.get(u.layoutName);
					uctx.removeUniform(u);
				}
			}
		}
	}
	destroy(): void {
		if (this.mBindGCtx) {
			for (var [k, v] of this.mMap) {
				v.destroy();
			}
			this.mBindGCtx = null;
		}
	}
}
export { WGRUniformParam, BufDataParamType, WGRUniformContext };

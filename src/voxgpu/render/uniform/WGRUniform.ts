import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRUniformValue } from "./WGRUniformValue";
import { WGRBindGroupContext } from "../pipeline/WGRBindGroupContext";

type UniformVerType = { vid: number, ver: number, shared: boolean, shdVarName?: string };
interface WGRUniformCtx {
	removeUniform(u: WGRUniform): void;
}
class WGRUniform {
	private static sUid = 0;
	private mUid = WGRUniform.sUid++;
	private mCloned = false;
	private mCtx: WGRUniformCtx;
    private mBindGCtx: WGRBindGroupContext;

	private mSubUfs: WGRUniform[] = [];

	index = -1;
	layoutName = "";

	buffers: GPUBuffer[];
	versions: UniformVerType[];
	bindGroup: GPUBindGroup;
	uvfs: WGRUniformValue[];
	ivs: number[];
	/**
	 * bind group index
	 */
	groupIndex = -1;

	constructor(bindGCtx: WGRBindGroupContext, ctx: WGRUniformCtx){
		this.mBindGCtx = bindGCtx;
		this.mCtx = ctx;
	}

	getUid(): number {
		return this.mUid;
	}
	setValue(value: WGRUniformValue, index = 0): void {
		const v = this.versions[index];
		if(v.ver != value.version) {
			v.ver = value.version;
			// this.mBindGCtx.updateUniformBufferAt(this.buffers[index], value.data, (v.shared || !this.uniformAppend) ? 0 : this.index, value.byteOffset);
			this.mBindGCtx.updateUniformBufferAt(this.buffers[index], value.data, this.ivs[index], value.byteOffset);
		}
	}
	isEnabled(): boolean {
		return this.buffers != null;
	}
	__$$updateSubUniforms(): void {

		const ufs = this.mSubUfs;
		if(ufs && this.buffers) {
			for(let i = 0, ln = ufs.length; i < ln; i++) {
				this.copySelfTo( ufs[i] );
			}
		}
	}

	private copySelfTo(u: WGRUniform): void {

		u.index = this.index;
		u.layoutName = this.layoutName;
		u.buffers = this.buffers;
		u.bindGroup = this.bindGroup;
		u.groupIndex = this.groupIndex;
		u.versions = this.versions.slice(0);
		// console.log("copySelfTo(), u.versions: ", u.versions);
	}
	clone(): WGRUniform {

		const u = new WGRUniform(this.mBindGCtx, this.mCtx);
		u.index = this.index;
		u.layoutName = this.layoutName;
		u.buffers = this.buffers;
		u.bindGroup = this.bindGroup;
		u.groupIndex = this.groupIndex;
		u.mCloned = true;
		this.mSubUfs.push(u);
		return u;
	}

	cloneMany(total:number): WGRUniform[] {
		const ls: WGRUniform[] = new Array(total);
		for(let i = 0; i < total; ++i) {
			ls[i] = this.clone();
			// ls[i].uid = 1000 + i;
		}
		return ls;
	}
	destroy(): void {
		if(this.mCtx) {
			this.mSubUfs = [];
			this.uvfs = null;
			if(this.mCloned) {

				this.index = -1;
				this.groupIndex = -1;
				this.buffers = null;
				this.bindGroup = null;
			}else {

				this.mCtx.removeUniform( this );
			}
			this.mCtx = null;
		}
	}
	__$$destroy(): void {

		this.groupIndex = -1;
		this.index = -1;
		this.mBindGCtx = null;
		this.buffers = null;
	}
}
export { UniformVerType, WGRUniform }

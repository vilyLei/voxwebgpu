import { GPUBindGroup } from "../../gpu/GPUBindGroup";
import { GPUBuffer } from "../../gpu/GPUBuffer";
import { WGRUniformValue } from "./WGRUniformValue";
import { IWGRPipelineContext } from "../pipeline/IWGRPipelineContext";

type UniformVerType = { vid: number, ver: number, shared: boolean, shdVarName?: string };
interface WGRUniformCtx {
	removeUniform(u: WGRUniform): void;
}
class WGRUniform {
	private static sUid = 0;
	private mUid = WGRUniform.sUid++;
	private mCloned = false;
	private mCtx: WGRUniformCtx;
    private mPipelineCtx: IWGRPipelineContext;

	private mSubUfs: WGRUniform[] = [];

	index = -1;
	layoutName = "";

	buffers: GPUBuffer[];
	versions: UniformVerType[];
	bindGroup: GPUBindGroup;
	uvfs: WGRUniformValue[];
	/**
	 * bind group index
	 */
	groupIndex = -1;

	constructor(pipelineCtx: IWGRPipelineContext, ctx: WGRUniformCtx){
		this.mPipelineCtx = pipelineCtx;
		this.mCtx = ctx;
	}

	getUid(): number {
		return this.mUid;
	}
	setValue(value: WGRUniformValue, index = 0): void {
		const v = this.versions[index];
		if(v.ver != value.version) {
			v.ver = value.version;
			// console.log("WRORUniform::setValue(), call ..., shared: ", value.shared, ",", value.shdVarName);
			// console.log("WRORUniform::setValue(), call ..., v: ", v);
			// console.log("WRORUniform::setValue(), call ..., value: ", value);
			// if(v.shdVarName !== value.shdVarName) {
			// 	console.log("WRORUniform::setValue(), versions: ", this.versions);
			// 	console.log("WRORUniform::setValue(), uvfs: ", this.uvfs);
			// 	throw Error('Illegal operation: v.shdVarName !== value.shdVarName !!!');
			// }
			// if(v.vid !== value.getUid()) {
			// 	throw Error('Illegal operation: v.vid !== value.getUid() !!!');
			// }
			// console.log("WRORUniform::setValue(), call ...value.__$gbuf: ", value.__$gbuf);
			// this.mPipelineCtx.updateUniformBufferAt(value.__$gbuf ? value.__$gbuf : this.buffers[i], value.data, v.shared ? 0 : this.index, value.byteOffset);
			this.mPipelineCtx.updateUniformBufferAt(this.buffers[index], value.data, v.shared ? 0 : this.index, value.byteOffset);
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

		const u = new WGRUniform(this.mPipelineCtx, this.mCtx);
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
		this.mPipelineCtx = null;
		this.buffers = null;
	}
}
export { UniformVerType, WGRUniform }

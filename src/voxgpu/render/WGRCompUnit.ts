import { WGRUniform } from "./uniform/WGRUniform";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../cgeom/IAABB";
import { IWGRendererPass } from "../render/pipeline/IWGRendererPass";
import { WGRUnitState } from "./WGRUnitState";
import { IWGMaterial } from "../material/IWGMaterial";
import { GPUComputePassEncoder } from "../gpu/GPUComputePassEncoder";
import { GPUComputePipeline } from "../gpu/GPUComputePipeline";

class WGRCompUnitRunSt {
	pipeline: GPUComputePipeline;
	rc: GPUComputePassEncoder;
	gt: WGRPrimitive;
	ibuf: GPUBuffer;
	unfsuuid: string;
}

const __$urst = new WGRCompUnitRunSt();
const __$rcompeust = new WGRUnitState();
const __$workcounts = new Uint16Array([1, 1, 0, 0]);

class WGRCompUnit implements IWGRUnit {
	private mUfValues: WGRUniformValue[];
	private rf = true;

	uniforms?: WGRUniform[];

	etuuid?: string;

	pipelinectx: IWGRPipelineContext;

	bounds: IAABB;

	st = __$rcompeust;

	__$rever = 0;

	enabled = true;
	passes: IWGRUnit[];
	rp: IWGRendererPass;
	material: IWGMaterial;

	workcounts = __$workcounts;

	clone(): WGRCompUnit {
		const r = new WGRCompUnit();

		r.mUfValues = this.mUfValues;
		r.uniforms = this.uniforms;
		r.pipelinectx = this.pipelinectx;
		r.passes = this.passes;
		r.rp = this.rp;

		return r;
	}
	getRF(): boolean {
		return this.enabled && this.st.isDrawable();
	}
	setUniformValues(values: WGRUniformValue[]): void {
		this.mUfValues = values;
	}
	runBegin(): void {
		const rc = this.rp.compPassEncoder;
		const mt = this.material;
		let rf = this.enabled && this.rp.enabled && this.st.isDrawable();
		rf = rf && mt.visible;
		if (rf) {
			const pipeline = this.pipelinectx.comppipeline;
			if (pipeline) {
				// 这里面的诸多判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好， 后续优化

				const st = __$urst;
				if (st.rc != rc) {
					st.pipeline = null;
					st.ibuf = null;
					st.gt = null;
					st.rc = rc;
					st.unfsuuid = "";
				}

				if (st.pipeline != pipeline) {
					st.pipeline = pipeline;
					// console.log("ruint setPipeline(), this.pipeline: ", this.pipeline);
					rc.setPipeline(pipeline);
				}

				const ufs = this.uniforms;
				if (ufs) {
					for (let i = 0, ln = ufs.length; i < ln; i++) {
						const uf = ufs[i];
						if (uf.isEnabled()) {
							console.log("compruint setBindGroup(), bindGroup: ", uf.bindGroup);
							// console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex,",", uf.bindGroup);
							rc.setBindGroup(uf.groupIndex, uf.bindGroup);
						} else {
							rf = false;
						}
					}
					if (rf) {
						// first, apply shared uniform
						const ufvs = this.mUfValues;
						if (ufvs) {
							// console.log("ufvs.length: ", ufvs.length);
							for (let i = 0, ln = ufvs.length; i < ln; i++) {
								// console.log("ruint ufs setValue(), i: ", i);
								ufs[ufvs[i].index].setValue(ufvs[i]);
							}
						}
					}
				}
			} else {
				rf = false;
			}
		}
		this.rf = rf;
	}
	run(): void {
		if (this.rf) {
			const rc = this.rp.compPassEncoder;
			const works = this.workcounts;
			// console.log("dispatchWorkgroups(), works: ", works);
			if (works[1] > 0 && works[2] > 0) {
				rc.dispatchWorkgroups(works[0], works[1], works[2]);
			} else if (works[1] > 0) {
				console.log("dispatchWorkgroups(x: " + works[0] + ", y: " + works[1] + ")");
				rc.dispatchWorkgroups(works[0], works[1]);
			} else {
				rc.dispatchWorkgroups(works[0]);
			}
		}
	}

	destroy(): void {
		if (this.pipelinectx) {
			const ufctx = this.pipelinectx.uniformCtx;
			ufctx.removeUniforms(this.uniforms);

			this.mUfValues = null;
			this.pipelinectx = null;
			this.material = null;
			this.rp = null;
			this.st = null;
			this.workcounts = null;
		}
	}
}

export { WGRCompUnit };

import { WGRUniform } from "./uniform/WGRUniform";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../cgeom/IAABB";
import { IWGRendererPass } from "../render/pipeline/IWGRendererPass";
import { WGRUnitState } from "./WGRUnitState";

class WGRUnitRunSt {
	pipeline: GPURenderPipeline;
	rc: GPURenderPassEncoder;
	gt: WGRPrimitive;
	ibuf: GPUBuffer;
	unfsuuid: string;
}

const __$urst = new WGRUnitRunSt();
const __$reust = new WGRUnitState();
class WGRUnit implements IWGRUnit {
	private mUfValues: WGRUniformValue[];
	private rf = true;

	uniforms?: WGRUniform[];

	etuuid?: string;

	pipeline: GPURenderPipeline;
	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;

	st = __$reust;

	__$rever = 0;

	enabled = true;
	passes: WGRUnit[];
	rp: IWGRendererPass;

	clone(): WGRUnit {

		const r = new WGRUnit();

		r.mUfValues			= this.mUfValues;
		r.uniforms			= this.uniforms;
		r.pipeline			= this.pipeline;
		r.pipelinectx		= this.pipelinectx;
		r.geometry			= this.geometry;
		r.passes			= this.passes;
		r.rp				= this.rp;

		return r;
	}
	getRF(): boolean {
		return this.enabled && this.st.isDrawable();
	}
	setUniformValues(values: WGRUniformValue[]): void {
		this.mUfValues = values;
	}
	runBegin(): void {
		const rc = this.rp.passEncoder;

		this.rf = this.enabled && this.rp.enabled && this.st.isDrawable();
		if (this.rf) {
			const gt = this.geometry;
			if (this.pipelinectx) {
				this.pipeline = this.pipelinectx.pipeline;
			}
			if (gt && this.pipeline) {
				// 这里面的诸多判断逻辑不应该出现，加入渲染器内部渲染流程之前必须处理好， 后续优化

				const st = __$urst;
				if (st.rc != rc) {
					st.pipeline = null;
					st.ibuf = null;
					st.gt = null;
					st.rc = rc;
					st.unfsuuid = "";
				}

				if (st.gt != gt) {
					st.gt = gt;
					gt.run(rc);
				}
				if (st.pipeline != this.pipeline) {
					st.pipeline = this.pipeline;
					// console.log("ruint setPipeline(), this.pipeline: ", this.pipeline);
					rc.setPipeline(st.pipeline);
				}

				const ufs = this.uniforms;
				if (ufs) {
					for (let i = 0, ln = ufs.length; i < ln; i++) {
						const uf = ufs[i];
						if (uf.isEnabled()) {
							// console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex);
							// console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex,",", uf.bindGroup);
							rc.setBindGroup(uf.groupIndex, uf.bindGroup);
						} else {
							this.rf = false;
						}
					}
					if (this.rf) {
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
				this.rf = false;
			}
		}
	}
	run(): void {
		if (this.rf) {
			const rc = this.rp.passEncoder;
			const gt = this.geometry;
			const st = __$urst;
			if (gt.ibuf) {
				if (st.ibuf != gt.ibuf) {
					st.ibuf = gt.ibuf;
					rc.setIndexBuffer(gt.ibuf, gt.ibuf.dataFormat);
				}
				// console.log("runit draw this.etuuid: ", this.etuuid);
				// console.log(gt.indexCount, ", gt.instanceCount: ", gt.instanceCount);
				rc.drawIndexed(gt.indexCount, gt.instanceCount);
			} else {
				rc.draw(gt.vertexCount, gt.instanceCount);
			}
		}
	}
	destroy(): void {
		if (this.pipelinectx) {
			const ufctx = this.pipelinectx.uniformCtx;
			ufctx.removeUniforms(this.uniforms);

			this.mUfValues = null;
			this.pipeline = null;
			this.pipelinectx = null;
			this.rp = null;
			this.st = null;
		}
	}
}

export { WGRUnit };

import { WGRUniform } from "./uniform/WGRUniform";
import { GPUBuffer } from "../gpu/GPUBuffer";
import { GPURenderPassEncoder } from "../gpu/GPURenderPassEncoder";
import { GPURenderPipeline } from "../gpu/GPURenderPipeline";
import { WGRPrimitive } from "./WGRPrimitive";
// import { WGRUniformValue } from "./uniform/WGRUniformValue";
import { IWGRPipelineContext } from "./pipeline/IWGRPipelineContext";
import { IWGRUnit } from "./IWGRUnit";
import IAABB from "../cgeom/IAABB";
import { IWGRendererPass } from "../render/pipeline/IWGRendererPass";
import { WGRUnitState } from "./WGRUnitState";
import { IWGMaterial } from "../material/IWGMaterial";

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
	private rf = true;

	uniforms?: WGRUniform[];

	etuuid?: string;

	pipelinectx: IWGRPipelineContext;
	geometry: WGRPrimitive;

	bounds: IAABB;

	st = __$reust;

	__$rever = 0;

	enabled = true;
	passes: IWGRUnit[];
	rp: IWGRendererPass;

	material: IWGMaterial;
	clone(): WGRUnit {

		const r = new WGRUnit();

		// r.mUfValues			= this.mUfValues;
		r.uniforms			= this.uniforms;
		r.pipelinectx		= this.pipelinectx;
		r.geometry			= this.geometry;
		r.passes			= this.passes;
		r.rp				= this.rp;

		return r;
	}
	getRF(): boolean {
		// console.log("this.st.isDrawable(): ", this.st.isDrawable());
		return this.enabled && this.st.isDrawable();
	}
	runBegin(): void {
		const rc = this.rp.passEncoder;
		const mt = this.material;
		let rf = this.enabled && this.rp.enabled && this.st.isDrawable();
		rf = rf && mt.visible && mt.instanceCount > 0;
		// console.log("rnit::runBegin(), rf: ", rf);
		if (rf) {
			const gt = this.geometry;
			const pipeline = this.pipelinectx.pipeline;
			if (gt && pipeline) {
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
				if (st.pipeline != pipeline) {
					st.pipeline = pipeline;
					// console.log("ruint setPipeline(), this.pipeline: ", this.pipeline);
					rc.setPipeline(pipeline);
				}
				gt.instanceCount = mt.instanceCount;
				// console.log("mt.instanceCount: ", mt.instanceCount);

				const ufs = this.uniforms;
				if (ufs) {
					for (let i = 0, ln = ufs.length; i < ln; i++) {
						const uf = ufs[i];
						if (uf.isEnabled()) {
							// console.log("ruint setBindGroup(), bindGroup: ", uf.bindGroup);
							// console.log("ruint setBindGroup(), bindGroup: ", uf.bindGroup, ", uf.getUid(): ", uf.getUid());
							// console.log("ruint setBindGroup(), uf.groupIndex: ", uf.groupIndex,",", uf.bindGroup);
							rc.setBindGroup(uf.groupIndex, uf.bindGroup);
							for(let j = 0, ln = uf.uvfs.length; j < ln; j++) {
								// console.log("ruint uf(",i,") setValue(), j: ", j);
								uf.setValue(uf.uvfs[j], j);
							}
						} else {
							rf = false;
						}
					}
					// if (rf) {
					// 	// first, apply shared uniform
					// 	const ufvs = this.mUfValues;
					// 	if (ufvs) {
					// 		// console.log("ufvs.length: ", ufvs.length);
					// 		console.log("################## set value begin.");
					// 		console.log("################## ufs: ", ufs);
					// 		for (let i = 0, ln = ufvs.length; i < ln; i++) {
					// 			console.log("ruint ufs setValue(), i: ", i);
					// 			ufs[ufvs[i].index].setValue(ufvs[i]);
					// 		}
					// 		console.log("################## set value end.");
					// 	}
					// }
				}
			} else {
				rf = false;
			}
		}
		this.rf = rf;
	}
	run(): void {
		if (this.rf) {
			const rc = this.rp.passEncoder;
			const gt = this.geometry;
			if (gt.ibuf) {
				const st = __$urst;
				if (st.ibuf != gt.ibuf) {
					st.ibuf = gt.ibuf;
					rc.setIndexBuffer(gt.ibuf, gt.ibuf.dataFormat);
				}
				// console.log("runit drawIndexed this.etuuid: ", this.etuuid);
				// console.log("runit drawIndexed indexCount: ", gt.indexCount, ", gt.instanceCount: ", gt.instanceCount);
				rc.drawIndexed(gt.indexCount, gt.instanceCount);
			} else {
				// console.log("runit draw(), vertexCount: ", gt.vertexCount,", instanceCount: ", gt.instanceCount);
				rc.draw(gt.vertexCount, gt.instanceCount);
			}
		}
	}

	destroy(): void {

		if (this.pipelinectx) {

			const ufctx = this.pipelinectx.uniformCtx;
			ufctx.removeUniforms(this.uniforms);

			this.pipelinectx = null;
			this.material = null;
			this.rp = null;
			this.st = null;
		}
	}
}

export { WGRUnit };

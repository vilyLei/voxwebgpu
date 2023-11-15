import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import frag1WGSL from "./shaders/screenPostEffect1.frag.wgsl";

export class ScreenPostEffect {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("ScreenPostEffect::initialize() ...");

		this.initScene();
	}

	private mColorV = { data: new Float32Array([1.0, 0.1, 0.2, 1.0]) };
	private mParamsV = { storage: { data: new Float32Array(4 * 3), stride: 4, version: 0 } };

	private initScene(): void {
		const rc = this.mRscene;

		const data = this.mParamsV.storage.data;
		data.set([1.0, 1.0, 1.0, 1.0]);
		data.set([0.5, 0.5, 512.0, 512.0], 4);

		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: {
				code: frag1WGSL,
				uuid: "frag"
			}
		};
		let uniformValues = [this.mColorV, this.mParamsV];
		let entity = new FixScreenPlaneEntity({ shaderSrc, uniformValues });
		rc.addEntity(entity);
	}

	private mTime = 0;
	run(): void {
		let vs = this.mParamsV.storage.data;
		vs[8] += 0.01;
		vs[4] = Math.cos(this.mTime) * 0.5 + 0.5;

		this.mTime += 0.01;

		this.mParamsV.storage.version++;
		this.mRscene.run();
	}
}

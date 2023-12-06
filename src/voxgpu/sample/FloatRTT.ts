import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragCalc from "./shaders/floatRTTCalc.frag.wgsl";
import fragRead from "./shaders/floatRTTRead.frag.wgsl";

const floatRTT = { diffuse: { uuid: "rtt0", rttTexture: {}, format: 'rgba16float' } };

export class FloatRTT {

	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FloatRTT::initialize() ...");

		let multisampled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });

		this.initScene();
	}

	private applyRTTPass(extent: number[]): void {
		let rs = this.mRscene;

		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: fragCalc, uuid: "calcFrag" }
		};
		const attachment = {
			texture: floatRTT,
			clearValue: [0.1, 0.1, 0.1, 1.0]
		};
		const colorAttachments = [attachment];

		let rPass = rs.createRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };

		let rttEntity = new FixScreenPlaneEntity({ extent: [-1, -1, 2, 2], textures: [diffuseTex], shaderSrc, shadinguuid: "floatRTT" });
		rPass.addEntity(rttEntity);

		shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: fragRead, uuid: "readFrag" }
		};

		// display float rtt rendering result
		extent = [-0.8, -0.8, 1.6, 1.6];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [floatRTT], shaderSrc, shadinguuid: "calcColor" });
		rs.addEntity(entity);

		// display origin image
		extent = [-0.95, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, flipY: false, textures: [diffuseTex]});
		rs.addEntity(entity);
	}
	private initScene(): void {
		this.applyRTTPass( [-1, -1, 2, 2] );
	}

	run(): void {
		this.mRscene.run();
	}
}

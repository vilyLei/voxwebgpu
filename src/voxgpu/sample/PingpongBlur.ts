import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";
import blurHWGSL from "../material/shader/wgsl/blurHTex.frag.wgsl";
// import blurVWGSL from "../material/shader/wgsl/blurVTex.frag.wgsl";

class PassGraph extends WGRPassNodeGraph {
	constructor() { super(); }
	runBegin(): void {
		super.runBegin();
	}
	run(): void {
		let pass = this.passes[0];
		for (let i = 0; i < 1; ++i) {
			pass.colorAttachments[0].clearEnabled = i < 1;
			pass.render();
		}
	}
}

export class PingpongBlur {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("PingpongBlur::initialize() ...");

		let multisampleEnabled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampleEnabled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });
		this.initEvent();
		this.initScene();
	}

	private applyBlurPass(texUUID: string, clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {

		let rs = this.mRscene;
		let rttTex = { diffuse: { uuid: texUUID, rttTexture: {} } };
		let colorAttachments = [
			{
				texture: rttTex,
				clearValue: clearColor,
				loadOp: "clear",
				storeOp: "store"
			}
		];
		let rPass = rs.renderer.appendRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };
		let shaderSrc = {
			vert: {code: vertWGSL, uuid: "vert"},
			frag: {code: blurHWGSL, uuid: "frag"}
		};
		let rttEntity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 1.6, 1.6], shaderSrc, textures: [diffuseTex] });
		// rttEntity.setColor([0.9, 0.3, 0.9]);
		rttEntity.setColor([512, 512, 1, 1]);
		rPass.addEntity( rttEntity );


		let graph = new PassGraph();
		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex] });
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		this.applyBlurPass('rtt0', [0.1, 0.1, 0.1, 1.0], [-0.8, -0.8, 1.6, 1.6]);
	}

	run(): void {
		this.mRscene.run();
	}
}
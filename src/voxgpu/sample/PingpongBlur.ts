import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
// import fragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";
import blurHWGSL from "../material/shader/wgsl/blurHTex.frag.wgsl";
import blurVWGSL from "../material/shader/wgsl/blurVTex.frag.wgsl";

class PassGraph extends WGRPassNodeGraph {
	constructor() { super(); }
	runBegin(): void {
		super.runBegin();
	}
	run(): void {

		this.rcommands = [];
		let ps = this.passes;
		
		const node = ps[0].node;

		for (let i = 0; i < 1; ++i) {
			node.colorAttachments[0].clearEnabled = i < 1;
			node.runBegin();
			node.run();
			node.runEnd();
			this.rcommands = this.rcommands.concat(node.rcommands);
		}
	}
}

export class PingpongBlur {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("PingpongBlur::initialize() ...");

		this.mRscene.initialize({ rpassparam: { multisampleEnabled: true, depthTestEnabled: false } });
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
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: blurVWGSL, uuid: "fragShdCode" }
		};
		let rttEntity = new FixScreenPlaneEntity({ extent: [-0.9, -0.9, 1.8, 1.8], shaderSrc, textures: [diffuseTex] });
		rttEntity.setColor([512, 512, 2.0, 1.0]);
		rPass.addEntity( rttEntity );


		let graph = new PassGraph();
		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex] });
		entity.uuid = 'apply-rtt-entity';
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		const rs = this.mRscene;
		this.applyBlurPass('rtt0',  [0.1, 0.1, 0.1, 1.0], [-0.9, -0.9, 1.8, 1.8]);
	}

	run(): void {
		this.mRscene.run();
	}
}

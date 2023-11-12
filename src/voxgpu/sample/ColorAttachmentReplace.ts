import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { WGRPassColorAttachment } from "../render/pipeline/WGRPassColorAttachment";

const rttTex0 = { diffuse: { uuid: 'rtt0', rttTexture: {} } };
const rttTex1 = { diffuse: { uuid: 'rtt1', rttTexture: {} } };
const attachment0 = {
	texture: rttTex0,
	clearValue: [] as ColorDataType,
	// loadOp: "clear",
	// storeOp: "store"
} as WGRPassColorAttachment;
const attachment1 = {
	texture: rttTex1,
	clearValue: [] as ColorDataType,
	loadOp: "clear",
	storeOp: "store"
} as WGRPassColorAttachment;
const colorAttachments: WGRPassColorAttachment[] = [attachment0];

class PassGraph extends WGRPassNodeGraph {
	private mTimes = 0;
	constructor() { super(); }
	runBegin(): void {
		super.runBegin();
	}
	run(): void {
		this.mTimes++;
		if (this.mTimes == 50) {
			const replaceColorAttachment = true;
			if (replaceColorAttachment) {
				// replace color attachment
				attachment1.clearValue = [0.2, 0.5, 0.2];
				colorAttachments[0] = attachment1;
			} else {
				// replace texture
				colorAttachments[0].texture = rttTex1;
			}
		}
		let pass = this.passes[0];
		for (let i = 0; i < 1; ++i) {
			pass.colorAttachments[0].clearEnabled = i < 1;
			pass.render();
		}
	}
}

export class ColorAttachmentReplace {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("ColorAttachmentReplace::initialize() ...");

		let multisampleEnabled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampleEnabled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });
		this.initEvent();
		this.initScene();
	}

	private mGraph = new PassGraph();
	private applyRTTPass(clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {

		let rs = this.mRscene;

		const graph = this.mGraph;

		attachment0.clearValue = clearColor;
		attachment1.clearValue = clearColor;


		let rPass = rs.renderer.appendRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };
		let rttEntity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 1.6, 1.6], textures: [diffuseTex] });
		rPass.addEntity(rttEntity);

		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex0] });
		rs.addEntity(entity);

		extent = [-0.9, -0.9, 1.2, 1.2];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex1] });
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		this.applyRTTPass([0.1, 0.1, 0.1, 1.0], [-0.8, -0.8, 1.6, 1.6]);
	}

	run(): void {
		this.mRscene.run();
	}
}
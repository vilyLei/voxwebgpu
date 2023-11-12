import MouseEvent from "../event/MouseEvent";
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

	private rttTex0 = { diffuse: { uuid: 'rtt0', rttTexture: {} } };
	private rttTex1 = { diffuse: { uuid: 'rtt1', rttTexture: {} } };
	private attachment0 = {
		texture: this.rttTex0,
		clearValue: [] as ColorDataType,
		loadOp: "clear",
		storeOp: "store"
	};
	private attachment1 = {
		texture: this.rttTex1,
		clearValue: [] as ColorDataType,
		loadOp: "clear",
		storeOp: "store"
	};
	private colorAttachments = [
		this.attachment0
	];
	private applyBlurPass(clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {
		
		const colorAttachments = this.colorAttachments;

		this.attachment0.clearValue = clearColor;
		this.attachment1.clearValue = clearColor;

		let rs = this.mRscene;
		let rPass = rs.renderer.appendRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };
		let shaderSrc = {
			vert: {code: vertWGSL, uuid: "vert"},
			frag: {code: blurHWGSL, uuid: "frag"}
		};
		let rttEntity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 1.6, 1.6], shaderSrc, textures: [diffuseTex] });
		// let rttEntity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 1.6, 1.6], textures: [diffuseTex] });
		// rttEntity.setColor([0.9, 0.3, 0.9]);
		rttEntity.setColor([512, 512, 2]);
		rPass.addEntity( rttEntity );


		let graph = new PassGraph();
		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [this.rttTex0] });
		rs.addEntity(entity);

		extent = [-0.9, -0.9, 1.2, 1.2];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [this.rttTex1] });
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		rs.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {
		console.log("mouse down .....");
		this.colorAttachments[0] = this.attachment1;
	}
	private initScene(): void {

		this.applyBlurPass([0.1, 0.1, 0.1, 1.0], [-0.8, -0.8, 1.6, 1.6]);
	}

	run(): void {
		this.mRscene.run();
	}
}
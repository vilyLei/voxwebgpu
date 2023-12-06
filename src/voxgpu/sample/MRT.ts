import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { MouseInteraction } from "../ui/MouseInteraction";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";

import vertMRT from "./shaders/floatAndColorMRT.vert.wgsl";
import fragMRT from "./shaders/floatAndColorMRT.frag.wgsl";
import fragReadNormal from "./shaders/floatNormalRead.frag.wgsl";

import { TorusEntity } from "../entity/TorusEntity";

const colorRTTTex = { diffuse: { uuid: "colorRTT", rttTexture: {} } };
const albedoRTTTex = { diffuse: { uuid: "albedoRTT", rttTexture: {} } };
const floatRTTTex = { diffuse: { uuid: "floatRTT", rttTexture: {}, format: 'rgba16float' } };

export class MRT {

	private mRscene = new RendererScene();

	initialize(): void {
		console.log("MRT::initialize() ...");

		let multisampled = true;
		let depthTestEnabled = true;
		let rpassparam = { multisampled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });

		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mFlag = 6;
	private mouseDown = (evt: MouseEvent): void => {
		this.mFlag = 1;
	}

	private applyMRTPass(extent: number[]): void {
		let rs = this.mRscene;

		const attachment0 = {
			texture: colorRTTTex,
			clearValue: [0.15, 0.15, 0.15, 1.0]
		};
		const attachment1 = {
			texture: albedoRTTTex,
			clearValue: [0.15, 0.25, 0.25, 1.0]
		};
		const attachment2 = {
			texture: floatRTTTex,
			clearValue: [0.2, 0.25, 0.2, 1.0]
		};

		const colorAttachments = [attachment0, attachment1, attachment2];

		let rPass = rs.createRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };

		let shaderSrc = {
			vert: { code: vertMRT, uuid: "vertMRT" },
			frag: { code: fragMRT, uuid: "fragMRT" }
		};

		let uniformValues = [{ data: new Float32Array([1,1,1,1]) }];
		let torus = new TorusEntity({shaderSrc, textures: [diffuseTex], uniformValues});
		rPass.addEntity(torus);

		// display rendering result
		extent = [-0.8, -0.8, 1.6, 1.6];
		let entity = new FixScreenPlaneEntity({ extent, textures: [colorRTTTex] });
		rs.addEntity(entity);

		shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: fragReadNormal, uuid: "readNromal" }
		};
		// display normal drawing result
		extent = [-0.7, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, textures: [floatRTTTex], shaderSrc, shadinguuid: "readNromal" });
		rs.addEntity(entity);

		// display albedo drawing result
		extent = [0.1, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, textures: [albedoRTTTex] });
		rs.addEntity(entity);
	}
	private initScene(): void {
		this.applyMRTPass( [-1, -1, 2, 2] );
	}
	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "./shaders/screenPostEffect.frag.wgsl";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";

export class ScreenPostEffect {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("ScreenPostEffect::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	private mColorV = new WGRUniformValue({ data: new Float32Array([1.0, 0.1, 0.2, 1.0]) });
	private mParamsV = new WGRStorageValue({ data: new Float32Array(4 * 3) });
	private initScene(): void {
		const rc = this.mRscene;

		this.mParamsV.arrayStride = 16;
		let param0 = this.mParamsV.data as Float32Array;
		param0.set([1.0, 1.0, 1.0, 1.0]);
		param0.set([0.5, 0.5, 0.0, 0.0], 4);

		let shaderSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vert-screenPostEffect" },
			fragShaderSrc: {
				code: fragWGSL,
				uuid: "frag-screenPostEffect"
			}
		};
		let uniformValues: WGRUniformValue[] = [this.mColorV, this.mParamsV];
		let entity = new FixScreenPlaneEntity({ shaderSrc, uniformValues });
		rc.addEntity(entity);
	}

	private mTime = 0;
	run(): void {

		let vs = this.mParamsV.data as Float32Array;
		vs[8] += 0.01;
		vs[4] = Math.cos(this.mTime) * 0.5 + 0.5;

		this.mTime += 0.01;

		this.mParamsV.upate();
		this.mRscene.run();
	}
}

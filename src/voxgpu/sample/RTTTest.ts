import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import MouseEvent from "../event/MouseEvent";
export class RTTTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("RTTTest::initialize() ...");

		this.applyRTT();
		this.initScene();
		this.initEvent();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
	}
	private mFlag = 0;
	private mouseDown = (evt: MouseEvent): void => {
		this.mFlag = 1;
	}
	private applyRTT(): void {

		let rc = this.mRscene;

		// rtt texture proxy descriptor
		let rttTex = { uuid: "rtt0", rttTexture: {}, shdVarName: 'rtt' };
		// define a rtt pass color colorAttachment0
		let colorAttachments = [
			{
				texture: rttTex,
				// green clear background color
				clearValue: { r: 0.1, g: 0.9, b: 0.1, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			}
		];
		// create a separate rtt rendering pass
		let multisampleEnabled = true;
		let rPass = rc.createRTTPass({ colorAttachments, multisampleEnabled });

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		let extent = [-0.5, -0.5, 0.8, 0.8];
		let rttEntity = new FixScreenPlaneEntity({ extent, textures: [diffuseTex] }).setColor([1.0, 0.0, 0.0]);
		// 往pass中添加可渲染对象
		rPass.addEntity(rttEntity);

		// // 使用rtt纹理
		extent = [0.3, 0.3, 0.6, 0.6];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: rttTex }] });
		rc.addEntity(entity);
	}
	private initScene(): void {
		const rc = this.mRscene;

		// const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		// let extent = [-0.9, 0.0, 0.5, 0.5];
		// let entity = new FixScreenPlaneEntity({ extent }).setColor([0.2, 0.5, 0.7]);
		// rc.addEntity(entity);

		// extent = [-0.8, -0.8, 0.8, 0.8];
		// entity = new FixScreenPlaneEntity({ extent, textures: [diffuseTex] }).setColor([0.1, 0.3, 0.9]);
		// rc.addEntity(entity);
	}

	run(): void {
		if(this.mFlag < 0) {
			return;
		}
		this.mFlag --;

		this.mRscene.run();
	}
}

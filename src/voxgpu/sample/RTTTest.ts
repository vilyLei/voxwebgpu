import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class RTTTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("RTTTest::initialize() ...");

		this.applyRTT();
		this.initScene();
	}
	private applyRTT(): void {

		let rc = this.mRscene;

		// rtt texture proxy descriptor
		let rttTex = { uuid: "rtt0", rttTexture: {} };
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
		let rPass = rc.createRTTPass({ colorAttachments });

		// 使用rtt纹理
		let extent = [0.3, 0.3, 0.6, 0.6];
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [{ diffuse: rttTex }] });
		rc.addEntity(entity);

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		extent = [-0.5, -0.5, 0.8, 0.8];
		let rttEntity = new FixScreenPlaneEntity({ extent, textures: [diffuseTex] }).setColor([1.0, 0.0, 0.0]);
		rPass.addEntity(rttEntity);
	}
	private initScene(): void {
		const rc = this.mRscene;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };
		let extent = [-0.9, 0.0, 0.5, 0.5];
		let entity = new FixScreenPlaneEntity({ extent }).setColor([0.2, 0.5, 0.7]);
		rc.addEntity(entity);

		extent = [-0.8, -0.8, 0.8, 0.8];
		entity = new FixScreenPlaneEntity({ extent, textures: [diffuseTex] }).setColor([0.1, 0.3, 0.9]);
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}
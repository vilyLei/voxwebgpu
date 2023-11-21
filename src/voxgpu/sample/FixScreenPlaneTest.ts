import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class FixScreenPlaneTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FixScreenPlaneTest::initialize() ...");
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	private initScene(): void {
		const rc = this.mRscene;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		let entity = new FixScreenPlaneEntity().setColor([0.2, 0.5, 0.7]);
		rc.addEntity(entity);

		entity = new FixScreenPlaneEntity({ extent: [-0.8, 0.1, 0.5, 0.5] }).setColor([0.2, 0.8, 0.3]);
		rc.addEntity(entity);

		entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [diffuseTex] });
		entity.uvScale = [2, 2];
		entity.uvOffset = [0.2, 0.3];
		entity.setColor([0.1, 0.3, 0.9]);
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}

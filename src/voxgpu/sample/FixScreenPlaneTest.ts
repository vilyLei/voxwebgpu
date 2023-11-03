import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class FixScreenPlaneTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FixScreenPlaneTest::initialize() ...");

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
	private mouseDown = (evt: MouseEvent): void => {
	}
	private initScene(): void {

		const rc = this.mRscene;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		let entity = new FixScreenPlaneEntity();
		entity.setColor(new Color4(0.2,0.5,0.7));
		rc.addEntity(entity);

		let x = -0.8;
		let y = 0.1;
		let width = 0.5;
		let height = 0.5;
		entity = new FixScreenPlaneEntity({x, y, width, height});
		entity.setColor(new Color4(0.2,0.8,0.3));
		rc.addEntity(entity);

		x = -0.8;
		y = -0.8;
		width = 0.8;
		height = 0.8;
		entity = new FixScreenPlaneEntity({x, y, width, height, textures: [diffuseTex]});
		entity.setColor(new Color4(0.1,0.3,0.9));
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}

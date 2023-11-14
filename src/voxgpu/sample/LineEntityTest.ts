import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { Line3DEntity } from "../entity/Line3DEntity";
import Vector3 from "../math/Vector3";
import Color4 from "../material/Color4";

export class LineEntityTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("LineEntityTest::initialize() ...");
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
		const rsc = this.mRscene;

		let linePositions = [new Vector3(), new Vector3(-100), new Vector3(-150, -180), new Vector3(-150, -180, -100)];
		let line = new Line3DEntity({linePositions});
		line.setColor([1.0,0.0,0.0]);
		rsc.addEntity( line );

		linePositions = [new Vector3(), new Vector3(100), new Vector3(150, 180), new Vector3(150, 180, 100)];
		let lineColors = [new Color4(1.0), new Color4(0.0,1.0), new Color4(0.0,0.0,1.0), new Color4(1.0,0.0,1.0)];
		let colorLine = new Line3DEntity({linePositions, lineColors});
		rsc.addEntity( colorLine );
	}

	run(): void {
		this.mRscene.run();
	}
}

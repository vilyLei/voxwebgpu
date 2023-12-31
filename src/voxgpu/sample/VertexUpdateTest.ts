import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { PlaneEntity } from "../entity/PlaneEntity";

export class VertexUpdateTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("VertexUpdateTest::initialize() ...");
		this.mRscene.initialize({
			canvasWith: 512,
			canvasHeight: 512,
			rpassparam:
			{
				multisampled: true
			}
		});
		this.initScene();
		this.initEvent();
	}
	private mPlane: PlaneEntity;
	private initScene(): void {

		let rc = this.mRscene;

		let plane = new PlaneEntity({
			axisType: 1,
			geometryDynamic: true,
			extent: [-600, -600, 1200, 1200]
		});
		this.mPlane = plane;
		rc.addEntity(plane);
	}
	
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {
		
		let geom = this.mPlane.geometry;
		let attrib = geom.getAttribDataWithTypeName('position');
		
		let vs = attrib.data as Float32Array;
		vs[0] -= 100;
		attrib.update();
	};
	run(): void {
		this.mRscene.run();
	}
}

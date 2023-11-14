import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { SphereEntity } from "../entity/SphereEntity";
import { Line3DEntity } from "../entity/Line3DEntity";
import Vector3 from "../math/Vector3";

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

		// const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		// let entities: PrimitiveEntity[] = [
		// 	new SphereEntity()
		// ];

		// for (let i = 0; i < entities.length; ++i) {

		// 	let entity = entities[i]
		// 		.setAlbedo(new Color4().randomRGB(1.5, 0.1))
		// 		.setARM(1.1, Math.random() * 0.95 + 0.05, Math.random() * 0.9 + 0.1);

		// 	entity.transform.setXYZ(-100 + i * 200, 0, 0);
		// 	rc.addEntity(entity);
		// }
		// let sph = new SphereEntity();
		// rsc.addEntity( sph );
		let linePositions = [new Vector3(), new Vector3(100), new Vector3(150, 180), new Vector3(150, 180, 100)];
		let line = new Line3DEntity({linePositions});
		line.setColor([1.0,0.0,0.0]);
		rsc.addEntity( line );
	}

	run(): void {
		this.mRscene.run();
	}
}

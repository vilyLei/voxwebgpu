import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Vector3 from "../math/Vector3";
import { AxisEntity } from "../entity/AxisEntity";
import { BoundsFrameEntity } from "../entity/BoundsFrameEntity";
import { SphereEntity } from "../entity/SphereEntity";
import Camera from "../view/Camera";
import { BoxEntity } from "../entity/BoxEntity";
import OBB from "../cgeom/OBB";
import { RectLineGridEntity } from "../entity/RectLineGridEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { createLineCircleXOZ, Line3DEntity } from "../entity/Line3DEntity";

export class LineObjectTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("LineObjectTest::initialize() ...");
		document.oncontextmenu = function (e) {
			e.preventDefault();
		}
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private testOBB(): void {
		const rsc = this.mRscene;

		let box = new BoxEntity();
		box.setColor([0.8, 0.2, 0.6]);
		box.transform.setRotationXYZ(70,150,0);
		box.transform.setXYZ(100, 100, 500);
		rsc.addEntity( box );

		let obb = new OBB();
		obb.fromAABB(box.getLocalBounds(), box.transform.getMatrix());

		let boxFrame = new BoundsFrameEntity({obb, obbFrameScale: 1.01});
		boxFrame.setColor([0.1, 0.8, 0.7]);
		rsc.addEntity( boxFrame );
	}
	private testFrustumFrame( ): void {

		const cam = new Camera({eye: new Vector3(500, 500, -300), near: 50, far: 200});
		const rsc = this.mRscene;
		let boxFrame = new BoundsFrameEntity({posList8: cam.getWordFrustumVtxArr(), frameColor: [0.3, 0.7, 0.2]});
		rsc.addEntity( boxFrame );
	}
	private mouseDown = (evt: MouseEvent): void => {};

	private createCurve(): void {
		const rsc = this.mRscene;

		let total = 100;
		let linePositions = new Array(total);
		let lineColors = new Array(total);
		for(let i = 0; i < total; ++i) {
			const factor = Math.sin(20.0 * i / total);
			linePositions[i] = [350, factor * 100 + 100 , -300 + i * 10.0];
			lineColors[i] = [factor * 0.5 + 0.5, 1.0 - (factor * 0.5 + 0.5), 1.0];
		}
		let line = new Line3DEntity({linePositions, lineColors});
		rsc.addEntity( line );

		let circleLine = createLineCircleXOZ( 100 );
		circleLine.transform.setY(100.0);
		circleLine.color = [0.1, 0.5, 1.0];
		rsc.addEntity( circleLine );

	}
	private initScene(): void {
		const rsc = this.mRscene;
		this.createCurve();

		let gridPlane = new RectLineGridEntity();
		gridPlane.color = [0.2, 0.3, 0.1];
		rsc.addEntity( gridPlane );

		let axis = new AxisEntity({axisLength: 300});
		axis.transform.setY(1.5);
		rsc.addEntity( axis );

		this.testOBB();
		this.testFrustumFrame();

		let sph = new SphereEntity();
		sph.transform.setXYZ(-200, 200, -300);
		rsc.addEntity( sph );
		let boxFrame = new BoundsFrameEntity({bounds: sph.getGlobalBounds()});
		rsc.addEntity( boxFrame );

		let tor = new TorusEntity();
		tor.color = [0.1, 0.8, 0.3];
		tor.transform.setXYZ(-300, 200, 300);
		tor.transform.setRotationXYZ(60, 130, 70);
		rsc.addEntity( tor );
		boxFrame = new BoundsFrameEntity({bounds: tor.getGlobalBounds()});
		rsc.addEntity( boxFrame );
		let obb = new OBB();
		obb.fromAABB(tor.getLocalBounds(), tor.transform.getMatrix());
		boxFrame = new BoundsFrameEntity({obb, obbFrameScale: 1.01});
		boxFrame.color = [0.6, 0.8, 0.3];
		rsc.addEntity( boxFrame );

		boxFrame = new BoundsFrameEntity({minPos: new Vector3(200, 200, 400), maxPos: new Vector3(300, 300, 450)});
		boxFrame.color = [1.0, 0.2, 0.6];
		rsc.addEntity( boxFrame );

	}

	run(): void {
		this.mRscene.run();
	}
}

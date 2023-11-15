import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { SphereEntity } from "../entity/SphereEntity";
import { BoxEntity } from "../entity/BoxEntity";
import { CylinderEntity } from "../entity/CylinderEntity";
import { CubeEntity } from "../entity/CubeEntity";
import { TorusEntity } from "../entity/TorusEntity";
import { PlaneEntity } from "../entity/PlaneEntity";
import { PrimitiveEntity } from "../entity/PrimitiveEntity";
import { ConeEntity } from "../entity/ConeEntity";
import { AxisEntity } from "../entity/AxisEntity";
import Vector3 from "../math/Vector3";

export class PrimitiveEntityTest {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("PrimitiveEntityTest::initialize() ...");
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

		let axis = new AxisEntity();
		rc.addEntity( axis );

		let entities = [
			new SphereEntity(),
			new BoxEntity(),
			new CylinderEntity({alignYRatio : 0.0}),
			new CubeEntity({cubeSize: 130}),
			new TorusEntity({radius: 110, axisType: 1}),
			new PlaneEntity({axisType: 1, extent: [-80, -80, 160, 160], doubleFace: true}),
			new ConeEntity({alignYRatio : 0.0})
		];
		let ls = entities;
		entities = [];
		for (let i = 0, ln = ls.length; i < ln; ++i) {
			const k = Math.round(Math.random() * 888)%ls.length;
			const t = ls[k];
			entities.push(ls[k]);
			ls.splice(k,1);
		}
		let radius = 350.0;
		for (let i = 0; i < entities.length; ++i) {
			let rad = 2.0 * Math.PI * i / entities.length;
			let pos = new Vector3(radius * Math.cos(rad), 0, radius * Math.sin(rad));

			let entity = entities[i]
				.setAlbedo(new Color4().randomRGB(1.5, 0.1))
				.setARM(1.1, Math.random() * 0.95 + 0.05, Math.random() * 0.9 + 0.1);
			entity.transform.setPosition( pos );
			rc.addEntity(entity);
		}
	}

	run(): void {
		this.mRscene.run();
	}
}

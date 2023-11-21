import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

import { AxisEntity } from "../entity/AxisEntity";
import { BillboardEntity } from "../entity/BillboardEntity";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
export class BillboardEntityTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("BillboardEntityTest::initialize() ...");

		this.mRscene.initialize({ canvasWith: 512, canvasHeight: 512, rpassparam: { multisampleEnabled: true } });
		this.initScene();
		this.initEvent();
	}
	private initScene(): void {
		this.initEntities();
	}
	private initEntities(): void {
		let rc = this.mRscene;

		let diffuseTex0 = { diffuse: { url: "static/assets/flare_core_02.jpg" } };

		let entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 1.6, 1.6], textures: [diffuseTex0] });
		entity.color = [0.1, 0.3, 0.5];
		rc.addEntity(entity);

		rc.addEntity(new AxisEntity());

		for (let i = 0; i < 10; ++i) {

			let billboard = new BillboardEntity({ textures: [diffuseTex0] });
			billboard.color = [0.5, 0.5, 2];
			billboard.scale = Math.random() * 2 + 1;
			billboard.transform.setPosition([Math.random() * 1000 - 500, 0, 0]);
			rc.addEntity(billboard);

			let diffuseTex1 = { diffuse: { url: "static/assets/testEFT4_01.jpg", flipY: true } };

			billboard = new BillboardEntity({ textures: [diffuseTex1] });
			billboard.color = [1.8, 1.5, 0.5];
			// billboard.color = [0.8, 0.5, 0.5];
			billboard.scale = Math.random() * 2 + 1;
			billboard.uvScale = [0.5, 0.5];
			billboard.uvOffset = [1, 1];
			// billboard.uvOffset = [0.5, 1];
			billboard.transform.setPosition([0, Math.random() * 1000 - 500, 0]);
			rc.addEntity(billboard);
		}
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	run(): void {
		this.mRscene.run();
	}
}

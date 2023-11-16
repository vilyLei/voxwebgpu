import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

import { CoGeomDataType, CoModelTeamLoader } from "../../voxlib/cospace/app/common/CoModelTeamLoader";
import { WGGeometry } from "../geometry/WGGeometry";
import { PrimitiveEntity } from "../entity/PrimitiveEntity";
import Color4 from "../material/Color4";

export class ModelLoadTest {
	private mRscene = new RendererScene();
	private mTeamLoader = new CoModelTeamLoader();
	initialize(): void {
		console.log("ModelLoadTest::initialize() ...");
		this.initEvent();
		this.initModels();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private createGeometry(gd: CoGeomDataType, normalEnabled = false): WGGeometry {
		const geometry = new WGGeometry()
			.addAttribute({ position: gd.vertices })
			.addAttribute({ uv: gd.uvsList[0] })
			.setIndices(gd.indices);
		if (normalEnabled) {
			geometry.addAttribute({ normal: gd.normals });
		}
		return geometry;
	}
	private initModels(): void {

		let url0 = "static/assets/fbx/mat_ball.fbx";
		let loader = this.mTeamLoader;

		loader.load([url0], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			console.log("loaded models: ", models);
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i]);
			}
		});
	}
	private mouseDown = (evt: MouseEvent): void => { };

	private createEntity(model: CoGeomDataType): void {
		const rc = this.mRscene;
		const geometry = this.createGeometry(model, true);
		let entity = new PrimitiveEntity({ geometry })
		.setAlbedo(new Color4().randomRGB(1.5, 0.1))
		.setARM([1.1, Math.random() * 0.95 + 0.05, Math.random() * 0.9 + 0.1]);
		rc.addEntity( entity );
	}
	run(): void {
		this.mRscene.run();
	}
}

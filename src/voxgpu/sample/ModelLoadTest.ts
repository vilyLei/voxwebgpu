import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

import { CoGeomDataType, CoModelTeamLoader } from "../../voxlib/cospace/app/common/CoModelTeamLoader";
import { WGGeometry } from "../geometry/WGGeometry";

export class ModelLoadTest {
	private mRscene = new RendererScene();
	private mTeamLoader = new CoModelTeamLoader();
	initialize(): void {
		console.log("ModelLoadTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initEvent();
		this.initModels();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private createGeom(rgd: CoGeomDataType, normalEnabled = false): WGGeometry {
		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vertices })
			.addAttribute({ uv: rgd.uvsList[0] })
			.setIndices(rgd.indices);
		if (normalEnabled) {
			geometry.addAttribute({ normal: rgd.normals });
		}
		return geometry;
	}
	private initModels(): void {

		let url0 = "static/assets/fbx/mat_ball.fbx";
		let loader = this.mTeamLoader;

		loader.load([url0], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			console.log("loaded models: ", models);

			this.initScene();
		});
	}
	private mouseDown = (evt: MouseEvent): void => { };

	private initScene(): void {
		const rc = this.mRscene;

	}
	run(): void {
		this.mRscene.run();
	}
}

import { MouseInteraction } from "../ui/MouseInteraction";
import { DataDrivenRScene } from "../rscene/DataDrivenRScene";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";

export class DataDrivenTest {

	private mScene = new DataDrivenRScene();
	initialize(): void {
		console.log("DataDrivenTest::initialize() ...");

		let url = "static/assets/scene/sceneData01.json";

		new HttpFileLoader().load(
			url,
			(json: object, url: string): void => {
				console.log("json: ", json);
				this.initScene(json);
			},
			null,
			null,
			"json"
		);
	}
	private initScene(json: object): void {
		this.mScene.initialize(json);
		this.initEvent();
	}
	private initEvent(): void {
		const rc = this.mScene;
		new MouseInteraction().initialize(rc.rscene, 0, false).setAutoRunning(true);
	}
	run(): void {
		this.mScene.run();
	}
}

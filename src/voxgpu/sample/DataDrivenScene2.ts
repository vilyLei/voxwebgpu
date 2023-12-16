import { MouseInteraction } from "../ui/MouseInteraction";
import { DataDrivenRScene } from "../rscene/DataDrivenRScene";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";

export class DataDrivenScene2 {

	private mScene = new DataDrivenRScene();
	initialize(): void {
		console.log("DataDrivenScene2::initialize() ...");

		let url = "static/assets/scene/sceneData02.json";

		new HttpFileLoader().loadJson(
			url,
			(json: object, url: string): void => {
				console.log("json: ", json);
				this.initScene(json);
			}
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

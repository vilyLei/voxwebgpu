import { MouseInteraction } from "../ui/MouseInteraction";
import { DataDrivenRScene } from "../rscene/DataDrivenRScene";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";

const sceneData = `
{
	renderer: {
		camera: { eye: [1100, 1100, 500], up: [0, 1, 0] }
	},
	entities: [
		{ axis: { entity: { size: 500 } } },
		{ sphere: { entity: { radius: 80, transform: { position: [0, 0, 200] }, albedo: [0.9, 0.1, 0.02], arm: { a: 1.0, r: 0.2, m: 0 } } } },
		{
			cube: {
				entity: {
					size: 80,
					transform: { position: [200, 0, 0], scale: [2, 1.5, 3], rotation: [-190, 0, 200] },
					albedo: [0.1, 0.9, 0.02],
					arm: { a: 1.0, r: 0.2, m: 0 },
					animate: {}
				}
			}
		},
		{
			torus: {
				entity: {
					radius: 90,
					axisType: 1,
					longitudeNumSegments: 20,
					latitudeNumSegments: 50,
					transform: { position: [0, 150, 0] },
					albedo: [0.9, 0.1, 0.7],
					arm: { a: 1.0, r: 0.3, m: 0 }
				}
			}
		},
		{
			model: {
				entity: {
					url: "static/assets/fbx/monkey.fbx",
					transform: { position: [0, 320, 0], scale: [100, 100, 100], rotation: [-90, 90, 0] },
					albedo: [0.1, 0.7, 0.9],
					arm: [1, 0.3, 0.1]
				}
			}
		},
		{
			boundsFrame: {
				entity: {
					minPos: [-300, -300, -300],
					maxPos: [300, 300, 300],
					frameColor: [0.9, 1.0, 0.1]
				}
			}
		}
	]
}`;
class DataDrivenTest {
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

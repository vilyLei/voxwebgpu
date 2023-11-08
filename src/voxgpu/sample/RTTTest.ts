import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";

export class RTTTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("RTTTest::initialize() ...");

		this.mRscene.initialize({rpassparam: {multisampleEnabled: true, depthTestEnabled: false}});
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mRPass: IWGRPassRef;
	private mouseDown = (evt: MouseEvent): void => {
		let node = this.mRPass.node;
		console.log("mousedown evt call this.mRPass: ", this.mRPass);
		console.log("mousedown evt call AAAA node: ", node);
		console.log("mousedown evt call node.enabled: ", node.enabled);
		node.enabled = !node.enabled;
		console.log("mousedown evt call BBBB node: ", node);
	}
	private initScene(): void {

		const rc = this.mRscene;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		let x = -0.6;
		let y = -0.6;
		let width = 1.2;
		let height = 1.2;
		let entity = new FixScreenPlaneEntity({x, y, width, height});
		entity.setColor(new Color4(0.2,0.5,0.7));
		rc.addEntity(entity);

		///*
		let rPass = rc.renderer.appendRendererPass();
		this.mRPass = rPass;
		// x = -0.8;
		// y = 0.1;
		// width = 0.5;
		// height = 0.5;
		// entity = new FixScreenPlaneEntity({x, y, width, height});
		// entity.setColor(new Color4(0.2,0.8,0.3));
		// rc.addEntity(entity);

		x = -0.8;
		y = -0.8;
		width = 0.8;
		height = 0.8;
		entity = new FixScreenPlaneEntity({x, y, width, height, textures: [diffuseTex], rpasses:[{rpass: rPass}]});
		entity.setColor(new Color4(0.1,0.3,0.9));
		rc.addEntity(entity);
		//*/
	}

	run(): void {
		this.mRscene.run();
	}
}

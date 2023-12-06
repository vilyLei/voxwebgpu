import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class RTTFixScreenTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("RTTFixScreenTest::initialize() ...");

		let rc = this.mRscene;
		/*
		let callback = (): void => {
			console.log("ready create a rpass.");
			let wg = rc.getWGCtx();
			// let rtt0 = wg.texture.createColorRTTTexture();
			// let rtt0View = rtt0.createView();
			// let rttTex = {diffuse: {uuid:'rtt0', rttTexture: {texture: rtt0}}}
			let rttTex = {diffuse: {uuid:'rtt0', rttTexture: {}}}
			let colorAttachments = [
				{
					// view: rtt0View,
					texture: rttTex,

					clearValue: { r: 0.1, g: 0.5, b: 0.1, a: 1.0 },
					loadOp: 'clear',
					storeOp: 'store',
				  }
			];
			let rPass = rc.renderer.appendRendererPass({separate: true, colorAttachments});
			this.mRPass = rPass;

			const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

			let x = -0.5;
			let y = -0.5;
			let width = 0.8;
			let height = 0.8;

			let rttEntity = new FixScreenPlaneEntity({x, y, width, height, textures: [diffuseTex]});
			rttEntity.setColor(new Color4(1.0, 0.3,0.9));
			rPass.node.addEntity(rttEntity);

			// let // entity = new FixScreenPlaneEntity({x, y, width, height, textures: [diffuseTex], rpasses:[{rpass: rPass}]});
			let entity = new FixScreenPlaneEntity({x, y, width, height, textures: [rttTex]});
			entity.setColor(new Color4(1.0, 0.3,0.9));
			rc.addEntity(entity);
		}
		this.mRscene.initialize({rpassparam: {multisampled: true, depthTestEnabled: false}, callback});
		//*/
		this.mRscene.initialize({ rpassparam: { multisampled: true, depthTestEnabled: false } });
		this.initEvent();
		this.applyRTT();
		this.initScene();
	}
	private applyRTT(): void {
		let rc = this.mRscene;
		let rttTex = { diffuse: { uuid: "rtt0", rttTexture: {} } };
		let colorAttachments = [
			{
				texture: rttTex,

				clearValue: { r: 0.1, g: 0.5, b: 0.1, a: 1.0 },
				loadOp: "clear",
				storeOp: "store"
			}
		];
		let rPass = rc.renderer.appendRenderPass( { separate: true, colorAttachments } );

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		let x = -0.5;
		let y = -0.5;
		let width = 0.8;
		let height = 0.8;

		let rttEntity = new FixScreenPlaneEntity({ x, y, width, height, textures: [diffuseTex] });
		rttEntity.setColor(new Color4(1.0, 0.3, 0.9));
		rttEntity.uuid = 'rtt-entity'
		rPass.node.addEntity(rttEntity);

		x = 0.3;
		y = 0.3;
		width = 0.6;
		height = 0.6;
		let entity = new FixScreenPlaneEntity({ x, y, width, flipY: true, height, textures: [rttTex] });
		entity.setColor(new Color4(1.0, 0.3, 0.9));
		entity.uuid = 'apply-rtt-entity';
		rc.addEntity(entity);
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mFlag = 6;
	private mouseDown = (evt: MouseEvent): void => {
		// let node = this.mRPass.node;
		// console.log("mousedown evt call this.mRPass: ", this.mRPass);
		// console.log("mousedown evt call AAAA node: ", node);
		// console.log("mousedown evt call node.enabled: ", node.enabled);
		// node.enabled = !node.enabled;
		// console.log("mousedown evt call BBBB node: ", node);
		this.mFlag = 1;
	};
	private initScene(): void {
		const rc = this.mRscene;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		let x = -0.9;
		let y = 0.0;
		let width = 0.5;
		let height = 0.5;
		let entity = new FixScreenPlaneEntity({ x, y, width, height });
		entity.setColor(new Color4(0.2, 0.5, 0.7));
		entity.uuid = 'color-entity';
		rc.addEntity(entity);

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
		// entity = new FixScreenPlaneEntity({x, y, width, height, textures: [diffuseTex], rpasses:[{rpass: rPass}]});
		entity = new FixScreenPlaneEntity({ x, y, width, height, textures: [diffuseTex] });
		entity.setColor(new Color4(0.1, 0.3, 0.9));
		rc.addEntity(entity);
		//*/
	}

	run(): void {
		// console.log(">>> >>> >>> begin ...");
		// if(this.mFlag < 0) {
		// 	return;
		// }
		// this.mFlag --;
		this.mRscene.run();
		// console.log(">>> >>> >>> end ...");
	}
}

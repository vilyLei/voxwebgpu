import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class AddEntityIntoMultiRPasses {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("AddEntityIntoMultiRPasses::initialize() ...");

		this.mRscene.initialize({ rpassparam: { multisampleEnabled: true, depthTestEnabled: false } });
		this.initEvent();
		this.initScene();
	}

	private applyNewRPass(texUUID: string, pentity: FixScreenPlaneEntity, clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {

		let rc = this.mRscene;
		let rttTex = { diffuse: { uuid: texUUID , rttTexture: {} } };
		let colorAttachments = [
			{
				texture: rttTex,
				clearValue: clearColor,
				loadOp: "clear",
				storeOp: "store"
			}
		];
		let rPass = rc.renderer.appendRenderPass( { separate: true, colorAttachments } );

		rPass.node.addEntity(pentity);
		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex] });
		entity.setColor([0.7, 0.5, 0.5]);
		entity.uuid = 'apply-rtt-entity';
		rc.addEntity(entity);
	}
	private initEvent(): void {
		const rc = this.mRscene;
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		const rc = this.mRscene;
		let entity: FixScreenPlaneEntity;

		const diffuseTex = { diffuse: { url: "static/assets/default.jpg", flipY: true } };

		entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [diffuseTex] });
		entity.setColor([0.9, 0.3, 0.9]);
		entity.uuid = "pl-0";
		rc.addEntity(entity);

		this.applyNewRPass( 'rtt0', entity, [0.1, 0.5, 0.9, 1.0] );
		this.applyNewRPass( 'rtt1', entity, [0.3, 0.5, 0.1, 1.0], [-0.2, 0.3, 0.5, 0.5] );
		this.applyNewRPass( 'rtt2', entity, [0.3, 0.5, 0.7, 1.0], [-0.8, 0.3, 0.5, 0.5] );
	}

	run(): void {
		this.mRscene.run();
	}
}

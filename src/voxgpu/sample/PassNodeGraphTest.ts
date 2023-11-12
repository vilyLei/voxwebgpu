import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";

class PassGraph extends WGRPassNodeGraph {
	constructor() { super(); }
	runBegin(): void {
		super.runBegin();
	}
	run(): void {
		let pass = this.passes[0];
		for (let i = 0; i < 16; ++i) {
			pass.colorAttachments[0].clearEnabled = i < 1;
			pass.render();
		}
	}
}

export class PassNodeGraphTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("PassNodeGraphTest::initialize() ...");

		let multisampleEnabled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampleEnabled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });
		this.initEvent();
		this.initScene();
	}

	private applyNewRPass(texUUID: string, entities: FixScreenPlaneEntity[], clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {

		let rs = this.mRscene;
		let rttTex = { diffuse: { uuid: texUUID, rttTexture: {} } };
		let colorAttachments = [
			{
				texture: rttTex,
				clearValue: clearColor,
				loadOp: "clear",
				storeOp: "store"
			}
		];
		let rPass = rs.renderer.appendRenderPass({ separate: true, colorAttachments });
		for (let i = 0; i < entities.length; ++i) {
			rPass.addEntity(entities[i]);
		}

		let graph = new PassGraph();
		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex] });
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		const rs = this.mRscene;
		let entity: FixScreenPlaneEntity;

		const diffuseTex = { diffuse: { url: "static/assets/guangyun_40.png", flipY: true } };

		let blendModes = ['add'];
		let entities: FixScreenPlaneEntity[] = [];
		entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [diffuseTex], blendModes });
		entity.setColor([0.9, 0.3, 0.9]);
		rs.addEntity(entity);
		entities.push(entity);

		this.applyNewRPass('rtt0', entities, [0.2, 0.2, 0.2, 1.0], [-0.2, 0.1, 0.8, 0.8]);
	}

	run(): void {
		this.mRscene.run();
	}
}

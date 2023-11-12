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
		// const cmds = this.rcommands;
		this.rcommands = [];
		let ps = this.passes;
		for (let i = 0; i < ps.length; ++i) {
			const node = ps[i].node;
			node.runBegin();
			node.run();
			node.runEnd();
			this.rcommands = this.rcommands.concat(node.rcommands);
		}
	}
}

export class PassNodeGraphTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("PassNodeGraphTest::initialize() ...");

		this.mRscene.initialize({ rpassparam: { multisampleEnabled: true, depthTestEnabled: false } });
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
		// entity.setColor([0.7, 0.5, 0.5]);
		entity.uuid = 'apply-rtt-entity';
		rs.addEntity(entity);
	}
	private initEvent(): void {
		const rs = this.mRscene;
		new MouseInteraction().initialize(rs, 0, false).setAutoRunning(true);
	}
	private initScene(): void {

		const rs = this.mRscene;
		let entity: FixScreenPlaneEntity;

		// const diffuseTex = { diffuse: { url: "static/assets/blueTransparent.png", flipY: true } };
		const diffuseTex = { diffuse: { url: "static/assets/redTransparent.png", flipY: true } };

		let blendModes = ['add'];
		let entities: FixScreenPlaneEntity[] = [];
		entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [diffuseTex], blendModes });
		entity.setColor([0.9, 0.3, 0.9]);
		entity.uuid = "pl-0";
		rs.addEntity(entity);
		entities.push(entity);

		// entity = new FixScreenPlaneEntity({ extent: [-0.2, -0.2, 0.4, 0.4], textures: [diffuseTex] });
		// entity.setColor([0.2, 0.9, 0.9]);
		// entity.uuid = "pl-1";
		// rs.addEntity(entity);
		// entities.push(entity);

		this.applyNewRPass('rtt0', entities, [0.2, 0.2, 0.2, 1.0], [-0.2, 0.1, 0.8, 0.8]);
		// this.applyNewRPass( 'rtt1', entities, [0.3, 0.5, 0.1, 1.0], [-0.2, 0.3, 0.5, 0.5] );
		// this.applyNewRPass( 'rtt2', entities, [0.3, 0.5, 0.7, 1.0], [-0.8, 0.3, 0.5, 0.5] );
	}

	run(): void {
		this.mRscene.run();
	}
}

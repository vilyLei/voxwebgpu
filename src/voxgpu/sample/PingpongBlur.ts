import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import fragWGSL from "../material/shader/wgsl/fixScreenPlaneTex.frag.wgsl";
import blurHWGSL from "../material/shader/wgsl/blurHTex.frag.wgsl";
import blurVWGSL from "../material/shader/wgsl/blurVTex.frag.wgsl";

const rttTex0 = { diffuse: { uuid: "rtt0", rttTexture: {} } };
const rttTex1 = { diffuse: { uuid: "rtt1", rttTexture: {} } };
const rtts = [rttTex0, rttTex1];
const attachment = {
	texture: rttTex0,
	clearValue: [] as ColorDataType,
	loadOp: "clear",
	storeOp: "store"
};
const colorAttachments = [attachment];

class PassGraph extends WGRPassNodeGraph {
	blurEntity: FixScreenPlaneEntity;
	constructor() {
		super();
	}

	run(): void {
		let pass = this.passes[0];

		const entity = this.blurEntity;
		let ms = entity.materials;

		for (let i = 0; i < 15; ++i) {
			pass.colorAttachments[0].clearEnabled = i < 1;
			attachment.texture = rtts[i % 2];
			ms[i % 2].visible = false;
			ms[(i + 1) % 2].visible = true;
			pass.render();
		}
	}
}

export class PingpongBlur {
	private mRscene = new RendererScene();
	initialize(): void {
		console.log("PingpongBlur::initialize() ...");

		let multisampleEnabled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampleEnabled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });
		this.initScene();
	}

	private mGraph = new PassGraph();
	private uniformValues = [{ data: new Float32Array([512, 512, 3.0, 0]) }];
	private createMaterial(shadinguuid: string, textures: WGTextureDataDescriptor[], type: number): WGMaterial {
		let shaderCodeSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: type > 0 ? blurVWGSL : blurHWGSL, uuid: "frag" }
		};
		shadinguuid += "-" + type;
		const material = new WGMaterial({
			shadinguuid,
			shaderCodeSrc
		});
		material.uniformValues = this.uniformValues;
		material.addTextures(textures);
		return material;
	}
	private applyBlurPass(clearColor: ColorDataType, extent = [0.4, 0.3, 0.5, 0.5]): void {
		let rs = this.mRscene;

		const graph = this.mGraph;

		attachment.clearValue = clearColor;

		let rPass = rs.renderer.appendRenderPass({ separate: true, colorAttachments });

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };

		let materials = [this.createMaterial("shd-01", [rttTex0], 0), this.createMaterial("shd-02", [rttTex1], 1)];

		let rttEntity = new FixScreenPlaneEntity({ extent: [-1, -1, 2, 2], textures: [diffuseTex] });
		rPass.addEntity(rttEntity);

		graph.passes = [rPass];
		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, materials });
		entity.materials[0].visible = false;
		rs.addEntity(entity);
		graph.blurEntity = entity;

		extent = [-0.9, -0.9, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [diffuseTex] });
		rs.addEntity(entity);
	}
	private initScene(): void {
		this.applyBlurPass([0.1, 0.1, 0.1, 1.0], [-1, -1, 2, 2]);
	}

	run(): void {
		this.mRscene.run();
	}
}

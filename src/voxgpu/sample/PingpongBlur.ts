import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
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
	srcEntity: FixScreenPlaneEntity;
	constructor() {
		super();
	}

	run(): void {
		let pass = this.passes[0];

		const srcEntity = this.srcEntity;
		const entity = this.blurEntity;
		let ms = entity.materials;

		for (let i = 0; i < 9; ++i) {
			const ia = i % 2;
			const ib = (i + 1) % 2;
			srcEntity.visible = i < 1;
			entity.visible = !srcEntity.visible;

			pass.colorAttachments[0].clearEnabled = i < 1;
			attachment.texture = rtts[ia];

			ms[ia].visible = false;
			ms[ib].visible = !ms[ia].visible;
			pass.render();
		}
	}
}

export class PingpongBlur {

	private mRscene = new RendererScene();
	private mGraph = new PassGraph();
	private mBlurDensity = 2.0;
	private uniformValues = [{ data: new Float32Array([512, 512, this.mBlurDensity, 0]) }];

	initialize(): void {
		console.log("PingpongBlur::initialize() ...");

		const multisampled = true;
		const depthTestEnabled = false;
		const rpassparam = { multisampled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });

		this.initScene();
	}
	private createMaterial(shadinguuid: string, textures: WGTextureDataDescriptor[], type: number): WGMaterial {
		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: type > 0 ? blurVWGSL : blurHWGSL, uuid: "frag" }
		};
		shadinguuid += "-" + type;
		let pipelineDefParam = {
			depthWriteEnabled: false
		};
		const material = new WGMaterial({
			shadinguuid,
			shaderSrc,
			pipelineDefParam
		});
		material.uniformValues = this.uniformValues;
		material.addTextures(textures);
		return material;
	}
	private applyBlurPass(clearColor: ColorDataType, extent: number[]): void {
		let rs = this.mRscene;

		const graph = this.mGraph;

		attachment.clearValue = clearColor;

		let rPass = rs.createRenderPass({ separate: true, colorAttachments });
		graph.passes = [rPass];

		const diffuseTex = { diffuse: { url: "static/assets/huluwa.jpg", flipY: true } };

		let materials = [this.createMaterial("shd-00", [rttTex0], 0), this.createMaterial("shd-01", [rttTex1], 1)];

		let rttEntity = new FixScreenPlaneEntity({ extent: [-1, -1, 2, 2], textures: [diffuseTex] });
		rPass.addEntity(rttEntity);
		graph.srcEntity = rttEntity;

		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, materials });
		entity.materials[0].visible = false;
		entity.uuid = "blur-entity";
		rPass.addEntity(entity);
		graph.blurEntity = entity;

		// display blur rendering result
		extent = [-0.8, -0.8, 1.6, 1.6];
		entity = new FixScreenPlaneEntity({ extent, flipY: true, textures: [rttTex0] });
		entity.uuid = "blur-big-img";
		rs.addEntity(entity);

		// display origin image
		extent = [-0.95, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, flipY: false, textures: [diffuseTex] });
		rs.addEntity(entity);
	}
	private initScene(): void {
		this.applyBlurPass([0.1, 0.1, 0.1, 1.0], [-1, -1, 2, 2]);
	}

	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../render/pass/WGRPassNodeGraph";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { MouseInteraction } from "../ui/MouseInteraction";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import blurHWGSL from "../material/shader/wgsl/blurHTex.frag.wgsl";
import blurVWGSL from "../material/shader/wgsl/blurVTex.frag.wgsl";

import entityVertWGSL from "../material/shader/wgsl/primitive.vert.wgsl";
import entityFragWGSL from "./shaders/primitiveVPos.frag.wgsl";
import vposReadFragWGSL from "./shaders/vposRead.frag.wgsl";
import depthBlurFragWGSL from "./shaders/depthBlur.frag.wgsl";

import { WGRPassColorAttachment } from "../render/pipeline/WGRPassColorAttachment";
import { TorusEntity } from "../entity/TorusEntity";

const blurRTTTex0 = { diffuse: { uuid: "rtt0", rttTexture: {} } };
const blurRTTTex1 = { diffuse: { uuid: "rtt1", rttTexture: {} } };
const rtts = [blurRTTTex0, blurRTTTex1];
const attachment = {
	texture: blurRTTTex0,
	clearValue: [] as ColorDataType,
	loadOp: "clear",
	storeOp: "store"
} as WGRPassColorAttachment;
const colorAttachments = [attachment];

const colorRTTTex = { diffuse: { uuid: "colorRTT", rttTexture: {} } };
const vposRTTTex = { diffuse: { uuid: "floatRTT", rttTexture: {}, format: 'rgba16float' } };

class PassGraph extends WGRPassNodeGraph {
	blurEntity: FixScreenPlaneEntity;
	srcEntity: FixScreenPlaneEntity;
	constructor() {
		super();
	}

	run(): void {
		let pass = this.passes[0];

		const entity = this.blurEntity;
		let ms = entity.materials;

		for (let i = 0; i < 11; ++i) {
			const ia = i % 2;
			const ib = (i + 1) % 2;
			pass.colorAttachments[0].clearEnabled = i < 1;
			this.srcEntity.visible = i < 1;
			this.blurEntity.visible = i > 0;
			attachment.texture = rtts[ia];
			ms[ia].visible = false;
			ms[ib].visible = true;
			pass.render();
		}
	}
}

export class DepthBlur {

	private mRscene = new RendererScene();
	private mGraph = new PassGraph();
	private uniformValues = [{ data: new Float32Array([512, 512, 3.0, 0]) }];

	initialize(): void {
		console.log("DepthBlur::initialize() ...");

		let multisampleEnabled = true;
		let depthTestEnabled = false;
		let rpassparam = { multisampleEnabled, depthTestEnabled };
		this.mRscene.initialize({ rpassparam });

		this.initEvent();
		this.initScene();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mouseDown = (evt: MouseEvent): void => {}

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

		let materials = [this.createMaterial("shd-00", [blurRTTTex0], 0), this.createMaterial("shd-01", [blurRTTTex1], 1)];

		let rttEntity = new FixScreenPlaneEntity({ extent: [-1, -1, 2, 2], flipY: true, textures: [colorRTTTex] });
		rttEntity.uuid = "src-entity";
		rPass.addEntity(rttEntity);
		graph.srcEntity = rttEntity;

		rs.setPassNodeGraph(graph);

		let entity = new FixScreenPlaneEntity({ extent, flipY: true, materials });
		entity.materials[0].visible = false;
		entity.uuid = "blur-entity";
		rPass.addEntity(entity);
		graph.blurEntity = entity;

		let shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: depthBlurFragWGSL, uuid: "depthBlur" }
		};

		// display blur rendering result
		let textures = [colorRTTTex, blurRTTTex0, vposRTTTex];
		extent = [-0.8, -0.8, 1.6, 1.6];
		entity = new FixScreenPlaneEntity({ extent, flipY: false, shaderSrc, textures, shadinguuid: "blurRenderingResult" });
		rs.addEntity(entity);

	}

	private applyMRTPass(extent: number[]): void {
		let rs = this.mRscene;

		const attachment0 = {
			texture: colorRTTTex,
			clearValue: [0.15, 0.15, 0.15, 1.0]
		};
		const attachment1 = {
			texture: vposRTTTex,
			clearValue: [800, 800, 800, 1]
		};

		const colorAttachments = [attachment0, attachment1];

		let rPass = rs.createRenderPass({ separate: true, colorAttachments });

		let shaderSrc = {
			vert: { code: entityVertWGSL, uuid: "vertMRT" },
			frag: { code: entityFragWGSL, uuid: "fragMRT" }
		};

		let torus = new TorusEntity({shaderSrc, radius: 150});
		torus.setAlbedo([0.7,0.02,0.1]);
		rPass.addEntity(torus);

		shaderSrc = {
			vert: { code: vertWGSL, uuid: "vert" },
			frag: { code: vposReadFragWGSL, uuid: "readNromal" }
		};

		// display depth value drawing result
		extent = [-0.95, -0.95, 0.6, 0.6];
		let entity = new FixScreenPlaneEntity({ extent, shaderSrc, textures: [vposRTTTex], shadinguuid: "readDepth" });
		rs.addEntity(entity);

		// display albedo drawing result
		extent = [-0.33, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, textures: [colorRTTTex] });
		rs.addEntity(entity);


		// display blur drawing result
		extent = [0.3, -0.95, 0.6, 0.6];
		entity = new FixScreenPlaneEntity({ extent, textures: [blurRTTTex0] });
		rs.addEntity(entity);
	}
	private initScene(): void {
		this.applyBlurPass([0.0, 0.0, 0.03, 1.0], [-1, -1, 2, 2]);
		this.applyMRTPass( [-1, -1, 2, 2] );
	}

	run(): void {
		this.mRscene.run();
	}
}

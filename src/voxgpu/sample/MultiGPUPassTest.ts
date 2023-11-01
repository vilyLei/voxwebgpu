import { GeomDataBuilder, GeomRDataType } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureColorParam.frag.wgsl";

import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";

export class MultiGPUPassTest {

	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("MultiGPUPassTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();

		this.initEvent();

		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);

		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private mouseDown = (evt: MouseEvent): void => {
		let node = this.mRPass.node;
		console.log("mousedown evt call this.mRPass: ", this.mRPass);
		console.log("mousedown evt call node.enabled: ", node.enabled);
		node.enabled = !node.enabled;
	}
	private createMaterial(shdSrc: WGRShderSrcType, texs?: WGTextureDataDescriptor[], color?: Color4, blendModes: string[] = ["solid"], faceCullMode = "back"): WGMaterial {

		color = color ? color : new Color4();

		let pipelineDefParam = {
			depthWriteEnabled: true,
			faceCullMode,
			blendModes: [] as string[]
		};

		pipelineDefParam.blendModes = blendModes;

		const texTotal = texs ? texs.length : 0;

		const material = new WGMaterial({
			shadinguuid: "base-material-tex" + texTotal,
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});

		let ufv = new WGRStorageValue(new Float32Array([color.r, color.g, color.b, 1]));
		material.uniformValues = [ufv];
		material.addTextures(texs);

		return material;
	}

	private createGeom(rgd: GeomRDataType, normalEnabled = false): WGGeometry {

		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs })
			.addAttribute({ uv: rgd.uvs })
			.setIndices(rgd.ivs);
		if (normalEnabled) {
			geometry.addAttribute({ normal: rgd.nvs });
		}
		return geometry;
	}
	private mRPass: IWGRPassRef;
	private initScene(): void {

		const rc = this.mRscene;

		const geometry = this.createGeom(this.geomData.createCube(80));

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const diffuseTex = {diffuse: {url:"static/assets/box.jpg"}};

		let materials0 = [this.createMaterial(shdSrc, [diffuseTex], new Color4(1.0, 0.0, 0.0))];
		let materials1 = [this.createMaterial(shdSrc, [diffuseTex], new Color4(0.0, 1.0, 0.0))];

		this.mRPass = rc.renderer.appendRendererPass();
		materials1[0].rpass = this.mRPass;

		let entity = new Entity3D();
		entity.materials = materials0;
		entity.geometry = geometry;
		rc.addEntity(entity);

		entity = new Entity3D();
		entity.materials = materials1;
		entity.geometry = geometry;
		entity.transform.setXYZ(200, 0, 0);
		rc.addEntity(entity);
	}

	run(): void {

		this.mRscene.run();
	}
}

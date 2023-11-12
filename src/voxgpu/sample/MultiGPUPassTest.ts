import { GeomDataBuilder, GeomRDataType } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/defaultEntity.vert.wgsl";
import fragWGSL from "./shaders/sampleTextureColorParam.frag.wgsl";

import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRStorageValue } from "../render/buffer/WGRStorageValue";
import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import { IWGRPassWrapper } from "../render/pipeline/IWGRPassWrapper";
import Vector3 from "../math/Vector3";
import { WGRenderPassBlock } from "../render/WGRenderPassBlock";

export class MultiGPUPassTest {

	private mRscene = new RendererScene();
	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("MultiGPUPassTest::initialize() ...");

		this.mRscene.initialize({
			rpassparam: {multisampleEnabled: true, depthTestEnabled: true},
			camera: {eye: new Vector3(600.0, 600.0, 0.0)},
		});
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private createMaterial(shdSrc: WGRShderSrcType, texs?: WGTextureDataDescriptor[], param?: ColorDataType, blendModes: string[] = ["solid"], faceCullMode = "back"): WGMaterial {

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

		let ufv = new WGRStorageValue({data: new Float32Array(new Color4().setColor(param).getArray4())});
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
	private mRPass0: IWGRPassWrapper;
	private mRPass1: IWGRPassWrapper;
	private mRBlock: WGRenderPassBlock;
	private mIndex = 0;
	private mouseDown = (evt: MouseEvent): void => {

		// // this.testAddEntityToBlock();
		// this.testAddEntityToPassNode();
		// return;
		let node = this.mRPass1.node;
		// node = this.mRPass0.node;
		console.log("mousedown evt call this.mRPass1: ", this.mRPass1);
		console.log("mousedown evt call AAAA node: ", node);
		console.log("mousedown evt call node.enabled: ", node.enabled);
		node.enabled = !node.enabled;
		console.log("mousedown evt call BBBB node: ", node);
	}
	private testAddEntityToBlock(): void {

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const geometry = this.createGeom(this.geomData.createSphere(50));
		const diffuseTex = {diffuse: {url:"static/assets/box.jpg"}};
		let materials = [this.createMaterial(shdSrc, [diffuseTex], [1.0, 0.0, 1.0])];
		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setXYZ(0,0, 180 + this.mIndex * 110);
		this.mRBlock.addEntity(entity);
		this.mIndex++;
	}
	private testAddEntityToPassNode(): void {

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const geometry = this.createGeom(this.geomData.createSphere(50));
		const diffuseTex = {diffuse: {url:"static/assets/box.jpg"}};
		let materials = [this.createMaterial(shdSrc, [diffuseTex], [1.0, 0.0, 1.0])];
		let entity = new Entity3D();
		entity.materials = materials;
		entity.geometry = geometry;
		entity.transform.setXYZ(0,0, -(180 + this.mIndex * 110));
		this.mRPass0.node.addEntity(entity);
		this.mIndex++;
	}
	private initScene(): void {

		const rc = this.mRscene;

		this.mRBlock = rc.renderer.getRPBlockAt(0);

		const geometry = this.createGeom(this.geomData.createCube(80));

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const diffuseTex = {diffuse: {url:"static/assets/box.jpg"}};

		let materials0 = [this.createMaterial(shdSrc, [diffuseTex], [1.0, 0.0, 0.0])];
		let materials1 = [this.createMaterial(shdSrc, [diffuseTex], [0.0, 1.0, 0.0])];

		this.mRPass0 = rc.renderer.getRPBlockAt(0).getRenderPassAt(0);

		this.mRPass1 = rc.renderer.appendRenderPass();
		materials1[0].rpass = {rpass: this.mRPass1};

		let entity = new Entity3D({geometry, materials: materials0});
		rc.addEntity(entity);

		entity = new Entity3D({geometry, materials: materials1});
		entity.transform.setXYZ(200, 0, 0);
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}

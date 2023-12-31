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

export class Entity3DVisibilityTest {

	private mRscene = new RendererScene();
	private mEntities: Entity3D[] = [];
	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("Entity3DVisibilityTest::initialize() ...");
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private mouseDown = (evt: MouseEvent): void => {

		let et = this.mEntities[0];
		et.rstate.visible = !et.rstate.visible;
		console.log("et.rstate.visible: ", et.rstate.visible);
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
			shaderSrc: shdSrc,
			pipelineDefParam
		});

		let ufv = new WGRStorageValue({data: new Float32Array([color.r, color.g, color.b, 1])});
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
	private initScene(): void {

		const rc = this.mRscene;

		const geometry = this.createGeom(this.geomData.createCube(80));

		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};

		let materials0 = [this.createMaterial(shdSrc, [{diffuse: {url:"static/assets/box.jpg"}}], new Color4(1.0))];
		let materials1 = [this.createMaterial(shdSrc, [{diffuse: {url:"static/assets/default.jpg"}}], new Color4(0.0, 1.0))];

		let entity = new Entity3D({geometry, materials: materials0});
		rc.addEntity(entity);
		this.mEntities.push( entity );

		entity = new Entity3D({geometry, materials: materials1});
		entity.transform.setXYZ(200, 0, 0);
		rc.addEntity(entity);
		this.mEntities.push( entity );
	}

	private mRotValue = 0.0;
	run(): void {

		this.mRotValue += 0.5;
		this.mRscene.run();
	}
}

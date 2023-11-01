import { GeomDataBuilder, GeomRDataType } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/simplePBR.vert.wgsl";
import fragWGSL from "./shaders/simplePBR.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import Color4 from "../material/Color4";
import Vector3 from "../math/Vector3";

export class SimplePBRTest {

	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("SimplePBRTest::initialize() ...");

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

	}
	private createMaterial(shdSrc: WGRShderSrcType, color?: Color4, arm?: number[]): WGMaterial {

		color = color ? color : new Color4();

		let pipelineDefParam = {
			depthWriteEnabled: true,
			blendModes: [] as string[]
		};

		const material = new WGMaterial({
			shadinguuid: "simple-pbr-materialx",
			shaderCodeSrc: shdSrc,
			pipelineDefParam
		});

		let albedoV = new WGRStorageValue(new Float32Array([color.r, color.g, color.b, 1]));

		// arm[0]: ao, arm[1]: roughness, arm[2]: metallic
		let armV = new WGRStorageValue(new Float32Array([arm[0], arm[1], arm[2], 1]));
		material.uniformValues = [albedoV, armV];

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
		const geometry = this.createGeom(this.geomData.createSphere(50), true);

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		let tot = 5;
		const size = new Vector3(150, 150, 150);
		const pos = new Vector3().copyFrom(size).scaleBy(-0.5 * (tot - 1));
		let pv = new Vector3();
		for (let i = 0; i < tot; ++i) {
			for (let j = 0; j < tot; ++j) {
				// params[0]: ao, params[1]: roughness, params[2]: metallic
				let params = [1.5, (i / tot) * 0.95 + 0.05, (j / tot) * 0.95 + 0.05];
				let material = this.createMaterial(shdSrc, new Color4(0.5, 0.0, 0.0), params);
				let entity = new Entity3D();
				entity.materials = [material];
				entity.geometry = geometry;
				pv.setXYZ(i * size.x, j * size.y, size.z).addBy(pos);
				entity.transform.setPosition(pv);
				rc.addEntity(entity);
			}
		}
	}

	run(): void {
		this.mRscene.run();
	}
}

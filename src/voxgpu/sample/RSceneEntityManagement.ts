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
import Vector3 from "../math/Vector3";

export class RSceneEntityManagement {
	private mEntitices: Entity3D[] = [];
	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("RSceneEntityManagement::initialize() ...");

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
	private mRenderingFlag = 6;
	private mouseDown = (evt: MouseEvent): void => {
		const rc = this.mRscene;
		// let et = this.mEntitices[Math.round(Math.random() * (this.mEntitices.length - 1))];
		// et = this.mEntitices[0];
		// if (et.isInRenderer()) {
		// 	rc.removeEntity(et);
		// } else {
		// 	let vs = et.materials[0].uniformValues[0].data as Float32Array;
		// 	vs.set([Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2, 1.0]);
		// 	rc.addEntity(et);
		// }
		this.mRenderingFlag = 1;
	};
	private createMaterial(
		shdSrc: WGRShderSrcType,
		texs?: WGTextureDataDescriptor[],
		color?: Color4,
		blendModes: string[] = ["solid"],
		faceCullMode = "back"
	): WGMaterial {
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
	private initScene(): void {
		const rc = this.mRscene;

		const geometry = this.createGeom(this.geomData.createCube(80));

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vertShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};

		const diffuseTex = { diffuse: { url: "static/assets/box.jpg" } };

		let mts0 = [this.createMaterial(shdSrc, [diffuseTex], new Color4(1.0, 0.0, 0.0))];
		let mts1 = [this.createMaterial(shdSrc, [diffuseTex], new Color4(0.0, 1.0, 0.0))];

		// for (let i = 0; i < 1; ++i) {
		// 	let entity = new Entity3D();
		// 	// entity.materials = mts0;
		// 	entity.materials =  [this.createMaterial(shdSrc, [diffuseTex], new Color4(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5))];
		// 	entity.geometry = geometry;
		// 	entity.transform.setPosition(new Vector3(-500 + i * 130, 0, 0));
		// 	this.mEntitices.push(entity);
		// 	rc.addEntity(entity);
		// }

		let tot = 3;
		const size = new Vector3(150, 150, 150);
		const pos = new Vector3().copyFrom(size).scaleBy(-0.5 * (tot - 1));
		for (let i = 0; i < tot; ++i) {
			for (let j = 0; j < tot; ++j) {
				for (let k = 0; k < tot; ++k) {
					let entity = new Entity3D();
					entity.materials = mts0;
					// entity.materials = [
					// 	this.createMaterial(shdSrc, [diffuseTex], new Color4(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5))
					// ];
					entity.geometry = geometry;
					entity.transform.setPosition(new Vector3(i * size.x, j * size.y, k * size.z).addBy(pos));
					this.mEntitices.push(entity);
					rc.addEntity(entity);
				}
			}
		}
	}

	run(): void {
		// if (this.mRenderingFlag < 1) {
		// 	return;
		// }
		// this.mRenderingFlag--;

		this.mRscene.run();
	}
}
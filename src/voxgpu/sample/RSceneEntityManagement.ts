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
import Vector3 from "../math/Vector3";
/**
 * Add some entitices into scene.
 * Remove some entitices from scene.
 * Create some new entitices and add them into scene.
 */
export class RSceneEntityManagement {
	private mEntitices: Entity3D[] = [];
	private mRscene = new RendererScene();

	geomData = new GeomDataBuilder();

	initialize(): void {
		console.log("RSceneEntityManagement::initialize() ...");
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
		// // et = this.mEntitices[0];
		// if (et.isInRenderer()) {
		// 	rc.removeEntity(et);
		// } else {
		// 	let vs = et.materials[0].uniformValues[0].data as Float32Array;
		// 	vs.set([Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2, 1.0]);
		// 	rc.addEntity(et);
		// }
		// this.mRenderingFlag = 1;

		const geometry = this.createGeom(this.geomData.createSphere(50));
		const shdSrc = {
			vert: { code: vertWGSL, uuid: "vertShdCode" },
			frag: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const diffuseTex = { diffuse: { url: "static/assets/default.jpg" } };

		let materials = [this.createMaterial(shdSrc, [diffuseTex], new Color4(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5))];
		let entity = new Entity3D({ materials, geometry });
		entity.transform.setPosition(new Vector3(-500 + this.mEntitices.length * 130, 0, 0));
		this.mEntitices.push(entity);
		rc.addEntity(entity);
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

		const diffuseTex = { diffuse: { url: "static/assets/box.jpg" } };

		let materials = [this.createMaterial(shdSrc, [diffuseTex], new Color4(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5))];

		for (let i = 0; i < 1; ++i) {
			let entity = new Entity3D({ materials, geometry });
			entity.transform.setPosition(new Vector3(-500 + i * 130, 0, 0));
			this.mEntitices.push(entity);
			rc.addEntity(entity);
		}
		return;

		let urls = [
			"static/assets/box.jpg",
			"static/assets/default.jpg",
			"static/assets/metal_02.jpg",
			"static/assets/displacement_01.jpg",
			"static/assets/brickwall_big512.jpg"
		];
		let tot = 3;
		const size = new Vector3(150, 150, 150);
		const pos = new Vector3().copyFrom(size).scaleBy(-0.5 * (tot - 1));
		for (let i = 0; i < tot; ++i) {
			for (let j = 0; j < tot; ++j) {
				for (let k = 0; k < tot; ++k) {
					const tex = { diffuse: { url: urls[Math.round(Math.random() * (urls.length - 1))] } };
					materials = [this.createMaterial(shdSrc, [tex], new Color4(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5))];
					let entity = new Entity3D({ materials, geometry });
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

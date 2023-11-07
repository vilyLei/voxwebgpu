import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

import { CoGeomDataType, CoModelTeamLoader } from "../../voxlib/cospace/app/common/CoModelTeamLoader";
import { WGGeometry } from "../geometry/WGGeometry";
import { PrimitiveEntity } from "../entity/PrimitiveEntity";

import vertWGSL from "./shaders/primitiveIns.vert.wgsl";
import fragWGSL from "./shaders/primitiveIns.frag.wgsl";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import Vector3 from "../math/Vector3";

export class DrawInstanceTest {
	private mRscene = new RendererScene();
	private mTeamLoader = new CoModelTeamLoader();
	initialize(): void {
		console.log("DrawInstanceTest::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initEvent();
		this.initModels();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private createGeometry(gd: CoGeomDataType, normalEnabled = false): WGGeometry {
		const geometry = new WGGeometry()
			.addAttribute({ position: gd.vertices })
			.addAttribute({ uv: gd.uvsList[0] })
			.setIndices(gd.indices);
		if (normalEnabled) {
			geometry.addAttribute({ normal: gd.normals });
		}
		return geometry;
	}
	private initModels(): void {

		let url0 = "static/assets/fbx/mat_ball.fbx";
		let loader = this.mTeamLoader;

		loader.load([url0], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			console.log("loaded models: ", models);
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i]);
			}
		});
	}
	private mouseDown = (evt: MouseEvent): void => {};

	private createEntity(model: CoGeomDataType): void {

		let tot = 4;

		let instanceCount = tot * tot * tot;
		const stride = 4;
		const posData = new Float32Array(stride * instanceCount);

		const size = new Vector3(150, 150, 150);
		const pos = new Vector3().copyFrom(size).scaleBy(-0.5 * (tot - 1));
		let index = 0;
		for (let i = 0; i < tot; ++i) {
			for (let j = 0; j < tot; ++j) {
				for (let k = 0; k < tot; ++k) {
					const pv = new Vector3().setXYZ(i * size.x, j * size.y, k * size.z).addBy(pos);
					const t = index * stride;
					posData[t] = pv.x;
					posData[t + 1] = pv.y;
					posData[t + 2] = pv.z;
					posData[t + 3] = 1;
					index++;
				}
			}
		}

		let positionsV = new WGRStorageValue({ stride, data: posData, shdVarName: 'positions' });
		let albedoV = new WGRUniformValue({ data: new Float32Array([1.0, 0.01, 0.05, 1]), shdVarName: 'albedo' });
		let armV = new WGRUniformValue({ data: new Float32Array([1, 0.1, 0.1, 1]), shdVarName: 'arm' });
		let uniformValues: WGRUniformValue[] = [
			positionsV,
			albedoV,
			armV
		];
		let shaderSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vert-primitive-ins" },
			fragShaderSrc: { code: fragWGSL, uuid: "frag-primitive-ins" }
		};

		const rc = this.mRscene;
		const geometry = this.createGeometry(model, true);
		let entity = new PrimitiveEntity({ geometry, shaderSrc, uniformValues, instanceCount });
		rc.addEntity(entity);
	}
	run(): void {
		this.mRscene.run();
	}
}

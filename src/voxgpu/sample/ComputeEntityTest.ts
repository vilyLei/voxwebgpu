import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";

import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/buffer/WGRStorageValue";
import { ComputeEntity } from "../entity/ComputeEntity";
import { WGRBufferVisibility } from "../render/buffer/WGRBufferVisibility";

const gridSize = 32;
const shdWorkGroupSize = 8;

const compShdCode = `
			@group(0) @binding(0) var<uniform> grid: vec2f;
			@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
			@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

			fn cellIndex(cell: vec2u) -> u32 {
				return cell.y * u32(grid.x) + cell.x;
			}

			@compute @workgroup_size(${shdWorkGroupSize}, ${shdWorkGroupSize})
			fn compMain(@builtin(global_invocation_id) cell: vec3u) {
				if (cellStateIn[cellIndex(cell.xy)] == 1) {
					cellStateOut[cellIndex(cell.xy)] = 0;
				} else {
					cellStateOut[cellIndex(cell.xy)] = 1;
				}
			}`;
export class ComputeEntityTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("ComputeEntityTest::initialize() ...");
		this.initEvent();
		this.initScene();
	}

	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private mouseDown = (evt: MouseEvent): void => {};

	private createUniformValues(): WGRBufferData[] {

		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray0.length; i+=3) {
			cellStateArray0[i] = 1;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}
		// const v0 = new WGRUniformValue({data: gridsSizesArray, stride: 2}).toVisibleAll();
		// const v1 = new WGRStorageValue({data: cellStateArray0, stride: 1}).toVisibleVertComp();
		// const v2 = new WGRStorageValue({data: cellStateArray1, stride: 1}).toVisibleComp();
		// v2.toBufferForStorage();


		let visibility = new WGRBufferVisibility().toVisibleAll();
		const v0 = {data: gridsSizesArray, stride: 2, visibility};
		// const v0 = new WGRUniformValue({data: gridsSizesArray, stride: 2}).toVisibleAll();
		visibility = new WGRBufferVisibility().toVisibleVertComp();
		const v1 = {storage: {data: cellStateArray0, stride: 1, visibility}};
		visibility = new WGRBufferVisibility().toVisibleComp().toBufferForStorage();
		const v2 = {storage: {data: cellStateArray1, stride: 1, visibility}};

		return [v0, v1, v2];
	}

	private initScene(): void {
		const rc = this.mRscene;

		let shaderSrc = {
			code: compShdCode,
			uuid: 'shader-computing'
		};
		let uniformValues = this.createUniformValues();
		let entity = new ComputeEntity({ shaderSrc, uniformValues });
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}

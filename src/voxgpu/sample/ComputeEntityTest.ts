import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import shaderWGSL from "./shaders/gameOfLifeTest.wgsl";
// import fragWGSL from "./shaders/screenPostEffect.frag.wgsl";

import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import { ComputeEntity } from "../entity/ComputeEntity";

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
			}`
export class ComputeEntityTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("ComputeEntityTest::initialize() ...");

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

	private mouseDown = (evt: MouseEvent): void => {};

	private createUniformValues(): WGRUniformValue[] {
		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		// Create an array representing the active state of each cell.
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);		
		// Mark every third cell of the first grid as active.
		for (let i = 0; i < cellStateArray0.length; i+=3) {
			cellStateArray0[i] = 1;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		// Mark every other cell of the second grid as active.
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}
		let v0 = new WGRUniformValue({data: gridsSizesArray, stride: 1});
		let v1 = new WGRStorageValue({data: cellStateArray0, stride: 1});
		let v2 = new WGRStorageValue({data: cellStateArray1, stride: 1});
		v0.visibility.toVisibleComp();
		v1.visibility.toVisibleComp();
		v2.visibility.toVisibleComp();
		v2.visibility.toBufferForStorage();

		let uniformvs: WGRUniformValue[] = [v0, v1, v2];
		console.log("uniformvs: ", uniformvs);
		return uniformvs;
	}

	private initScene(): void {
		const rc = this.mRscene;

		let shaderSrc = {
			compShaderSrc: {
				code: compShdCode,
				uuid: 'shader-computing',
				compEntryPoint: 'compMain'
			}
		};
		let uniformValues = this.createUniformValues();
		let entity = new ComputeEntity({ shaderSrc, uniformValues });
		rc.addEntity(entity);
	}

	run(): void {
		this.mRscene.run();
	}
}

import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import shaderWGSL from "./shaders/gameOfLife.wgsl";

import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/buffer/WGRStorageValue";
import { ComputeEntity } from "../entity/ComputeEntity";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

type NodeType = { rendEntity: FixScreenPlaneEntity; compEntity?: ComputeEntity };

const gridSize = 64;
const shdWorkGroupSize = 8;

const compShdCode = `
@group(0) @binding(0) var<uniform> grid: vec2f;

@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;

fn cellIndex(cell: vec2u) -> u32 {
	return (cell.y % u32(grid.y)) * u32(grid.x) +
		   (cell.x % u32(grid.x));
}

fn cellActive(x: u32, y: u32) -> u32 {
	return cellStateIn[cellIndex(vec2(x, y))];
}

@compute @workgroup_size(${shdWorkGroupSize}, ${shdWorkGroupSize})
fn compMain(@builtin(global_invocation_id) cell: vec3u) {
	// Determine how many active neighbors this cell has.
	let activeNeighbors = cellActive(cell.x+1, cell.y+1) +
							cellActive(cell.x+1, cell.y) +
							cellActive(cell.x+1, cell.y-1) +
							cellActive(cell.x, cell.y-1) +
							cellActive(cell.x-1, cell.y-1) +
							cellActive(cell.x-1, cell.y) +
							cellActive(cell.x-1, cell.y+1) +
							cellActive(cell.x, cell.y+1);

	let i = cellIndex(cell.xy);

	// Conway's game of life rules:
	switch activeNeighbors {
		case 2: { // Active cells with 2 neighbors stay active.
			cellStateOut[i] = cellStateIn[i];
		}
		case 3: { // Cells with 3 neighbors become or stay active.
			cellStateOut[i] = 1;
		}
		default: { // Cells with < 2 or > 3 neighbors become inactive.
			cellStateOut[i] = 0;
		}
	}
}`;
export class GameOfLifeTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("GameOfLifeTest::initialize() ...");
		this.initEvent();
		this.initScene();
	}
	private mFlag = 6;
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}

	private mouseDown = (evt: MouseEvent): void => {
		this.mFlag = 1;
	};
	private createUniformValues(): { ufvs0: WGRUniformValue[]; ufvs1: WGRUniformValue[] }[] {
		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray0.length; i++) {
			cellStateArray0[i] = Math.random() > 0.6 ? 1 : 0;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}

		let shared = true;
		let sharedData0 = { data: cellStateArray0 };
		let sharedData1 = { data: cellStateArray1 };

		const v0 = new WGRUniformValue({ data: gridsSizesArray, stride: 2, shared });
		v0.toVisibleAll();

		// build rendering uniforms
		const va1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const vb1 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared }).toVisibleVertComp();

		// build computing uniforms
		const compva1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const compva2 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared }).toVisibleComp();
		compva2.toBufferForStorage();
		const compvb1 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const compvb2 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleComp();
		compvb2.toBufferForStorage();

		let objs = [
			{ ufvs0: [v0, va1], ufvs1: [v0, vb1] },
			{ ufvs0: [v0, compva1, compva2], ufvs1: [v0, compvb1, compvb2] }
		];
		return objs;
	}
	private mNodes: NodeType[] = [];
	private mStep = 0;
	private initScene(): void {
		const rc = this.mRscene;

		let ufvsObjs = this.createUniformValues();

		// build ping-pong rendering process
		let shaderSrc = {
			code: shaderWGSL,
			uuid: "shader-gameOfLife"
		};

		let instanceCount = gridSize * gridSize;
		let uniformValues = ufvsObjs[0].ufvs0;
		let entity = new FixScreenPlaneEntity({
			x: -0.8, y: -0.8, width: 1.6, height: 1.6,
			shadinguuid: "rshd0", shaderSrc, uniformValues, instanceCount
		});
		rc.addEntity(entity);
		this.mNodes = [{ rendEntity: entity, compEntity: null }];
		entity.visible = false;
		const geometry = this.mNodes[0].rendEntity.geometry;
		uniformValues = ufvsObjs[0].ufvs1;
		entity = new FixScreenPlaneEntity({ shadinguuid: "rshd1", shaderSrc, uniformValues, instanceCount, geometry });
		rc.addEntity(entity);
		this.mNodes.push({ rendEntity: entity, compEntity: null });

		// build ping-pong computing process
		shaderSrc = {
			code: compShdCode,
			uuid: "shader-computing",
		};

		const workgroupCount = Math.ceil(gridSize / shdWorkGroupSize);
		uniformValues = ufvsObjs[1].ufvs1;
		let compEentity = new ComputeEntity({ shadinguuid: "compshd0", shaderSrc, uniformValues }).setWorkcounts(workgroupCount, workgroupCount);
		rc.addEntity(compEentity);
		compEentity.visible = false;
		this.mNodes[0].compEntity = compEentity;
		uniformValues = ufvsObjs[1].ufvs0;
		compEentity = new ComputeEntity({ shadinguuid: "compshd1", shaderSrc, uniformValues }).setWorkcounts(workgroupCount, workgroupCount);
		rc.addEntity(compEentity);
		this.mNodes[1].compEntity = compEentity;
	}

	private mFrameDelay = 3;
	run(): void {
		let rendering = this.mNodes[0].compEntity.isRendering();
		if (rendering) {
			if (this.mFrameDelay > 0) {
				this.mFrameDelay--;
				return;
			}
			this.mFrameDelay = 3;

			const nodes = this.mNodes;
			for (let i = 0; i < nodes.length; i++) {
				const t = nodes[i];
				const flag = (this.mStep % 2 + i) % 2 == 0;
				t.rendEntity.visible = flag;
				t.compEntity.visible = flag;
			}
			this.mStep++;
		}
		this.mRscene.run(rendering);
	}
	run2(): void {
		if (this.mRscene.renderer.isEnabled()) {
			if (this.mFrameDelay > 0) {
				this.mFrameDelay--;
				return;
			}
			this.mFrameDelay = 3;
			const nodes = this.mNodes;
			for (let i = 0; i < nodes.length; i++) {
				const t = nodes[i];
				t.rendEntity.visible = false;
				t.compEntity.visible = false;
			}
			let index = this.mStep % 2;
			nodes[index].rendEntity.visible = true;
			nodes[index].compEntity.visible = true;
			this.mStep++;

			this.mRscene.run();
		}
	}
}

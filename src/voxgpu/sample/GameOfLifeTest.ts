import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import shaderWGSL from "./shaders/gameOfLifeTest.wgsl";

import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import { ComputeEntity } from "../entity/ComputeEntity";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";

type NodeType = { rendEntity: FixScreenPlaneEntity; compEntity?: ComputeEntity };

const gridSize = 16;
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

		const rc = this.mRscene;
		rc.initialize();
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
	private createGeometry(): WGGeometry {
		let hsize = 0.8;
		let vertices = new Float32Array([
			//   X,    Y,
			-hsize,
			-hsize, // Triangle 1 (Blue)
			hsize,
			-hsize,
			hsize,
			hsize,

			-hsize,
			-hsize, // Triangle 2 (Red)
			hsize,
			hsize,
			-hsize,
			hsize
		]);
		const geometry = new WGGeometry().addAttribute({ position: vertices, strides: [2] });
		return geometry;
	}

	private createUniformValues(): { ufvs0: WGRUniformValue[], ufvs1: WGRUniformValue[] }[] {
		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray0.length; i++) {
			cellStateArray0[i] = Math.random() > 0.6 ? 1 : 0;
			// cellStateArray0[i] = 1;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}

		// console.log("gridsSizesArray: ", gridsSizesArray);
		// console.log("cellStateArray0: ", cellStateArray0);
		// console.log("cellStateArray1: ", cellStateArray1);
		let shared = true;
		let sharedData0 = { data: cellStateArray0 };
		let sharedData1 = { data: cellStateArray1 };

		const v0 = new WGRUniformValue({ data: gridsSizesArray, stride: 2, shared });
		v0.toVisibleAll();
		// build rendering uniforms
		const va1 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const vb1 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleVertComp();

		// build computing uniforms
		const compva1 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const compva2 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleComp();
		compva2.toBufferForStorage();
		const compvb1 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const compvb2 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleComp();
		compvb2.toBufferForStorage();

		let objs = [
			{ ufvs0: [v0, va1], ufvs1: [v0, vb1] },
			{ ufvs0: [v0, compva1, compva2], ufvs1: [v0, compvb1, compvb2] }
		];
		return objs;
	}
	private mNodes: NodeType[] = [];
	private mSign = 0;
	private initScene(): void {
		const rc = this.mRscene;

		let ufvsObjs = this.createUniformValues();


		// build ping-pong rendering process
		const geometry = this.createGeometry();
		let shaderSrc = {
			shaderSrc: {
				code: shaderWGSL,
				uuid: "shader-gameOfLife",
				vertEntryPoint: "vertMain",
				fragEntryPoint: "fragMain"
			}
		} as WGRShderSrcType;
		let instanceCount = gridSize * gridSize;
		let uniformValues = ufvsObjs[0].ufvs0;
		// console.log("uniformValues: ", uniformValues);
		let entity = new FixScreenPlaneEntity({ shadinguuid: "rshd0", shaderSrc, geometry, uniformValues, instanceCount });
		rc.addEntity(entity);
		this.mNodes = [{ rendEntity: entity, compEntity: null }];

		uniformValues = ufvsObjs[0].ufvs1;
		entity = new FixScreenPlaneEntity({ shadinguuid: "rshd1", shaderSrc, geometry, uniformValues, instanceCount });
		rc.addEntity(entity);
		this.mNodes.push({ rendEntity: entity, compEntity: null });
		entity.rstate.visible = false;




		// build ping-pong computing process
		shaderSrc = {
			compShaderSrc: {
				code: compShdCode,
				uuid: 'shader-computing',
				compEntryPoint: 'compMain'
			}
		};

		const workgroupCount = Math.ceil(gridSize / shdWorkGroupSize);
		uniformValues = ufvsObjs[1].ufvs0;
		let compEentity = new ComputeEntity({ shadinguuid: "compshd0", shaderSrc, uniformValues }).setWorkcounts(workgroupCount, workgroupCount);
		rc.addEntity(compEentity);
		this.mNodes[0].compEntity = compEentity;
		uniformValues = ufvsObjs[1].ufvs1;
		compEentity = new ComputeEntity({ shadinguuid: "compshd1", shaderSrc, uniformValues }).setWorkcounts(workgroupCount, workgroupCount);
		rc.addEntity(compEentity);
		compEentity.rstate.visible = false;
		this.mNodes[1].compEntity = compEentity;

	}

	run(): void {
		if (this.mFlag < 1) {
			return;
		}
		this.mFlag--;
		console.log("run() >> >> >> >> >>");

		for (let i = 0; i < this.mNodes.length; i++) {
			const t = this.mNodes[i];
			t.rendEntity.setVisible(false);
			if(t.compEntity)t.compEntity.setVisible(false);
		}
		let index = this.mSign % 2;
		// console.log("index: ", index);
		this.mNodes[index].rendEntity.setVisible(true);
		if(this.mNodes[index].compEntity)this.mNodes[index].compEntity.setVisible(true);

		this.mSign++;

		this.mRscene.run();
	}
}
import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import shaderWGSL from "./shaders/gameOfLife.wgsl";

import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/buffer/WGRStorageValue";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGCompMaterial } from "../material/WGCompMaterial";
import { WGMaterial } from "../material/WGMaterial";

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
	let activeNeighbors = cellActive(cell.x+1, 		cell.y+1) +
							cellActive(cell.x+1, 	cell.y) +
							cellActive(cell.x+1, 	cell.y-1) +
							cellActive(cell.x, 		cell.y-1) +
							cellActive(cell.x-1, 	cell.y-1) +
							cellActive(cell.x-1, 	cell.y) +
							cellActive(cell.x-1, 	cell.y+1) +
							cellActive(cell.x, 		cell.y+1);

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
export class GameOfLifeMultiMaterialPass {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("GameOfLifeMultiMaterialPass::initialize() ...");
		this.initScene();
	}
	private createUniformValues(): { ufvs0: WGRBufferData[]; ufvs1: WGRBufferData[] }[] {
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
		let sharedData0 = { data: cellStateArray0, shared };
		let sharedData1 = {uuid: 'sharedData1', data: cellStateArray1, shared };

		// const v0 = new WGRUniformValue({uuid: 'v0', data: gridsSizesArray, stride: 2, shared });
		// v0.toVisibleAll();
		const v0 = {uuid: 'v0', data: gridsSizesArray, stride: 2, shared, layout:{visibility:'all'} };

		// build rendering uniforms
		// const va1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const va1 = {storage: { bufData: sharedData0, stride: 1, shared }, layout:{visibility:'vert_comp'}};
		// const vb1 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const vb1 = {storage: { bufData: sharedData1, stride: 1, shared }, layout:{visibility:'vert_comp'}};

		// build computing uniforms
		// const compva1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const compva1 = {storage: { bufData: sharedData0, stride: 1, shared}, layout:{visibility:'vert_comp'}};
		// const compva2 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared }).toVisibleComp();
		// compva2.toBufferForStorage();
		const compva2 = {storage: { bufData: sharedData1, stride: 1, shared}, layout:{visibility:'comp', access:"read_write"}};

		// const compvb1 = new WGRStorageValue({uuid: 'compvb1',  bufData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const compvb1 = {storage: {uuid: 'compvb1', bufData: sharedData1, stride: 1, shared}, layout:{visibility:'vert_comp'}};

		// const compvb2 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared }).toVisibleComp();
		// compvb2.toBufferForStorage();
		const compvb2 = {storage: { bufData: sharedData0, stride: 1, shared, layout:{visibility:'comp', access:"read_write"}}};

		return [
			{ ufvs0: [v0, va1], ufvs1: [v0, vb1] },
			{ ufvs0: [v0, compva1, compva2], ufvs1: [v0, compvb1, compvb2] }
		];
	}
	private mEntity: FixScreenPlaneEntity;
	private mStep = 0;

	private createMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRBufferData[], shadinguuid: string, instanceCount: number): WGMaterial {
			return new WGMaterial({
				shadinguuid,
				shaderCodeSrc,
				instanceCount,
				uniformValues
			});
	}
	private createCompMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRBufferData[], shadinguuid: string, workgroupCount = 2): WGCompMaterial {
		return new WGCompMaterial({
			shadinguuid,
			shaderCodeSrc,
			uniformValues
		}).setWorkcounts(workgroupCount, workgroupCount);
	}
	private initScene(): void {
		const rc = this.mRscene;

		const ufvsObjs = this.createUniformValues();

		const instanceCount = gridSize * gridSize;
		const workgroupCount = Math.ceil(gridSize / shdWorkGroupSize);

		let shaderSrc = {
			code: shaderWGSL,
			uuid: "shader-shading",
		};

		let compShaderSrc = {
			code: compShdCode,
			uuid: "shader-computing"
		};

		const materials: WGMaterial[] = [
			// build ping-pong rendering process
			this.createMaterial(shaderSrc, ufvsObjs[0].ufvs0, "rshd0", instanceCount),
			this.createMaterial(shaderSrc, ufvsObjs[0].ufvs1, "rshd1", instanceCount),
			// build ping-pong computing process
			this.createCompMaterial(compShaderSrc, ufvsObjs[1].ufvs1, "compshd0", workgroupCount),
			this.createCompMaterial(compShaderSrc, ufvsObjs[1].ufvs0, "compshd1", workgroupCount),
		];

		let entity = new FixScreenPlaneEntity({
			extent: [-0.8, -0.8, 1.6, 1.6],
			materials
		});
		rc.addEntity(entity);

		this.mEntity = entity;
	}

	private mFrameDelay = 3;
	run(): void {
		let rendering = this.mEntity.isRendering();
		if (rendering) {
			if (this.mFrameDelay > 0) {
				this.mFrameDelay--;
				return;
			}
			this.mFrameDelay = 3;

			const ms = this.mEntity.materials;
			for (let i = 0; i < ms.length; i++) {
				ms[i].visible = (this.mStep % 2 + i) % 2 == 0;
			}
			this.mStep++;
		}
		this.mRscene.run(rendering);
	}
}

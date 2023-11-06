import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

import shaderWGSL from "./shaders/gameOfLifeSphere.wgsl";

import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGCompMaterial } from "../material/WGCompMaterial";
import { WGMaterial } from "../material/WGMaterial";
import Vector3 from "../math/Vector3";

const gridSize = 32;
const shdWorkGroupSize = 8;

const compShdCode = `
@group(0) @binding(0) var<uniform> grid: vec2f;

@group(0) @binding(1) var<storage> cellStateIn: array<u32>;
@group(0) @binding(2) var<storage, read_write> cellStateOut: array<u32>;
@group(0) @binding(3) var<storage, read_write> lifeState: array<f32>;

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
			if(cellStateOut[i] > 0) {
				lifeState[i] += 0.5;
			} else {
				lifeState[i] -= 0.5;
			}
		}
		case 3: { // Cells with 3 neighbors become or stay active.
			cellStateOut[i] = 1;
			lifeState[i] += 0.5;
		}
		default: { // Cells with < 2 or > 3 neighbors become inactive.
			cellStateOut[i] = 0;
			lifeState[i] = 0.01;
		}
	}
	if(lifeState[i] < 0.01) { lifeState[i] = 0.01; }
}`;
export class GameOfLifeSphere {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("GameOfLifeSphere::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initScene();
	}
	private createUniformValues(): { ufvs0: WGRUniformValue[]; ufvs1: WGRUniformValue[] }[] {
		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray0.length; i++) {
			cellStateArray0[i] = Math.random() > 0.5 ? 1 : 0;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}

		const lifeStateArray3 = new Float32Array(gridSize * gridSize);
		for (let i = 0; i < lifeStateArray3.length; i++) {
			lifeStateArray3[i] = 0.01;
		}

		const posisitonArray4 = new Float32Array(gridSize * gridSize * 3);
		let posV = new Vector3();
		let sizeV = new Vector3(50,50,50);
		let k = 0;
		for (let i = 0; i < gridSize; i++) {
			for (let j = 0; j < gridSize; j++) {
				let pv = new Vector3(j * sizeV.x, 0, i * sizeV.z).addBy(posV);				
				posisitonArray4[k] = pv.x;
				posisitonArray4[k+1] = pv.y;
				posisitonArray4[k+2] = pv.z;
				k += 3;
			}
		}

		let shared = true;
		let sharedData0 = { data: cellStateArray0 };
		let sharedData1 = { data: cellStateArray1 };
		let sharedData3 = { data: lifeStateArray3 };
		let sharedData4 = { data: posisitonArray4 };

		const v0 = new WGRUniformValue({ data: gridsSizesArray, stride: 2, shared });
		v0.toVisibleAll();

		// build rendering uniforms
		const va1 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const vb1 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const vc1 = new WGRStorageValue({ sharedData: sharedData3, stride: 1, shared }).toVisibleAll();
		const vd1 = new WGRStorageValue({ sharedData: sharedData4, stride: 1, shared }).toVisibleVertComp();

		// build computing uniforms
		const compva1 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleVertComp();
		const compva2 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleComp();
		compva2.toBufferForStorage();

		const compvb1 = new WGRStorageValue({ sharedData: sharedData1, stride: 1, shared }).toVisibleVertComp();
		const compvb2 = new WGRStorageValue({ sharedData: sharedData0, stride: 1, shared }).toVisibleComp();
		compvb2.toBufferForStorage();

		const compv3 = new WGRStorageValue({ sharedData: sharedData3, stride: 1, shared }).toVisibleComp();
		compv3.toBufferForStorage();

		return [
			{ ufvs0: [v0, va1, vc1], ufvs1: [v0, vb1, vc1] },
			{ ufvs0: [v0, compva1, compva2, compv3], ufvs1: [v0, compvb1, compvb2, compv3] }
		];
	}
	private mEntity: FixScreenPlaneEntity;
	private mStep = 0;

	private createMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRUniformValue[], shadinguuid: string, instanceCount: number): WGMaterial {
		return new WGMaterial({
			shadinguuid,
			shaderCodeSrc,
			instanceCount,
			uniformValues
		});
	}
	private createCompMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRUniformValue[], shadinguuid: string, workgroupCount = 2): WGCompMaterial {
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
			shaderSrc: {
				code: shaderWGSL,
				uuid: "shader-gameOfLife",
				vertEntryPoint: "vertMain",
				fragEntryPoint: "fragMain"
			}
		} as WGRShderSrcType;
		let compShaderSrc = {
			compShaderSrc: {
				code: compShdCode,
				uuid: "shader-computing",
				compEntryPoint: "compMain"
			}
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
			x: -0.8, y: -0.8, width: 1.6, height: 1.6,
			materials
		});
		rc.addEntity(entity);
		materials[0].visible = false;
		materials[2].visible = false;

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

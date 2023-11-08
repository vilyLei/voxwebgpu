import { RendererScene } from "../rscene/RendererScene";
import MouseEvent from "../event/MouseEvent";
import { MouseInteraction } from "../ui/MouseInteraction";
//src\voxgpu\sample\shaders\gameOfLifeSpherePBR.vert.wgsl
import vertWGSL from "./shaders/gameOfLifeSpherePBR.vert.wgsl";
import fragWGSL from "./shaders/gameOfLifeSpherePBR.frag.wgsl";

import { WGRUniformValue } from "../render/uniform/WGRUniformValue";
import { WGRStorageValue } from "../render/uniform/WGRStorageValue";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGCompMaterial } from "../material/WGCompMaterial";
import { WGMaterial } from "../material/WGMaterial";
import Vector3 from "../math/Vector3";
import RenderStatusDisplay from "../rscene/RenderStatusDisplay";
import { Entity3D } from "../entity/Entity3D";
import { CylinderEntity } from "../entity/CylinderEntity";

const gridSize = 256;
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
				lifeState[i] += 0.05;
			} else {
				lifeState[i] -= 0.05;
			}
		}
		case 3: { // Cells with 3 neighbors become or stay active.
			cellStateOut[i] = 1;
			lifeState[i] += 0.1;
		}
		default: { // Cells with < 2 or > 3 neighbors become inactive.
			cellStateOut[i] = 0;
			lifeState[i] -= 0.05;
		}
	}
	lifeState[i] = max(lifeState[i], 0.01);
}`;
export class GameOfLife3DPBR {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("GameOfLife3DPBR::initialize() ...");

		const rc = this.mRscene;
		rc.initialize();
		this.initEvent();
		this.initScene();
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new RenderStatusDisplay(this.mRscene, true);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private mFlag = 6;
	private mouseDown = (evt: MouseEvent): void => { this.mFlag = 1; };

	private createUniformValues(): { ufvs0: WGRUniformValue[], ufvs1: WGRUniformValue[] }[] {

		const gridsSizesArray = new Float32Array([gridSize, gridSize]);
		const cellStateArray0 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray0.length; i++) {
			cellStateArray0[i] = Math.random() > 0.6 ? 1 : 0;
		}
		const cellStateArray1 = new Uint32Array(gridSize * gridSize);
		for (let i = 0; i < cellStateArray1.length; i++) {
			cellStateArray1[i] = i % 2;
		}
		const lifeStateArray3 = new Float32Array(gridSize * gridSize);
		for (let i = 0; i < lifeStateArray3.length; i++) {
			lifeStateArray3[i] = 0.01;
		}

		const posisitonArray4 = new Float32Array(gridSize * gridSize * 4);
		let sizeV = new Vector3(40, 1, 40);
		let posV = new Vector3().copyFrom(sizeV);
		posV.scaleBy(gridSize);
		posV.scaleBy(-0.5);

		let k = 0;
		for (let i = 0; i < gridSize; i++) {
			for (let j = 0; j < gridSize; j++) {
				let pv = new Vector3(j * sizeV.x, 0, i * sizeV.z).addBy(posV);
				posisitonArray4[k] = pv.x;
				posisitonArray4[k+1] = pv.y;
				posisitonArray4[k+2] = pv.z;
				k += 4;
			}
		}

		let shared = true;
		let sharedData0 = { data: cellStateArray0, shared };
		let sharedData1 = { data: cellStateArray1, shared };
		let sharedData3 = { data: lifeStateArray3, shared };
		let sharedData4 = { data: posisitonArray4, shared };

		const v0 = new WGRUniformValue({ data: gridsSizesArray, stride: 2, shared, shdVarName: 'v0' }).toVisibleAll();

		// build rendering uniforms
		const va1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared, shdVarName: 'va1' }).toVisibleVertComp();
		const vb1 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared, shdVarName: 'vb1' }).toVisibleVertComp();
		const vc1 = new WGRStorageValue({ bufData: sharedData3, stride: 1, shared, shdVarName: 'vc1' }).toVisibleAll();
		const v4 = new WGRStorageValue({ bufData: sharedData4, stride: 3, shared, shdVarName: 'v4' }).toVisibleVertComp();

		// build computing uniforms
		const compva1 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared, shdVarName: 'compva1' }).toVisibleVertComp();
		const compva2 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared, shdVarName: 'compva2' }).toVisibleComp();
		compva2.toBufferForStorage();

		const compvb1 = new WGRStorageValue({ bufData: sharedData1, stride: 1, shared, shdVarName: 'compvb1' }).toVisibleVertComp();
		const compvb2 = new WGRStorageValue({ bufData: sharedData0, stride: 1, shared, shdVarName: 'compvb2' }).toVisibleComp();
		compvb2.toBufferForStorage();

		const compv3 = new WGRStorageValue({ bufData: sharedData3, stride: 1, shared, shdVarName: 'compv3' }).toVisibleComp();
		compv3.toBufferForStorage();

		return [
			{ ufvs0: [v0, va1, vc1, v4], ufvs1: [v0, vb1, vc1, v4] },
			{ ufvs0: [v0, compva1, compva2, compv3], ufvs1: [v0, compvb1, compvb2, compv3] }
		];
	}
	private mEntity: Entity3D;
	private mStep = 0;

	private createMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRUniformValue[], instanceCount: number): WGMaterial {
		return new WGMaterial({
			shadinguuid: 'rendering',
			shaderCodeSrc,
			instanceCount,
			uniformValues,
			uniformAppend: false
		});
	}
	private createCompMaterial(shaderCodeSrc: WGRShderSrcType, uniformValues: WGRUniformValue[], workgroupCount = 2): WGCompMaterial {
		return new WGCompMaterial({
			shadinguuid: 'computing',
			shaderCodeSrc,
			uniformValues,
			uniformAppend: false
		}).setWorkcounts(workgroupCount, workgroupCount);
	}
	private initScene(): void {
		const rc = this.mRscene;

		const ufvsObjs = this.createUniformValues();

		const instanceCount = gridSize * gridSize;
		const workgroupCount = Math.ceil(gridSize / shdWorkGroupSize);

		let shaderSrc = {
			vertShaderSrc: {
				code: vertWGSL,
				uuid: "vert-gameOfLife",
				vertEntryPoint: "vertMain",
			},
			fragShaderSrc: {
				code: fragWGSL,
				uuid: "frag-gameOfLife",
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
		// build ping-pong material rendering/computing process
		const materials: WGMaterial[] = [

			this.createMaterial(shaderSrc, ufvsObjs[0].ufvs0, instanceCount),
			this.createMaterial(shaderSrc, ufvsObjs[0].ufvs1, instanceCount),

			this.createCompMaterial(compShaderSrc, ufvsObjs[1].ufvs1, workgroupCount),
			this.createCompMaterial(compShaderSrc, ufvsObjs[1].ufvs0, workgroupCount),
		];
		let entity = new CylinderEntity({
			radius: 20, height: 38,
			longitudeNumSegments: 10, latitudeNumSegments: 10,
			alignYRatio : 0.0, materials
		});
		rc.addEntity(entity);

		materials[0].visible = false;
		materials[2].visible = false;

		this.mEntity = entity;
	}

	private mFrameDelay = 3;

	run(): void {
		let flag = this.mEntity.isRendering();
		const ms = this.mEntity.materials;
		if (flag) {

			for (let i = 0; i < ms.length; i++) {
				ms[i].visible = (this.mStep % 2 + i) % 2 == 0;
			}
			if (this.mFrameDelay > 0) {
				this.mFrameDelay--;
				flag = false;
			}else {
				this.mFrameDelay = 3;
				this.mStep++;
			}

		}
		if(!flag) {
			ms[2].visible = false;
			ms[3].visible = false;
		}
		this.mRscene.run();
	}
}

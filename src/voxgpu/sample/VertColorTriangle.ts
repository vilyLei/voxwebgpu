import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { FixScreenEntity } from "../entity/FixScreenEntity";
import { WGRenderer } from "../rscene/WGRenderer";

import vertWGSL from "./shaders/colorTriangle.vert.wgsl";
import fragWGSL from "./shaders/colorTriangle.frag.wgsl";

const positions = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0]);
const colors = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

export class VertColorTriangle {

	renderer = new WGRenderer();

	initialize(): void {
		console.log("VertColorTriangle::initialize() ...");
		
		const renderer = this.renderer;

		const shdSrc = {
			vertShaderSrc: { code: vertWGSL, uuid: "vtxShdCode" },
			fragShaderSrc: { code: fragWGSL, uuid: "fragShdCode" }
		};
		const material = new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc: shdSrc
		});

		const geometry = new WGGeometry().addAttributes([
			{ shdVarName: "position", data: positions, strides: [3] },
			{ shdVarName: "color", data: colors, strides: [3] }
		]);

		const entity = new FixScreenEntity();
		entity.materials = [material];
		entity.geometry = geometry;
		renderer.addEntity(entity);
	}
	run(): void {
		this.renderer.run();
	}
}

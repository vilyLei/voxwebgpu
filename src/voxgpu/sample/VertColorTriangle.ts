import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { FixScreenEntity } from "../entity/FixScreenEntity";
import { WGRenderer } from "../rscene/WGRenderer";

// import vertWGSL from "./shaders/colorTriangle.vert.wgsl";
// import fragWGSL from "./shaders/colorTriangle.frag.wgsl";

const vertWGSL =`
struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) color: vec3f,
};

@vertex
fn main(@location(0) inPos: vec3f,
        @location(1) inColor: vec3f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4(inPos, 1.0);
    vsOut.color = inColor;
    return vsOut;
}
`;
const fragWGSL = `
@fragment
fn main(@location(0) inColor: vec3f) -> @location(0) vec4f {
    return vec4f(inColor, 1.0);
}
`;

const position = new Float32Array([-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 0.0, 1.0, 0.0]);
const color = new Float32Array([1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0]);

export class VertColorTriangle {

	renderer = new WGRenderer();
	initialize(): void {

		const renderer = this.renderer;

		const shdSrc = {
			vert: { code: vertWGSL },
			frag: { code: fragWGSL }
		};
		const materials = [new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderSrc: shdSrc
		})];
		const geometry = new WGGeometry().addAttributes([
			{ position},
			{ color }
		]);
		renderer.addEntity( new FixScreenEntity({geometry, materials}) );
	}
	run(): void {
		this.renderer.run();
	}
}

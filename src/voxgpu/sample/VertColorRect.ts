import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { FixScreenEntity } from "../entity/FixScreenEntity";
import { WGRenderer } from "../rscene/WGRenderer";
import Color4 from "../material/Color4";

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

let color0 = new Color4(0.0,0.0,0.0);
let color1 = new Color4(0.3,0.3,0.3);

const position = new Float32Array([
	-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
	-1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
]);
const color = new Float32Array([
	color0.r, color0.g, color0.b,	// 左下
	color0.r, color0.g, color0.b,	// 右下
	color1.r, color1.g, color1.b,	// 右上
	color0.r, color0.g, color0.b,	// 左下
	color1.r, color1.g, color1.b,	// 右上
	color1.r, color1.g, color1.b	// 左上
]);

export class VertColorRect {

	renderer = new WGRenderer();
	initialize(): void {

		console.log('VertColorRect::initialize() ...');

		const renderer = this.renderer;
		renderer.initialize({camera:{enabled: false}});
		const shaderSrc = {
			vert: { code: vertWGSL },
			frag: { code: fragWGSL }
		};
		const materials = [new WGMaterial({shaderSrc})];
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

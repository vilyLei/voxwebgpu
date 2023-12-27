import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { FixScreenEntity } from "../entity/FixScreenEntity";
import { WGRenderer } from "../rscene/WGRenderer";
import Color4 from "../material/Color4";

const vertWGSL =`

struct VSOut {
    @builtin(position) Position: vec4<f32>,
    @location(0) color: vec3<f32>,
    @location(1) pos: vec4<f32>,
};

@vertex
fn main(@location(0) inPos: vec3<f32>,
        @location(1) inColor: vec3<f32>) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4<f32>(inPos, 1.0);
    vsOut.color = inColor;
    vsOut.pos = vsOut.Position;
    return vsOut;
}
`;
const fragWGSL = `
const PI = 3.14159265359;
const factor = 0.25 / 255.0;
const c = 43758.5453;
const uvFactor = vec2<f32>( 12.9898 ,78.233 );
fn randUV( uv: vec2<f32> ) -> f32{
    let dt = dot( uv.xy, uvFactor );
    let sn = modf( dt / PI ).fract;
    return fract(sin(sn) * c);
}
const dither_fector = vec4<f32>( factor, -factor, factor, factor);
fn dithering( color: vec4<f32>, puv: vec2<f32> ) -> vec4<f32> {
    let grid_position = randUV( puv );
    return color + mix( 2.0 * dither_fector, -2.0 * dither_fector, grid_position );
}

@fragment
fn main(
	@location(0) inColor: vec3<f32>,
	@location(1) pos: vec4<f32>
	) -> @location(0) vec4<f32> {
    return dithering(vec4<f32>(inColor, 1.0), pos.xy);
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

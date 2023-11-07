
@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;

@group(0) @binding(3) var<uniform> grid: vec2f;
@group(0) @binding(4) var<storage> cellState: array<u32>;
@group(0) @binding(5) var<storage> lifeState: array<f32>;
@group(0) @binding(6) var<storage> wpositions: array<vec4f>;

struct VertexInput {
	@location(0) pos: vec3f,
  	@location(1) uv : vec2f,
	@builtin(instance_index) instance: u32
};

struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) cell: vec2f,
	@location(1) uv: vec2f,
	@location(2) factor: f32,
};
const scales = array<f32, 2>(0.1, 0.5);
@vertex
fn vertMain(input: VertexInput) -> VertexOutput {

	let i = input.instance;
    // var state = f32(cellState[i]);

	let f = clamp((lifeState[ input.instance ])/100.0, 0.0005, 1.0);
	var baseScale = scales[ cellState[i] ];


    var wpos = objMat * vec4f(input.pos.xyz * (f * 0.5 + baseScale), 1.0);
	wpos = vec4f(wpos.xyz + wpositions[ input.instance ].xyz, wpos.w);

    let fi = f32(i);
    let cell = vec2f(fi % grid.x, floor(fi / grid.x));


    var output: VertexOutput;

    var projPos = projMat * viewMat * wpos;
	// if(state < 1.0) {
	// 	projPos = vec4f(projPos.xyz, -1.0);
	// }
    output.pos = projPos;

    output.cell = cell;
    output.uv = input.uv;

    output.factor = f;
    return output;
}

@fragment
fn fragMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell / grid;
	var dis = length(input.uv - vec2<f32>(0.5, 0.5));
	dis = min(dis/0.51, 1.0);
	let f = input.factor;
	dis = (1.0 - pow(dis, 50.0)) * (1.0 - f) + f;
	var c3 = vec3f(c, (1.0 - c.x) * (1.0 - f) + f) * dis;
    return vec4f(c3, 1.0);
}
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
@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;

@group(0) @binding(3) var<uniform> grid: vec2f;
@group(0) @binding(4) var<storage> cellState: array<u32>;
@group(0) @binding(5) var<storage> lifeState: array<f32>;
@group(0) @binding(6) var<storage> wpositions: array<vec4f>;

@vertex
fn vertMain(input: VertexInput) -> VertexOutput {

	var f = clamp((lifeState[ input.instance ])/100.0, 0.0005, 1.0);
    var wpos = objMat * vec4(input.pos.xyz, 1.0);
    wpos = vec4f(wpositions[input.instance].xyz + wpos.xyz, wpos.w);

    let i = f32(input.instance);
    let cell = vec2f(i % grid.x, floor(i / grid.x));
    let cellOffset = cell / grid * 2.0;

    var state = f32(cellState[input.instance]);
    // let gridPos = (input.pos.xy * state + 1.0) / grid - 1.0 + cellOffset;

    var output: VertexOutput;
    // output.pos = vec4f(gridPos, 0.0, 1.0);
    output.pos = projMat * viewMat * wpos;
    output.cell = cell;
    output.uv = input.uv;

    output.factor = f;
    return output;
}

@fragment
fn fragMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell / grid;
	var dis = length(input.uv - vec2<f32>(0.5, 0.5));
	dis = min(dis/0.45, 1.0);
	let f = input.factor;
	dis = (1.0 - pow(dis, 100.0)) * (1.0 - f) + f;
	var c3 = vec3f(c, (1.0 - c.x) * (1.0 - f) + f) * dis;
    return vec4f(c3, 1.0);
}
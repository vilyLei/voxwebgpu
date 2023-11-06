struct VertexInput {
	@location(0) pos: vec3f,
  	@location(1) uv : vec2f,
	@builtin(instance_index) instance: u32
};

struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) cell: vec2f,
	@location(1) uv: vec2f,
	@location(2) instance: f32,
};
@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cellState: array<u32>;
@group(0) @binding(2) var<storage> lifeState: array<f32>;
@vertex
fn vertMain(input: VertexInput) -> VertexOutput {
    let i = f32(input.instance);
    let cell = vec2f(i % grid.x, floor(i / grid.x));
    let cellOffset = cell / grid * 2.0;

    var state = f32(cellState[input.instance]);
    let gridPos = (input.pos.xy * state + 1.0) / grid - 1.0 + cellOffset;

    var output: VertexOutput;
    output.pos = vec4f(gridPos, 0.0, 1.0);
    output.cell = cell;
    output.uv = input.uv;
    output.instance = i;
    return output;
}

@fragment
fn fragMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell / grid;
	var dis = length(input.uv - vec2<f32>(0.5, 0.5));
	dis = min(dis/0.15, 1.0);
	let i = u32(input.instance);
	var f = clamp((lifeState[i])/100.0, 0.0005, 1.0);
	dis = (1.0 - pow(dis, 100.0)) * (1.0 - f) + f;
	var c3 = vec3f(c, (1.0 - c.x) * (1.0 - f) + f) * dis;
    return vec4f(c3, 1.0);
}
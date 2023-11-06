struct VertexInput {
	@location(0) pos: vec2f,
	@builtin(instance_index) instance: u32,
};

struct VertexOutput {
	@builtin(position) pos: vec4f,
	@location(0) cell: vec2f,
};
@group(0) @binding(0) var<uniform> grid: vec2f;
@group(0) @binding(1) var<storage> cellState: array<u32>;
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
    return output;
}

@fragment
fn fragMain(input: VertexOutput) -> @location(0) vec4f {
    let c = input.cell / grid;
    return vec4f(c, 1.0 - c.x, 1.0);
}
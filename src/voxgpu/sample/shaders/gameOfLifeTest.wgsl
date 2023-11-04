@group(0) @binding(0) var<uniform> color: vec4f;
@group(0) @binding(1) var<storage> params: array<vec4<f32>>;

struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) uv: vec2f,
};

@vertex
fn main(@location(0) position: vec3f,
        @location(1) uv: vec2f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4(position, 1.0);
    vsOut.uv = uv;
    return vsOut;
}

fn calcColor3(vtxUV: vec2f) -> vec3f{
    let uv = vtxUV;
    return color.xyz * vec3f(uv, 1.0);
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	let c3 = calcColor3(uv);
	let c4 = vec4f(c3.xyz * color.xyz, color.w);
	return c4;
}

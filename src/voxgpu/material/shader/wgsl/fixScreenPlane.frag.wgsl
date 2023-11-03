@group(0) @binding(3) var<uniform> color: vec4f;
@fragment
fn main(
	@location(0) pos: vec3f,
	@location(1) uv: vec2f
	) -> @location(0) vec4f {
    return vec4f(color.xyz, color.w);
}

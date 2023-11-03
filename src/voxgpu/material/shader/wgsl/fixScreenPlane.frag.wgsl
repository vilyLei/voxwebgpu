@group(0) @binding(0) var<uniform> color: vec4f;
@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
    return vec4f(color.xyz, color.w);
}

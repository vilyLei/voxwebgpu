@group(0) @binding(0) var<uniform> color: vec4f;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = vec4f(textureSample(texture0, sampler0, uv).xyz, 1.0) * color;
    return color4;
}

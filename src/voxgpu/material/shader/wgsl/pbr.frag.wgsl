@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = textureSample(texture0, sampler0, uv) * color;
    return color4;
}

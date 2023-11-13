@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;

fn calcColor(uv: vec2f) -> vec4f {
    var result = textureSample(texture0, sampler0, uv) * param;
	result = vec4f(result.xyz * result.x/0.2, 1.0);
	// result = vec4f(result.xyz * 3.0, 1.0);
    return result;
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = calcColor( uv );
    return color4;
}

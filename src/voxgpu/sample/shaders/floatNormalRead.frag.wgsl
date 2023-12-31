@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var<uniform> uvScale: vec4f;
@group(0) @binding(2) var sampler0: sampler;
@group(0) @binding(3) var texture0: texture_2d<f32>;

fn reinhard(v: vec3<f32>) -> vec3<f32> {
    return v / (vec3<f32>(1.0) + v);
}
fn calcColor(uv: vec2f) -> vec4f {

    var result = textureSample(texture0, sampler0, uv * uvScale.xy + uvScale.zw) * param;
	result = vec4f(result.xyz, 1.0);

    return result;
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = calcColor( uv );
    return color4;
}

@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var<uniform> uvParam: vec4f;
@group(0) @binding(2) var sampler0: sampler;
@group(0) @binding(3) var texture0: texture_2d<f32>;

fn reinhard(v: vec3<f32>) -> vec3<f32> {
    return v / (vec3<f32>(1.0) + v);
}
fn calcColor(uv: vec2f) -> vec4f {

    var vpos = textureSample(texture0, sampler0, uv) * param;
	var f = clamp((length(vpos.xyz) - 300.0)/200.0, 0.0, 1.0);
	f = f * f;
	vpos = vec4f(vec3(f), 1.0);

    return vpos;
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = calcColor( uv );
    return color4;
}

@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var colorSampler0: sampler;
@group(0) @binding(2) var colorTexture0: texture_2d<f32>;
@group(0) @binding(3) var blurSampler1: sampler;
@group(0) @binding(4) var blurTexture1: texture_2d<f32>;
@group(0) @binding(5) var vposSampler1: sampler;
@group(0) @binding(6) var vposTexture1: texture_2d<f32>;

fn reinhard(v: vec3<f32>) -> vec3<f32> {
    return v / (vec3<f32>(1.0) + v);
}
fn calcColor(uv: vec2f) -> vec4f {

    var color = textureSample(colorTexture0, colorSampler0, uv) * param;
    var blurColor = textureSample(blurTexture1, blurSampler1, uv);
    var vpos = textureSample(vposTexture1, vposSampler1, uv);
	var f = clamp((length(vpos.xyz) - 300.0)/200.0, 0.0, 1.0);
	// f = 1.0 - f * f;
	f = f * f;
	var result = vec4f(color.xyz * (1.0 - f) + f * blurColor.xyz, 1.0);

    return result;
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = calcColor( uv );
    return color4;
}

@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;

const weight = array<f32, 5>(0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
fn calcBlurColor(uv: vec2f) -> vec4f {
    var dv = vec2f(0.0, param.z) / param.xy;
    let dy = dv.y;

    var result = textureSample(texture0, sampler0, uv) * weight[0];
	for (var i: i32 = 1; i < 5; i++)  {
        dv.y = dy * f32(i);
        result += textureSample(texture0, sampler0, uv + dv) * weight[i];
        result += textureSample(texture0, sampler0, uv - dv) * weight[i];
    }
    return result;
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	var color4 = calcBlurColor( uv );
    return color4;
}

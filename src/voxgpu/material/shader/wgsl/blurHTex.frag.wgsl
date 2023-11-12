@group(0) @binding(0) var<uniform> param: vec4f;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;

const weight = array<f32, 5>(0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
fn calcBlurColor(uv: vec2f) -> vec4f {
    var tex_offset = vec2f(param.w, 0.0) / param.xy;
    let dx = tex_offset.x;
	
    var result = textureSample(texture0, sampler0, uv) * weight[0];
	for (var i: i32 = 0; i < 5; i++)  {
        tex_offset.x = dx * f32(i);
        result += textureSample(texture0, sampler0, uv + tex_offset) * weight[i];
        result += textureSample(texture0, sampler0, uv - tex_offset) * weight[i];
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

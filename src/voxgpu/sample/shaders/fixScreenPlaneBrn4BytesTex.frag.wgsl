@group(0) @binding(0) var<uniform> color: vec4f;
@group(0) @binding(1) var sampler0: sampler;
@group(0) @binding(2) var texture0: texture_2d<f32>;
const hdrBrnDecodeVec4 = vec4f(255.0, 2.55, 0.0255, 0.000255);
fn rgbaToHdrBrn(color: vec4f) -> f32 {
    return dot(hdrBrnDecodeVec4, color);
}
@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	// var color4 = vec4f(textureSample(texture0, sampler0, uv).xyz, 1.0) * color;
	let brn3 = vec3f(rgbaToHdrBrn(textureSample(texture0, sampler0, uv)));
	var color4 = vec4f(brn3, 1.0) * color;
    return color4;
}

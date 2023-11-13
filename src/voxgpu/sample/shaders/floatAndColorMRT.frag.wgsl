@group(0) @binding(3) var<uniform> param: vec4f;
@group(0) @binding(4) var sampler0: sampler;
@group(0) @binding(5) var texture0: texture_2d<f32>;

struct FragOutput {
  @location(0) color: vec4<f32>,
  @location(1) albedo: vec4<f32>,
  @location(2) normal: vec4<f32>
}
fn calcColor(uv: vec2f) -> vec4f {
    var result = textureSample(texture0, sampler0, uv) * param;
    return result;
}

@fragment
fn main(
	@location(0) uv: vec2f,
	@location(1) normal: vec3f
	) -> FragOutput {

	let c4 = calcColor( uv );
	var output: FragOutput;
	output.color = vec4f( c4.xyz * 0.5 + normal * c4.xyz, 1.0);
	output.albedo = c4;
	output.normal = vec4f(normal, 1.0);

	return output;
}

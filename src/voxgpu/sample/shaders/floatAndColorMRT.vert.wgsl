@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;

struct VertOutput {
	@builtin(position) Position : vec4<f32>,
	@location(0) uv : vec2<f32>,
	@location(1) normal : vec3<f32>
}
@vertex
fn main(
	@location(0) position : vec3<f32>,
	@location(1) uv : vec2<f32>,
	@location(2) normal : vec3<f32>
	) ->VertOutput {
		let wpos = objMat * vec4(position.xyz, 1.0);
		var output : VertOutput;
		output.Position = projMat * viewMat * wpos;
		output.uv = uv;
		output.normal = normal;
    return output;
}

@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>
}
@vertex
fn main(
  @location(0) position : vec3<f32>
) -> VertexOutput {

  let wpos = objMat * vec4(position.xyz, 1.0);
  var output : VertexOutput;
  output.Position = projMat * viewMat * wpos;
  return output;
}
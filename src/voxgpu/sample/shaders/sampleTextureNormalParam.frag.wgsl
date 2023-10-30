@group(0) @binding(3) var<storage> param: vec4f;
@group(0) @binding(4) var sampler0: sampler;
@group(0) @binding(5) var texture0: texture_2d<f32>;

const lightDirec = vec3<f32>(0.3,0.6,0.9);

@fragment
fn main(
  @location(0) pos: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>
) -> @location(0) vec4<f32> {

  let nDotL = max(dot(normal, lightDirec), 0.0);
  var color4 = textureSample(texture0, sampler0, uv) * param;
  color4 = vec4(color4.xyz * (vec3<f32>(1.0 - param.w) + vec3<f32>((param.w) * nDotL) * param.xyz), color4.w);
  return color4;
}

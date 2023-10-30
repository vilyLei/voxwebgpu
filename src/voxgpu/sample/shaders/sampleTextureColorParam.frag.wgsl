@group(0) @binding(3) var<storage> param: vec4f;
@group(0) @binding(4) var mySampler: sampler;
@group(0) @binding(5) var myTexture: texture_2d<f32>;

@fragment
fn main(
  @location(0) fragUV: vec2<f32>,
  @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {

  var color4 = textureSample(myTexture, mySampler, fragUV) * fragPosition * param;
  color4 = vec4(color4.xyz, 1.0);
  return color4;
}

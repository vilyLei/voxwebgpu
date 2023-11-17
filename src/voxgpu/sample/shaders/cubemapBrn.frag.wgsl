@group(0) @binding(3) var mySampler: sampler;
@group(0) @binding(4) var myTexture: texture_cube<f32>;
const hdrBrnDecodeVec4 = vec4f(255.0, 2.55, 0.0255, 0.000255);
fn rgbaToHdrBrn(color: vec4f) -> f32 {
    return dot(hdrBrnDecodeVec4, color);
}

@fragment
fn main(
  @location(0) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {
  // Our camera and the skybox cube are both centered at (0, 0, 0)
  // so we can use the cube geomtry position to get viewing vector to sample the cube texture.
  // The magnitude of the vector doesn't matter.
  var cubemapVec = fragPosition.xyz - vec3(0.5);
//   var c4 = textureSample(myTexture, mySampler, cubemapVec);
  var c4 = textureSampleLevel(myTexture, mySampler, cubemapVec, 2.0);
  let v3 = vec3( rgbaToHdrBrn(c4) );
  c4 = vec4(v3, 1.0);
  return c4;
//   return textureSample(myTexture, mySampler, cubemapVec);
}

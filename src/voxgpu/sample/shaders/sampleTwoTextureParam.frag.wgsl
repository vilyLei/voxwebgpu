@group(0) @binding(3) var<uniform> param: vec4f;
@group(0) @binding(4) var mySampler0: sampler;
@group(0) @binding(5) var myTexture0: texture_2d<f32>;
@group(0) @binding(6) var mySampler1: sampler;
@group(0) @binding(7) var myTexture1: texture_2d<f32>;

@fragment
fn main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>
) -> @location(0) vec4<f32> {

    var color0: vec4<f32>;
    var color1: vec4<f32>;
    color0 = textureSample(myTexture0, mySampler0, fragUV) * fragPosition;
    color1 = textureSample(myTexture1, mySampler1, fragUV) * fragPosition;
    return color0 * (vec4<f32>(1.0) - param) + color1 * param;
}

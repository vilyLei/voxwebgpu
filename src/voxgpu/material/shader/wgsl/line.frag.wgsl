@group(0) @binding(3) var<uniform> color: vec4f;

@fragment
fn main() -> @location(0) vec4<f32> {
  var color4 = color;
  return color4;
}
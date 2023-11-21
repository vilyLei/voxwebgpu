@group(0) @binding(4) var<uniform> color: vec4f;
@group(0) @binding(5) var<uniform> uvScale: vec4f;
@group(0) @binding(6) var billSampler: sampler;
@group(0) @binding(7) var billTexture: texture_2d<f32>;

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
    var c4 = textureSample(billTexture, billSampler, uv * uvScale.xy + uvScale.zw) * color;
    return c4;
}
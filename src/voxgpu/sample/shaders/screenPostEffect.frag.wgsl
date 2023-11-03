@group(0) @binding(0) var<uniform> color: vec4f;
@group(0) @binding(1) var<storage> params: array<vec4<f32>>;

fn calcColor3(vtxUV: vec2f) -> vec3f{
    let pos = vtxUV;
    let diff = pos - params[1].xy;
    let factor = abs(sin(params[2].x + length(diff)/0.01));
    var color = params[0].xyz;
    let pa = 2.0 * abs(sin(params[2].y + diff * 4.0));
    let pb = 2.0 * abs(sin(params[2].y * 2.0 + diff * 2.0));
    let v2 = color.xz * vec2<f32>(0.4 + pa * pb);
    color = vec3f(v2.x, color.y, v2.y);
    return color * vec3f(abs(sin(factor * 80.0)),abs(sin(factor * 50.0)),abs(sin(factor * 15.0)));
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	let c3 = calcColor3(uv);
	let c4 = vec4f(c3.xyz * color.xyz, color.w);
	return c4;
}

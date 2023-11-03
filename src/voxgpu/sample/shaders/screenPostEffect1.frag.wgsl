@group(0) @binding(0) var<uniform> color: vec4f;
@group(0) @binding(1) var<storage> params: array<vec4<f32>>;

fn calcColor3(vtxUV: vec2f) -> vec3f{

	let stSize = params[1].zw;
	let time = params[2].x;
    let fragCoord = vtxUV * stSize;

	let color1 = vec3f(1.7, 0.25, 0.5);
	let color2 = vec3f(0.5, 0.7, 0.25);
	let color3 = vec3f(0.25, 0.5, 0.7);
	let point1 = stSize * 0.5 + vec2f(sin(time*2.0) * 10.0, cos(time*2.0) * 50.0) * (vtxUV - 0.5) * 4.0;
	let point2 = stSize * 0.5 + vec2f(sin(time) * 75.0, cos(time)*50.0);
	let point3 = stSize * 0.5 + vec2f(sin(time) * 25.0, sin(time*2.0)*50.0)*2.0;
	
	let dist1 = fragCoord - point1;
	let intensity1 = pow(32.0/(0.01+length(dist1)), 2.0);
	
	let dist2 = fragCoord - point2;
	let intensity2 = pow(3.0/(0.01+length(dist2)), 2.0);
	
	let dist3 = fragCoord - point3;
	let intensity3 = pow(80.0/(0.01+length(dist3)), 1.0);
	
	return vec3f((color1*intensity1 + color2*intensity2 + color3*intensity3)*modf(fragCoord.y/2.0).fract);
}

@fragment
fn main(
	@location(0) uv: vec2f
	) -> @location(0) vec4f {
	//let c3 = calcColor3(fract(uv/0.5));
	let c3 = calcColor3( uv );
	let c4 = vec4f(c3.xyz * color.xyz, color.w);
	return c4;
}

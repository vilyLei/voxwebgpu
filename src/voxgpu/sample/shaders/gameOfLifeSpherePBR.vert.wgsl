
@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;

@group(0) @binding(3) var<uniform> grid: vec2f;
@group(0) @binding(4) var<storage> cellState: array<u32>;
@group(0) @binding(5) var<storage> lifeState: array<f32>;
@group(0) @binding(6) var<storage> wpositions: array<vec4f>;

struct VertexInput {
	@location(0) pos: vec3f,
  	@location(1) uv : vec2f,
  	@location(2) normal : vec3f,
	@builtin(instance_index) instance: u32
};

struct VertexOutput {
	@builtin(position) position: vec4f,
	@location(0) pos : vec4<f32>,
	@location(1) uv: vec2f,
	@location(2) normal : vec3<f32>,
	@location(3) camPos : vec3<f32>,
	@location(4) albedo : vec3<f32>,
	@location(5) param : vec3<f32>,
};

fn m44ToM33(m: mat4x4<f32>) -> mat3x3<f32> {
	return mat3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}
fn inverseM33(m: mat3x3<f32>)-> mat3x3<f32> {
    let a00 = m[0][0]; let a01 = m[0][1]; let a02 = m[0][2];
    let a10 = m[1][0]; let a11 = m[1][1]; let a12 = m[1][2];
    let a20 = m[2][0]; let a21 = m[2][1]; let a22 = m[2][2];
    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    return mat3x3<f32>(
		vec3<f32>(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11)) / det,
                vec3<f32>(b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10)) / det,
                vec3<f32>(b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det);
}
fn inverseM44(m: mat4x4<f32>)-> mat4x4<f32> {
    let a00 = m[0][0]; let a01 = m[0][1]; let a02 = m[0][2]; let a03 = m[0][3];
    let a10 = m[1][0]; let a11 = m[1][1]; let a12 = m[1][2]; let a13 = m[1][3];
    let a20 = m[2][0]; let a21 = m[2][1]; let a22 = m[2][2]; let a23 = m[2][3];
    let a30 = m[3][0]; let a31 = m[3][1]; let a32 = m[3][2]; let a33 = m[3][3];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	return mat4x4<f32>(
		vec4<f32>(a11 * b11 - a12 * b10 + a13 * b09,
		a02 * b10 - a01 * b11 - a03 * b09,
		a31 * b05 - a32 * b04 + a33 * b03,
		a22 * b04 - a21 * b05 - a23 * b03) / det,
			vec4<f32>(a12 * b08 - a10 * b11 - a13 * b07,
		a00 * b11 - a02 * b08 + a03 * b07,
		a32 * b02 - a30 * b05 - a33 * b01,
		a20 * b05 - a22 * b02 + a23 * b01) / det,
		vec4<f32>(a10 * b10 - a11 * b08 + a13 * b06,
		a01 * b08 - a00 * b10 - a03 * b06,
		a30 * b04 - a31 * b02 + a33 * b00,
		a21 * b02 - a20 * b04 - a23 * b00) / det,
		vec4<f32>(a11 * b07 - a10 * b09 - a12 * b06,
		a00 * b09 - a01 * b07 + a02 * b06,
		a31 * b01 - a30 * b03 - a32 * b00,
		a20 * b03 - a21 * b01 + a22 * b00) / det);
}

@vertex
fn vertMain(input: VertexInput) -> VertexOutput {

    var state = f32(cellState[input.instance]);
    var output: VertexOutput;
	let f = clamp((lifeState[ input.instance ])/100.0, 0.0005, 1.0);
	var scale = 0.5;
	if(state < 1.0) {
		scale = 0.1;
	}
	var scaleY = 5.0;
	if(state < 1.0) {
		scaleY = 1.0;
	}
    var wpos = objMat * vec4f(input.pos.xyz * vec3f(f * 0.5 + scale, f * scaleY + scale , f * 0.5 + scale), 1.0);
	wpos = vec4f(wpos.xyz + wpositions[ input.instance ].xyz, wpos.w);

  	let invMat33 = inverseM33( m44ToM33( objMat ) );
	output.normal = normalize( input.normal * invMat33 );
  	output.camPos = (inverseM44(viewMat) * vec4<f32>(0.0,0.0,0.0, 1.0)).xyz;
  	output.pos = wpos;

    let i = f32(input.instance);
    let cell = vec2f(i % grid.x, floor(i / grid.x));



    var projPos = projMat * viewMat * wpos;
	// if(state < 1.0) {
	// 	projPos = vec4f(projPos.xyz, -1);
	// }
    output.position = projPos;

    output.uv = input.uv;

	let c = cell / grid;
	var dis = length(input.uv - vec2<f32>(0.5, 0.5));
	dis = min(dis/0.51, 1.0);
	dis = (1.0 - pow(dis, 50.0)) * (1.0 - f) + f;
	var c3 = vec3f(c, (1.0 - c.x) * (1.0 - f) + f) * dis;
    output.albedo = c3 * 2.0;
	output.param = vec3f(1.1, 0.6 - (f* 0.6) + 0.1, 0.5 + (f* 0.5));
    return output;
}
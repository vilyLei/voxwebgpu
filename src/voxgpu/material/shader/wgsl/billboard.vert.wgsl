@group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
@group(0) @binding(1) var<uniform> viewMat : mat4x4<f32>;
@group(0) @binding(2) var<uniform> projMat : mat4x4<f32>;
@group(0) @binding(3) var<uniform> billParam: vec4<f32>;

struct VertexOutput {
	@builtin(position) Position : vec4<f32>,
	@location(0) uv : vec2<f32>
}

@vertex
fn main(
	@location(0) position : vec3<f32>,
	@location(1) uv : vec2<f32>
) -> VertexOutput {

    let cosv = cos(billParam.z);
    let sinv = sin(billParam.z);
    let vtx = position.xy * billParam.xy;
    let vtx_pos = vec2<f32>(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
    var viewV = viewMat * objMat * vec4f(0.0,0.0,0.0,1.0);
    viewV = vec4<f32>(viewV.xy + vtx_pos.xy, viewV.zw);
    var projV =  projMat * viewV;
    projV.z = ((projV.z / projV.w) + billParam.w) * projV.w;
	var output : VertexOutput;
	output.Position = projV;
	output.uv = uv;
	return output;
}
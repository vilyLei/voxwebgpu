
#include <mathDefine>

struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) worldPos: vec4<f32>,
	@location(1) uv: vec2<f32>,
	@location(2) worldNormal: vec3<f32>,
	@location(3) worldCamPos: vec3<f32>
}

#include <matrix>

@vertex
fn vertMain(
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>
) -> VertexOutput {
    var wpos = objMat * vec4(position.xyz, 1.0);
    var output: VertexOutput;
    output.Position = projMat * viewMat * wpos;
    output.uv = uv;

    let invMat33 = inverseM33(m44ToM33(objMat));
    output.worldNormal = normalize(normal * invMat33);
    output.worldCamPos = (inverseM44(viewMat) * vec4<f32>(0.0, 0.0, 0.0, 1.0)).xyz;
    output.worldPos = wpos;
    return output;
}

#include <mathDefine>

struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) worldPos: vec4<f32>,
	@location(1) uv: vec2<f32>,
	@location(2) worldNormal: vec3<f32>,
	@location(3) worldCamPos: vec3<f32>,
	@location(4) viewPos: vec4<f32>,
	@location(5) svPos: vec4<f32>
}

#include <matrix>

@vertex
fn vertMain(
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>
) -> VertexOutput {
    let wpos = objMat * vec4(position.xyz, 1.0);
    var output: VertexOutput;
    let viewPos = viewMat * wpos;
    output.Position = projMat * viewPos;
    output.uv = uv;

    let invMat33 = inverseM33(m44ToM33(objMat));
    output.worldNormal = normalize(normal * invMat33);
    output.worldCamPos = (inverseM44(viewMat) * vec4<f32>(0.0, 0.0, 0.0, 1.0)).xyz;
    output.worldPos = wpos;
    output.viewPos = viewPos;
    
    #ifdef USE_VSM_SHADOW
    output.svPos = shadowMatrix * wpos;
    #endif
    return output;
}
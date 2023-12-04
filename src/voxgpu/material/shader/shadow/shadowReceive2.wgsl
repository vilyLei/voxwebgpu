
#include <matrix>
#include <vsmShadowHead>

struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) uv: vec2<f32>,
	@location(1) worldNormal: vec3<f32>,
	@location(2) svPos: vec4<f32>
}
@vertex
fn vertMain(
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>,
    @location(2) normal: vec3<f32>
) -> VertexOutput {
    let objPos = vec4(position.xyz, 1.0);
    let wpos = objMat * objPos;
    var output: VertexOutput;
    let projPos = projMat * viewMat * wpos;
    output.Position = projPos;
    // output.normal = normal;
    let invMat33 = inverseM33(m44ToM33(objMat));
    output.uv = uv;
    output.worldNormal = normalize(normal * invMat33);
    output.svPos = shadowMatrix * wpos;
    return output;
}

@fragment
fn fragMain(
    @location(0) uv: vec2<f32>,
    @location(1) worldNormal: vec3<f32>,
    @location(2) svPos: vec4<f32>
) -> @location(0) vec4<f32> {
    var color = vec4<f32>(1.0);
    
    var color4 = color;
    useVSMShadow(worldNormal, svPos, &color4);
    return color4;
}
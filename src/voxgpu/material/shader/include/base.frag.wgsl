#include <mathDefine>
#include <pbrFunctions>
#include <fragOutput>

@fragment
fn fragMain(
  @location(0) worldPos: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) worldNormal: vec3<f32>,
  @location(3) worldCamPos: vec3<f32>,
	@location(4) viewPos: vec4<f32>
) -> @location(0) vec4<f32> {
  // var color4 = calcColor4(worldPos, viewPos, uv, worldNormal, worldCamPos);
  var calcParam: CalcColor4Param;
  calcParam.worldPos = worldPos;
  calcParam.uv = uv;
  calcParam.worldNormal = worldNormal;
  calcParam.worldCamPos = worldCamPos;
  calcParam.viewPos = viewPos;

  var color4 = calcColor4(calcParam);
  return color4;
}
#include <mathDefine>
#include <pbrFunctions>

struct CalcColor4Param {
	worldPos: vec4<f32>,
	viewPos: vec4<f32>,
	uv: vec2<f32>,
	worldNormal: vec3<f32>,
  
  #ifdef USE_VSM_SHADOW
	svPos: vec4<f32>,
  #endif
	worldCamPos: vec3<f32>
}

#ifdef USE_FOG
#include <fogFragHead>
#endif

#ifdef USE_VSM_SHADOW
#include <vsmShadowHead>
#endif
#include <fragOutput>

@fragment
fn fragMain(
  @location(0) worldPos: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) worldNormal: vec3<f32>,
  @location(3) worldCamPos: vec3<f32>,
	@location(4) viewPos: vec4<f32>,
  @location(5) svPos: vec4<f32>
) -> @location(0) vec4<f32> {
  // var color4 = calcColor4(worldPos, viewPos, uv, worldNormal, worldCamPos);
  var calcParam: CalcColor4Param;
  calcParam.worldPos = worldPos;
  calcParam.uv = uv;
  calcParam.worldNormal = worldNormal;
  calcParam.worldCamPos = worldCamPos;
  calcParam.viewPos = viewPos;
  #ifdef USE_VSM_SHADOW
  calcParam.svPos = svPos;
  #endif

  var color4 = calcColor4(calcParam);
  return color4;
}
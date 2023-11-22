
fn gammaToLinear(color: vec3<f32>) -> vec3<f32> {
    return pow(color.rgb, vec3Gamma);
}

fn getNormalFromMap(texUV: vec2<f32>, wpos: vec3<f32>, nv: vec3<f32>) -> vec3<f32> {
    let tangentNormal = textureSample(normalTexture, normalSampler, texUV).xyz * 2.0 - 1.0;

    let Q1  = dpdx(wpos);
    let Q2  = dpdy(wpos);
    let st1 = dpdx(texUV);
    let st2 = dpdy(texUV);

    let N   = normalize(nv);
    // let T  = normalize(Q1*st2.t - Q2*st1.t);
	// uv -> st
    let T  = normalize(Q1*st2.y - Q2*st1.y);
    let B  = -normalize(cross(N, T));
    let TBN = mat3x3<f32>(T, B, N);

    return TBN * tangentNormal;
}
fn getNormalMapvalue(texUV: vec2<f32>) -> vec3<f32> {
    return textureSample(normalTexture, normalSampler, texUV).xyz * 2.0 - 1.0;
}

fn perturbNormal2Arb( eyePos: vec3<f32>, surfNorm: vec3<f32>, mapN: vec3<f32>, texUV: vec2<f32> ) -> vec3<f32> {

	let q0 = vec3<f32>( dpdx( eyePos.x ), dpdx( eyePos.y ), dpdx( eyePos.z ) );
	let q1 = vec3<f32>( dpdy( eyePos.x ), dpdy( eyePos.y ), dpdy( eyePos.z ) );
	let st0 = dpdx( texUV.xy );
	let st1 = dpdy( texUV.xy );
	let N = surfNorm;
	let q0perp = cross( N, q0 );
	let q1perp = cross( q1, N );
	let T = q1perp * st0.x + q0perp * st1.x;
	let B = q1perp * st0.y + q0perp * st1.y;
	let det = max( dot( T, T ), dot( B, B ) );
	var scale = 0.0;
	if( det != 0.0 ) { scale = inverseSqrt( det );}
	return normalize( T * ( mapN.x * scale ) + B * ( mapN.y * scale ) + N * mapN.z );
}

fn perturbNormal2ArbFromMap(texUV: vec2<f32>, eyePos: vec3<f32>, surfNorm: vec3<f32> ) -> vec3<f32> {
	let mapN = textureSample(normalTexture, normalSampler, texUV).xyz * 2.0 - 1.0;
	return perturbNormal2Arb(eyePos, surfNorm, mapN, texUV);
}

fn rotateY(dir: vec3<f32>, radian: f32) -> vec3<f32> {
	var result: vec3<f32>;
	result.x = cos(radian) * dir.x - sin(radian) * dir.z;
	result.y = dir.y;
	result.z = sin(radian) * dir.x + cos(radian) * dir.z;
	return result;
}
fn getWorldEnvDirWithRad(rotateAngle: f32, worldNormal: vec3<f32>, worldInvE: vec3<f32>) -> vec3<f32> {
	let worldR = reflect(worldInvE, worldNormal) * vec3(1.0, -1.0, -1.0);
    // worldR.zy *= vec2(-1.0);
	return rotateY(worldR, rotateAngle);
}
fn getWorldEnvDir(worldNormal: vec3<f32>, worldInvE: vec3<f32>) -> vec3<f32> {
	return reflect(worldInvE, worldNormal) * vec3(1.0, -1.0, -1.0);
	// var worldR = reflect(worldInvE, worldNormal);
    // worldR.zy *= vec2(-1.0);
    // return worldR;
}



const hdrBrnDecodeVec4 = vec4<f32>(255.0, 2.55, 0.0255, 0.000255);
fn rgbaToHdrBrn(color: vec4<f32>) -> f32 {
    return dot(hdrBrnDecodeVec4, color);
}


const OneOnLN2_x6 = 8.656171;// == 1/ln(2) * 6 (6 is SpecularPower of 5 + 1)
// dot: dot(N,V) or dot(H,V)
fn fresnelSchlick3(specularColor: vec3<f32>, dot: f32, glossiness: f32) -> vec3<f32> {
	return specularColor + (max(vec3(glossiness), specularColor) - specularColor) * exp2(-OneOnLN2_x6 * dot);
}
fn fresnelSchlickWithRoughness(specularColor: vec3<f32>, L: vec3<f32>, N: vec3<f32>, gloss: f32) -> vec3<f32> {
   return specularColor + (max(vec3(gloss), specularColor) - specularColor) * pow(1.0 - saturate(dot(L, N)), 5.0);
}
fn FD_Schlick(VoH: f32, f0: f32, f90: f32) -> f32 {
	return f0 + (f90 - f0) * pow(1.0 - VoH, 5.0);
}
fn FD_SchlickVec3(specularColor: vec3<f32>, dotLH: f32) -> vec3<f32> {

	// Original approximation by Christophe Schlick '94
	//float fresnel = pow( 1.0 - dotLH, 5.0 );
	// Optimized variant (presented by Epic at SIGGRAPH '13)
	// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf

	let fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
	return (vec3One - specularColor) * fresnel + specularColor;
}

// #ifdef VOX_WOOL
fn FD_BurleyWool(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	let lightScatter = FD_Schlick(NoL, 1.0, f90);
	let viewScatter = FD_Schlick(NoV, 1.0, f90);
	return lightScatter * viewScatter;
}
fn getColorFactorIntensity(NoV: f32, frontScale: f32, sideScale: f32) -> f32 {
	let invNoV = 1.0 - NoV;
	let x2 = invNoV * invNoV;
	let x3 = x2 * invNoV;
	let x4 = x3 * invNoV;
	let x5 = x4 * invNoV;
	let k = clamp(-10.15 * x5 + 20.189 * x4 - 12.811 * x3 + 4.0585 * x2 - 0.2931 * invNoV, 0.0, 1.0);
	// sideFactorIntensity
	return mix(frontScale, sideScale, k);
}
// #else
fn FD_Burley(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32, frontScale: f32, sideScale: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	let lightScatter = FD_Schlick(NoL, 1.0, f90);
	let viewScatter = FD_Schlick(NoV, frontScale, sideScale * f90);
	return lightScatter * viewScatter;
}
// #endif

fn geometrySchlickGGX(NdotV: f32, roughness: f32) -> f32
{
    let r = (roughness + 1.0);
    let k = (r*r) / 8.0;

    let nom   = NdotV;
    let denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
fn distributionGGX(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
    let a = roughness*roughness;
    let a2 = a*a;
    let NdotH = max(dot(N, H), 0.0);
    let NdotH2 = NdotH*NdotH;

    let nom   = a2;
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.0000001); // prevent divide by zero for roughness=0.0 and NdotH=1.0
}
fn geometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
    let NdotV = max(dot(N, V), 0.0);
    let dotNL = max(dot(N, L), 0.0);
    let ggx2 = geometrySchlickGGX(NdotV, roughness);
    let ggx1 = geometrySchlickGGX(dotNL, roughness);

    return ggx1 * ggx2;
}

fn tonemapReinhard(color: vec3<f32>, exposure: f32) -> vec3<f32> {
  let c = color * exposure;
  return c / (1.0 + c);
}
fn linearToGammaVec3(color: vec3<f32>) -> vec3<f32> {
    return pow(color.xyz, vec3ReciprocalGamma);
}

@group(0) @binding(3) var<uniform> ambient: vec4<f32>;
@group(0) @binding(4) var<storage> armsParams: array<vec4<f32>>;
@group(0) @binding(5) var<uniform> uvParam: vec4<f32>;
@group(0) @binding(6) var<storage> params: array<vec4<f32>>;
@group(0) @binding(7) var<uniform> lightParam: vec4<u32>;
@group(0) @binding(8) var<storage> lights: array<vec4<f32>>;
@group(0) @binding(9) var<storage> lightColors: array<vec4<f32>>;

@group(0) @binding(10) var specularEnvSampler: sampler;
@group(0) @binding(11) var specularEnvTexture: texture_cube<f32>;
@group(0) @binding(12) var albedoSampler: sampler;
@group(0) @binding(13) var albedoTexture: texture_2d<f32>;
@group(0) @binding(14) var normalSampler: sampler;
@group(0) @binding(15) var normalTexture: texture_2d<f32>;
@group(0) @binding(16) var aoSampler: sampler;
@group(0) @binding(17) var aoTexture: texture_2d<f32>;
@group(0) @binding(18) var roughnessSampler: sampler;
@group(0) @binding(19) var roughnessTexture: texture_2d<f32>;
@group(0) @binding(20) var metallicSampler: sampler;
@group(0) @binding(21) var metallicTexture: texture_2d<f32>;

const PI = 3.141592653589793;
const PI2 = 6.283185307179586;
const PI_HALF = 1.5707963267948966;
const RECIPROCAL_PI = 0.3183098861837907;
const RECIPROCAL_PI2 = 0.15915494309189535;
const EPSILON = 1e-6;
const VOX_GAMMA = 2.2;
const vec3Gamma = vec3<f32>(VOX_GAMMA);

const vec3One = vec3<f32>(1.0);
const vec3ReciprocalGamma = vec3<f32>(1.0 / VOX_GAMMA);

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


struct RadianceLight {
	diffuse: vec3<f32>,
	specular: vec3<f32>,
    scatterIntensity: vec3<f32>,
    F0: vec3<f32>,
    N: vec3<f32>,
    V: vec3<f32>,
    L: vec3<f32>,
    specularColor: vec3<f32>,

    dotNV: f32,
    frontIntensity: f32,
    sideIntensity: f32,
    specularPower: f32
}

fn calcPBRLight(roughness: f32, rm: vec3<f32>, inColor: vec3<f32>, ptr_rL: ptr<function, RadianceLight>) {
    // rm is remainder metallic: vec3(1.0 - metallic)
	let rL = *ptr_rL;
    let H = normalize(rL.V + rL.L);

	var lightColor = inColor;

    // scale light by dotNL
    let dotNL = max(dot(rL.N, rL.L), 0.0);
    let dotLH = max(dot(rL.L, H), 0.0);
    let dotNH = max(dot(rL.N, H), 0.0);

    // Cook-Torrance BRDF
    let NDF = distributionGGX(rL.N, H, roughness);
    let G   = geometrySmith(rL.N, rL.V, rL.L, roughness);
    let F    = fresnelSchlick3(rL.F0, rL.dotNV, roughness);

    let nominator    = NDF * G * F;
    let denominator = 4.0 * rL.dotNV * dotNL;
    let specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or dotNL=0.0

    var kD = (vec3One - F ) * rm;

    // #ifdef VOX_WOOL
    let fdBurley = FD_BurleyWool(roughness, rL.dotNV, dotNL, dotLH);
    // #else
    // let fdBurley = FD_Burley(roughness, rL.dotNV, dotNL, dotLH, rL.frontIntensity, rL.sideIntensity);
    // #endif
    // #ifdef VOX_SCATTER
    var specularScatter = rL.scatterIntensity * fresnelSchlick3(rL.specularColor, dotLH, 1.0) * ((rL.specularPower + 2.0) * 0.125) * pow(dotNH, rL.specularPower);
    // #else
    //     vec3 specularScatter = vec3One;
    // #endif

    // add to outgoing radiance Lo
    lightColor *= dotNL;

    // #ifdef VOX_SPECULAR_BLEED
    // kD *= specularScatter;
    // #endif
    (*ptr_rL).diffuse += fdBurley * lightColor * kD * (1.0 + specularScatter);
    (*ptr_rL).specular += specular * lightColor * specularScatter;
}

fn chaneColorTest(color: ptr<function, vec4<f32>>) {
	*color = vec4<f32>(1.0);
}
fn chaneColorTestV3(color: ptr<function, vec3<f32>>) {
	*color = vec3<f32>(1.0);
}

fn calcColor4(worldPos: vec4<f32>, uv: vec2<f32>, worldNormal: vec3<f32>, worldCamPos: vec3<f32>) -> vec4<f32> {
	var color = vec3f(0.0);


	var albedo = params[0].xyz;
	let fresnel = params[1].xyz;
	let toneParam = params[2];
	let param = params[3];

	let arms = armsParams[0];
	let armsBase = armsParams[1];
    var param4 = arms;
    var color4: vec4<f32>;
    var metallic = arms.z;
    var roughness = arms.y;
    var ao = arms.x;

	var texUV = uv.xy * uvParam.xy;
	let worldPosition = worldPos.xyz;

	let V = normalize(worldCamPos.xyz - worldPosition);
	var N = worldNormal;

	N = getNormalFromMap( texUV, worldPosition.xyz, worldNormal);
	let normalFactor = 1.0;
    N = normalize(mix(worldNormal, N, normalFactor));

 	//	#ifdef VOX_USE_GLOSSINESS
    //	    colorGlossiness = 1.0 - roughness;
    //	#else
    //	    colorGlossiness = roughness;
    //	#endif

    let dotNV = clamp(dot(N, V), 0.0, 1.0);

	albedo = albedo.xyz * textureSample(albedoTexture, albedoSampler, texUV).xyz;
	ao = mix(0.0, max(textureSample(aoTexture, aoSampler, texUV).x, armsBase.x), ao);
	roughness = mix(0.0, max(textureSample(roughnessTexture, roughnessSampler, texUV).y, armsBase.y), roughness);
	let texMetallic = textureSample(metallicTexture, metallicSampler, texUV).z;
	metallic = mix(0.0, max(texMetallic, armsBase.z), metallic);
	// return vec4<f32>(vec3(metallic), 1.0);

	let colorGlossiness = clamp(1.0 - roughness, 0.0, 1.0);
    let reflectionIntensity = 1.0;
    var glossinessSquare = colorGlossiness * colorGlossiness;
    let specularPower = exp2(8.0 * glossinessSquare + 1.0);

	var F0 = fresnel.xyz + vec3(0.04);
    F0 = mix(F0, albedo.xyz, metallic);

	albedo = gammaToLinear(albedo);

	var specularColor = vec3(mix(0.025 * reflectionIntensity, 0.078 * reflectionIntensity, colorGlossiness));
    // #ifdef VOX_METALLIC_CORRECTION
	let specularColorMetal = mix(F0, albedo.xyz, vec3<f32>(metallic));
	let ratio = clamp(metallic, 0.0, 1.0);
	specularColor = mix(specularColor, specularColorMetal, ratio);
    // #endif
	// return vec4<f32>(albedo, 1.0);
    albedo = mix(albedo, F0, metallic);

	// let specularFactor = vec3<f32>(1.0);
	let specularFactor = params[4].xyz;
    specularColor *= specularFactor;

	// let mipLvFactor = 0.07;
	let mipLvFactor = param.z;
	var mipLv = floor(100.0 * fract(mipLvFactor));
	mipLv -= glossinessSquare * mipLv;
	mipLv = max(mipLv + floor(mipLvFactor), 0.0);
	var envDir = -getWorldEnvDir(N, -V) * vec3<f32>(-1.0, 1.0, 1.0);

	let specularEnvTexel = textureSampleLevel(specularEnvTexture, specularEnvSampler, envDir, mipLv);
	let brnEnvValue = rgbaToHdrBrn(specularEnvTexel);
	var specularEnvColor3 = vec3<f32>(brnEnvValue);
	specularEnvColor3 = gammaToLinear(specularEnvColor3);
	specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * specularEnvColor3;

	var rL: RadianceLight;

	let frontIntensity = toneParam.z;
    var sideIntensity = toneParam.w;
	var diffuse = albedo.xyz * RECIPROCAL_PI;
    var rm = vec3(1.0 - metallic); // remainder metallic

	let sColor0 = specularColor;

	rL.scatterIntensity = param.www;
    rL.F0 = F0;
    rL.specularColor = specularColor;
    rL.dotNV = dotNV;
    rL.N = N;
    rL.V = V;
    rL.specularPower = specularPower;
    rL.frontIntensity = frontIntensity;
    rL.sideIntensity = sideIntensity;

	let ptr_rL = &rL;

	let pointsTotal = min(lightParam.x, u32(128));
	//arrayLength(&lights);

	var light: vec4<f32>;
	var lightColor: vec4<f32>;
	var factor: f32 = 1.0;
	for(var i: u32  = u32(0); i < pointsTotal; i++) {
		// calculate per-light radiance
		light = lights[i];
		lightColor = lightColors[i];
		rL.L = (light.xyz - worldPosition.xyz);
		factor = length(rL.L);
		factor = 1.0 / (1.0 + light.w * factor + lightColor.w * factor * factor);
		rL.L = normalize(rL.L);
		calcPBRLight(roughness, rm, lightColor.xyz * factor,&rL);
	}

	specularColor = (rL.specular + specularColor);

	var Lo = (rL.diffuse * diffuse + specularColor) * ao;

	// ambient lighting (note that the next IBL tutorial will replace
    // this ambient lighting with environment lighting).
    var ambient = ((color + ambient.xyz) * albedo.xyz) * ao;

	// #ifdef VOX_WOOL
	sideIntensity = getColorFactorIntensity(dotNV, frontIntensity, sideIntensity);
	ambient *= sideIntensity;
	Lo *= sideIntensity * frontIntensity;
	// #endif

    color = ambient + Lo;

	// HDR tonemapping
    // #ifdef VOX_TONE_MAPPING
    color = tonemapReinhard( color, toneParam.x );
    // #endif


    // gamma correct
    color = linearToGammaVec3(color);

	color4 = vec4<f32>(color, 1.0);

	return color4;
}
@fragment
fn fragMain(
  @location(0) worldPos: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) worldNormal: vec3<f32>,
  @location(3) worldCamPos: vec3<f32>
) -> @location(0) vec4<f32> {
  var color4 = calcColor4(worldPos, uv, worldNormal, worldCamPos);
  return color4;
}

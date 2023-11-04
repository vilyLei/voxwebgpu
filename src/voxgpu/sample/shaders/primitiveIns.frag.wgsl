@group(0) @binding(4) var<uniform> albedo: vec4f;
@group(0) @binding(5) var<uniform> arm: vec4f;

const PI = 3.141592653589793;
const PI2 = 6.283185307179586;
const PI_HALF = 1.5707963267948966;
const RECIPROCAL_PI = 0.3183098861837907;
const RECIPROCAL_PI2 = 0.15915494309189535;
const EPSILON = 1e-6;

fn approximationSRGBToLinear(srgbColor: vec3<f32>) -> vec3<f32> {
    return pow(srgbColor, vec3<f32>(2.2));
}
fn approximationLinearToSRCB(linearColor: vec3<f32>) -> vec3<f32> {
    return pow(linearColor, vec3(1.0/2.2));
}

fn accurateSRGBToLinear(srgbColor: vec3<f32>) -> vec3<f32> {
    let linearRGBLo = srgbColor / 12.92;
    let linearRGBHi = pow((srgbColor + vec3(0.055)) / vec3(1.055), vec3(2.4));
	if( all( srgbColor <= vec3(0.04045) ) ) {
		return linearRGBLo;
	}
    return linearRGBHi;
}
fn accurateLinearToSRGB(linearColor: vec3<f32>) -> vec3<f32> {
    let srgbLo = linearColor * 12.92;
    let srgbHi = (pow(abs(linearColor), vec3(1.0 / 2.4)) * 1.055) - 0.055;
    if(all(linearColor <= vec3(0.0031308))) {
		return srgbLo;
	}
    return srgbHi;
}

// Trowbridge-Reitz(Generalized-Trowbridge-Reitz,GTR)
fn DistributionGTR1(NdotH: f32, roughness: f32) -> f32 {
    if (roughness >= 1.0) {
		return 1.0/PI;
	}
    let a2 = roughness * roughness;
    let t = 1.0 + (a2 - 1.0)*NdotH*NdotH;
    return (a2 - 1.0) / (PI * log(a2) *t);
}
fn DistributionGTR2(NdotH: f32, roughness: f32) -> f32 {
    let a2 = roughness * roughness;
    let t = 1.0 + (a2 - 1.0) * NdotH * NdotH;
    return a2 / (PI * t * t);
}


fn DistributionGGX(N: vec3<f32>, H: vec3<f32>, roughness: f32) -> f32 {
    let a = roughness*roughness;
    let a2 = a*a;
    let NdotH = max(dot(N, H), 0.0);
    let NdotH2 = NdotH*NdotH;

    let nom   = a2;
    var denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / max(denom, 0.0000001); // prevent divide by zero for roughness=0.0 and NdotH=1.0
}


fn GeometryImplicit(NdotV: f32, NdotL: f32) -> f32 {
    return NdotL * NdotV;
}

// ----------------------------------------------------------------------------
fn GeometrySchlickGGX(NdotV: f32, roughness: f32) -> f32 {
    let r = (roughness + 1.0);
    let k = (r*r) / 8.0;

    let nom   = NdotV;
    let denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
// ----------------------------------------------------------------------------
fn GeometrySmith(N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, roughness: f32) -> f32 {
    let NdotV = max(dot(N, V), 0.0);
    let NdotL = max(dot(N, L), 0.0);
    let ggx2 = GeometrySchlickGGX(NdotV, roughness);
    let ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}

// @param cosTheta is clamp(dot(H, V), 0.0, 1.0)
fn fresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}
fn fresnelSchlick2(specularColor: vec3<f32>, L: vec3<f32>, H: vec3<f32>) -> vec3<f32> {
   return specularColor + (1.0 - specularColor) * pow(1.0 - saturate(dot(L, H)), 5.0);
}
//fresnelSchlick2(specularColor, L, H) * ((SpecularPower + 2) / 8 ) * pow(saturate(dot(N, H)), SpecularPower) * dotNL;

const OneOnLN2_x6 = 8.656171;// == 1/ln(2) * 6 (6 is SpecularPower of 5 + 1)
// dot -> dot(N,V) or
fn fresnelSchlick3(specularColor: vec3<f32>, dot: f32, glossiness: f32) -> vec3<f32> {
	return specularColor + (max(vec3(glossiness), specularColor) - specularColor) * exp2(-OneOnLN2_x6 * dot);
}
fn fresnelSchlickWithRoughness(specularColor: vec3<f32>, L: vec3<f32>, N: vec3<f32>, gloss: f32) -> vec3<f32> {
   return specularColor + (max(vec3(gloss), specularColor) - specularColor) * pow(1.0 - saturate(dot(L, N)), 5.0);
}

const A = 2.51f;
const B = 0.03f;
const C = 2.43f;
const D = 0.59f;
const E = 0.14f;
fn ACESToneMapping(color: vec3<f32>, adapted_lum: f32) -> vec3<f32> {

	let c = color * adapted_lum;
	return (c * (A * c + B)) / (c * (C * c + D) + E);
}

//color = color / (color + vec3(1.0));
fn reinhard(v: vec3<f32>) -> vec3<f32> {
    return v / (vec3<f32>(1.0) + v);
}
fn reinhard_extended(v: vec3<f32>, max_white: f32) -> vec3<f32> {
    let numerator = v * (1.0f + (v / vec3(max_white * max_white)));
    return numerator / (1.0f + v);
}
fn luminance(v: vec3<f32>) -> f32 {
    return dot(v, vec3<f32>(0.2126f, 0.7152f, 0.0722f));
}

fn change_luminance(c_in: vec3<f32>, l_out: f32) -> vec3<f32> {
    let l_in = luminance(c_in);
    return c_in * (l_out / l_in);
}
fn reinhard_extended_luminance(v: vec3<f32>, max_white_l: f32) -> vec3<f32> {
    let l_old = luminance(v);
    let numerator = l_old * (1.0f + (l_old / (max_white_l * max_white_l)));
    let l_new = numerator / (1.0f + l_old);
    return change_luminance(v, l_new);
}
fn ReinhardToneMapping( color: vec3<f32>, toneMappingExposure: f32 ) -> vec3<f32> {

	let c = color * toneMappingExposure;
	return saturate( c / ( vec3( 1.0 ) + c ) );

}
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
const highp_a = 12.9898;
const highp_b = 78.233;
const highp_c = 43758.5453;
fn rand( uv: vec2<f32> ) -> f32 {
	let dt = dot( uv.xy, vec2<f32>( highp_a, highp_b ) );
	let sn = modf( dt / PI ).fract;
	return fract(sin(sn) * highp_c);
}
// // based on https://www.shadertoy.com/view/MslGR8
fn dithering( color: vec3<f32>, fragCoord: vec2<f32> ) -> vec3<f32> {
    //Calculate grid position
    let grid_position = rand( fragCoord );

    //Shift the individual colors differently, thus making it even harder to see the dithering pattern
    var dither_shift_RGB = vec3<f32>( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

    //modify shift acording to grid position.
    dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

    //shift the color by dither_shift
    return color + dither_shift_RGB;
}

const dis = 600.0;
const disY = 400.0;
const u_lightPositions = array<vec3<f32>, 4>(
	vec3<f32>(-dis, disY, dis),
	vec3<f32>(dis, disY, dis),
	vec3<f32>(-dis, disY, -dis),
	vec3<f32>(dis, disY, -dis)
);
const colorValue = 300.0;
const u_lightColors = array<vec3<f32>, 4>(
	vec3<f32>(colorValue, colorValue, colorValue),
	vec3<f32>(colorValue, colorValue, colorValue),
	vec3<f32>(colorValue, colorValue, colorValue),
	vec3<f32>(colorValue, colorValue, colorValue),
);

fn calcPBRColor3(Normal: vec3<f32>, WorldPos: vec3<f32>, camPos: vec3<f32>) -> vec3<f32> {

	var color = vec3<f32>(0.0);

    var ao = arm.x;
    var roughness = arm.y;
    var metallic = arm.z;

	var N = normalize(Normal);
    var V = normalize(camPos.xyz - WorldPos);
    var dotNV = clamp(dot(N, V), 0.0, 1.0);

    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)
    var F0 = vec3(0.04);
    F0 = mix(F0, albedo.xyz, metallic);

    // reflectance equation
    var Lo = vec3(0.0);

	for (var i: i32 = 0; i < 4; i++) {
		// calculate per-light radiance
        let L = normalize(u_lightPositions[i].xyz - WorldPos);
        let H = normalize(V + L);
        let distance = length(u_lightPositions[i].xyz - WorldPos);

        let attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0003 * distance * distance);
        let radiance = u_lightColors[i].xyz * attenuation;

        // Cook-Torrance BRDF
        let NDF = DistributionGGX(N, H, roughness);
        let G   = GeometrySmith(N, V, L, roughness);
        //vec3 F    = fresnelSchlick(clamp(dot(H, V), 0.0, 1.0), F0);
        let F    = fresnelSchlick3(F0,clamp(dot(H, V), 0.0, 1.0), 0.9);
        //vec3 F    = fresnelSchlick3(F0,dotNV, 0.9);

        let nominator    = NDF * G * F;
        let denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);
        let specular = nominator / max(denominator, 0.001); // prevent divide by zero for NdotV=0.0 or NdotL=0.0

        // kS is equal to Fresnel
        let kS = F;
        // for energy conservation, the diffuse and specular light can't
        // be above 1.0 (unless the surface emits light); to preserve this
        // relationship the diffuse component (kD) should equal 1.0 - kS.
        var kD = vec3<f32>(1.0) - kS;
        // multiply kD by the inverse metalness such that only non-metals
        // have diffuse lighting, or a linear blend if partly metal (pure metals
        // have no diffuse light).
        kD *= 1.0 - metallic;

        // scale light by NdotL
        let NdotL = max(dot(N, L), 0.0);

        // add to outgoing radiance Lo
        // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
        Lo += (kD * albedo.xyz / PI + specular) * radiance * NdotL;
	}
	// ambient lighting (note that the next IBL tutorial will replace
    // this ambient lighting with environment lighting).
    let ambient = vec3<f32>(0.03) * albedo.xyz * ao;

    color = ambient + Lo;
    // HDR tonemapping
    color = reinhard( color );
    // gamma correct
    color = pow(color, vec3<f32>(1.0/2.2));
	return color;
}

@fragment
fn main(
  @location(0) pos: vec4<f32>,
  @location(1) uv: vec2<f32>,
  @location(2) normal: vec3<f32>,
  @location(3) camPos: vec3<f32>
) -> @location(0) vec4<f32> {
  var color4 = vec4(calcPBRColor3(normal, pos.xyz, camPos), 1.0);
  return color4;
}
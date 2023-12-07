
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

    let fdBurley = FD_BurleyWool(roughness, rL.dotNV, dotNL, dotLH);

    var specularScatter = rL.scatterIntensity * fresnelSchlick3(rL.specularColor, dotLH, 1.0) * ((rL.specularPower + 2.0) * 0.125) * pow(dotNH, rL.specularPower);

    // add to outgoing radiance Lo
    lightColor *= dotNL;

    (*ptr_rL).diffuse += fdBurley * lightColor * kD * (1.0 + specularScatter);
    (*ptr_rL).specular += specular * lightColor * specularScatter;
}


// fn calcColor4(worldPos: vec4<f32>, viewPos: vec4<f32>, uv: vec2<f32>, worldNormal: vec3<f32>, worldCamPos: vec3<f32>) -> vec4<f32> {
fn calcColor4(calcParam: CalcColor4Param) -> vec4<f32> {

	let worldPos = calcParam.worldPos;
	let viewPos = calcParam.viewPos;
	let uv = calcParam.uv;
	let worldNormal = calcParam.worldNormal;
	let worldCamPos = calcParam.worldCamPos;

	var color = vec3f(0.0);


	var albedo = pbrParams[0].xyz;
	let fresnel = pbrParams[1].xyz;
	let toneParam = pbrParams[2];
	let param = pbrParams[3];

	let arms = armsParams[0];
	let armsBase = armsParams[1];
    var param4 = arms;
    var color4: vec4<f32>;
    var metallic = arms.z;
    var roughness = arms.y;
    var ao = arms.x;

	// var texUV = uv.xy * uvParam.xy;
	var texUV = uv.xy * pbrParams[8].xy;
	let worldPosition = worldPos.xyz;

	let V = normalize(worldCamPos.xyz - worldPosition);
	var N = worldNormal;

	#ifdef USE_NORMAL_MAP
	N = getNormalFromMap( texUV, worldPosition.xyz, worldNormal);
	let normalFactor = 1.0;
    N = normalize(mix(worldNormal, N, normalFactor));
	#endif

    let dotNV = clamp(dot(N, V), 0.0, 1.0);

	#ifdef USE_ALBEDO
	albedo = albedo.xyz * textureSample(albedoTexture, albedoSampler, texUV).xyz;
	#endif
	
	#ifdef USE_ARM_MAP
	let armv3 = textureSample(armTexture, armSampler, texUV).xyz;
	ao = mix(0.0, max(armv3.x, armsBase.x), ao);
	roughness = mix(0.0, max(armv3.y, armsBase.y), roughness);
	metallic = mix(0.0, max(armv3.z, armsBase.z), metallic);
	#else

	#ifdef USE_AO
	ao = mix(0.0, max(textureSample(aoTexture, aoSampler, texUV).x, armsBase.x), ao);
	#endif
	#ifdef USE_ROUGHNESS
	roughness = mix(0.0, max(textureSample(roughnessTexture, roughnessSampler, texUV).y, armsBase.y), roughness);
	#endif
	#ifdef USE_METALLIC
	let texMetallic = textureSample(metallicTexture, metallicSampler, texUV).z;
	metallic = mix(0.0, max(texMetallic, armsBase.z), metallic);
	#endif
	#endif
	// return vec4<f32>(vec3(metallic), 1.0);

	#ifdef USE_GLOSSINESS
	let colorGlossiness = clamp(1.0 - roughness, 0.0, 1.0);
	#else
	let colorGlossiness = clamp(roughness, 0.0, 1.0);
	#endif


    let reflectionIntensity = 1.0;
    var glossinessSquare = colorGlossiness * colorGlossiness;
    let specularPower = exp2(8.0 * glossinessSquare + 1.0);

	var F0 = fresnel.xyz + vec3(0.04);
    F0 = mix(F0, albedo.xyz, metallic);

	albedo = gammaToLinear(albedo);

	var specularColor = vec3(mix(0.025 * reflectionIntensity, 0.078 * reflectionIntensity, colorGlossiness));
    #ifdef USE_METALLIC_CORRECTION
		let specularColorMetal = mix(F0, albedo.xyz, vec3<f32>(metallic));
		let ratio = clamp(metallic, 0.0, 1.0);
		specularColor = mix(specularColor, specularColorMetal, ratio);
    #endif
	// return vec4<f32>(albedo, 1.0);
    albedo = mix(albedo, F0, metallic);

	// let specularFactor = vec3<f32>(1.0);
	let specularFactor = pbrParams[4].xyz;
    specularColor *= specularFactor;

	var specularEnvColor3 = vec3One;
	#ifdef USE_SPECULAR_ENV
	// let mipLvFactor = 0.07;
	let mipLvFactor = param.z;
	var mipLv = floor(100.0 * fract(mipLvFactor));
	mipLv -= glossinessSquare * mipLv;
	mipLv = max(mipLv + floor(mipLvFactor), 0.0);
	var envDir = -getWorldEnvDir(N, -V) * vec3<f32>(-1.0, 1.0, 1.0);

	let specularEnvTexel = textureSampleLevel(specularEnvTexture, specularEnvSampler, envDir, mipLv);
	let brnEnvValue = rgbaToHdrBrn(specularEnvTexel);
	specularEnvColor3 = vec3<f32>(brnEnvValue);
	specularEnvColor3 = gammaToLinear(specularEnvColor3);
	#endif
	specularColor = fresnelSchlick3(specularColor, dotNV, 0.25 * reflectionIntensity) * specularEnvColor3;

	var rL: RadianceLight;

	let frontIntensity = toneParam.z;
    var sideIntensity = toneParam.w;
	var diffuse = albedo.xyz * RECIPROCAL_PI;
    var rm = vec3(1.0 - metallic); // remainder metallic

	let sColor0 = specularColor;

	#ifdef USE_LIGHT
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
	diffuse = rL.diffuse * diffuse;
	#endif
	// var Lo = (rL.diffuse * diffuse + specularColor) * ao;
	var Lo = (diffuse + specularColor) * ao;

	// ambient lighting (note that the next IBL tutorial will replace
    // this ambient lighting with environment lighting).
	// var amb = ambient.xyz;
	var amb = pbrParams[7].xyz;
	#ifdef USE_EMISSIVE_MAP
	amb += textureSample(emissiveTexture, emissiveSampler, texUV).xyz;
	// return vec4<f32>(amb, 1.0);
	#endif
    amb = ((color + amb) * albedo.xyz) * ao;

	sideIntensity = getColorFactorIntensity(dotNV, frontIntensity, sideIntensity);
	amb *= sideIntensity;
	Lo *= sideIntensity * frontIntensity;

    color = amb + Lo;

	// HDR tonemapping
    #ifdef USE_TONE_MAPPING
    color = tonemapReinhard( color, toneParam.x );
    #endif


    // gamma correct
    color = linearToGammaVec3(color);
	#ifdef USE_OPACITY_MAP
	let opacity = textureSample(opacityTexture, opacitySampler, texUV).xyz;
	// return vec4(opacity, 1.0);
	#ifdef USE_INVERSE_MASK
	color4 = vec4<f32>(color, 1.0 - opacity.x);
	#else
	color4 = vec4<f32>(color, opacity.x);
	#endif
	#else
	color4 = vec4<f32>(color, 1.0);
	#endif

	
	#ifdef USE_VSM_SHADOW	
    useVSMShadow(worldNormal, calcParam.svPos, &color4);
	#endif
	#ifdef USE_FOG
    useFog( &color4, calcParam);
	#endif 
	return color4;
}
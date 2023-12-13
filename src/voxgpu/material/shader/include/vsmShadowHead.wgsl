fn pack2HalfToRGBA(v: vec2<f32>) -> vec4<f32> {
    let r = vec4(v.x, fract(v.x * 255.0), v.y, fract(v.y * 255.0));
    return vec4<f32>(r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
fn unpackRGBATo2Half(v: vec4<f32>) -> vec2<f32> {
    return vec2<f32>(v.x + (v.y / 255.0), v.z + (v.w / 255.0));
}

fn texture2DDistribution(uv: vec2<f32>) -> vec2<f32> {
    let v4 = textureSample(shadowDataTexture, shadowDataSampler, uv);
    return unpackRGBATo2Half(v4);
}
fn VSMShadow(uv: vec2<f32>, compare: f32) -> f32 {

    var occlusion = 1.0;

    let distribution = texture2DDistribution(uv);

    let hard_shadow = step(compare, distribution.x); // Hard Shadow

    if hard_shadow != 1.0 {

        let distance = compare - distribution.x ;
        let variance = max(0.0001, distribution.y * distribution.y);
        var softness_probability = variance / (variance + distance * distance); // Chebeyshevs inequality
        softness_probability = clamp((softness_probability - 0.3) / (0.95 - 0.3), 0.0, 1.0); // 0.3 reduces light bleed
        occlusion = clamp(max(hard_shadow, softness_probability), 0.0, 1.0);
    }
    return occlusion;
}
fn getVSMShadow(shadowMapSize: vec2<f32>, shadowBias: f32, shadowRadius: f32, shadowCoordP: vec4<f32>) -> f32 {

    var shadowCoord = vec4<f32>(shadowCoordP.xyz / vec3<f32>(shadowCoordP.w), shadowCoordP.z + shadowBias);

    let inFrustumVec = vec4<bool>(shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);
    let inFrustum = all(inFrustumVec);

    let frustumTestVec = vec2<bool>(inFrustum, shadowCoord.z <= 1.0);
    var shadow = VSMShadow(shadowCoord.xy, shadowCoord.z);
    if !all(frustumTestVec) {
        shadow = 1.0;
    }
    return shadow;
}

fn getVSMShadowFactor(worldNormal: vec3<f32>, svPos: vec4<f32>) -> f32 {

    var shadow = clamp(getVSMShadow(vsmParams[1].xy, vsmParams[0].x, vsmParams[0].z, svPos), 0.0, 1.0);
    var f = clamp(dot(worldNormal, normalize(vsmParams[2].xyz)), 0.001, 1.0);
    if f > 0.0001 {
        shadow = min(shadow, clamp(f, 0.0, 1.0));
    }
    f = mix(shadow, 1.0, vsmParams[1].z);
    return min((1.0 - f) * (1.0 - vsmParams[0].w) + f, 1.0);  
}
fn useVSMShadow(worldNormal: vec3<f32>, svPos: vec4<f32>, color: ptr<function, vec4<f32>>) {

    let factor = getVSMShadowFactor(worldNormal, svPos);  

    var c = *color;
    // c = vec4<f32>(vec3<f32>(1.0), 1.0);
    (*color) = vec4<f32>(c.xyz * vec3<f32>(factor), c.w);
}

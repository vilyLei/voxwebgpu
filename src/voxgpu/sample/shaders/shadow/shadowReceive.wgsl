
struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) worldNormal: vec3<f32>,
	@location(1) svPos: vec4<f32>
}
@vertex
fn vertMain(
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>
) -> VertexOutput {
    let objPos = vec4(position.xyz, 1.0);
    let wpos = objMat * objPos;
    var output: VertexOutput;
    let projPos = projMat * viewMat * wpos;
    output.Position = projPos;
    // output.normal = normal;
    let invMat33 = inverseM33(m44ToM33(objMat));
    output.worldNormal = normalize(normal * invMat33);
    output.svPos = projPos;
    return output;
}

fn pack2HalfToRGBA( v: vec2<f32> ) -> vec4<f32> {
	let r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4<f32>( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
fn unpackRGBATo2Half( v: vec4<f32> ) -> vec2<f32> {
	return vec2<f32>( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

fn texture2DDistribution( uv: vec2<f32> ) -> vec2<f32> {

    return unpackRGBATo2Half( textureSample(vsmShadowTexture, vsmShadowSampler, uv ) );

}
fn VSMShadow (uv: vec2<f32>, compare: f32 ) -> f32 {

    var occlusion = 1.0;

    let distribution = texture2DDistribution( uv );

    let hard_shadow = step( compare , distribution.x ); // Hard Shadow

    if (hard_shadow != 1.0 ) {

        let distance = compare - distribution.x ;
        let variance = max( 0.00000, distribution.y * distribution.y );
        var softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
        softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
        occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );

    }
    return occlusion;

}
fn getVSMShadow( shadowMapSize: vec2<f32>, shadowBias: f32, shadowRadius: f32, shadowCoord: vec4<f32> ) -> f32 {

    var shadow = 1.0;
    
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;
    
    // if ( something && something ) breaks ATI OpenGL shader compiler
    // if ( all( something, something ) ) using this instead

    let inFrustumVec = vec4<bool> ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
    let inFrustum = all( inFrustumVec );

    let frustumTestVec = vec2<bool>( inFrustum, shadowCoord.z <= 1.0 );

    let frustumTest = all( frustumTestVec );

    if ( frustumTest ) {
        shadow = VSMShadow( shadowCoord.xy, shadowCoord.z );
    }
    return shadow;
}

@fragment
fn fragMain(
    @location(0) worldNormal: vec3<f32>,
    @location(1) svPos: vec4<f32>
) -> @location(0) vec4<f32> {
    // var color = vec4<f32>(1.0);
    // var shadow = getVSMShadow(params[1].xy, params[0].x, params[0].z, svPos );
    // let shadowIntensity = 1.0 - params[0].w;
    // shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;
    // var f = clamp(dot(worldNormal, params[2].xyz),0.0,1.0);
    // f = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;    
    // var color4 = vec4<f32>(color.xyz * vec3(f * 0.9 + 0.1), 1.0);
    var color4 = vec4<f32>(abs(worldNormal), 1.0);
    return color4;
}



fn inverseM33(m: mat3x3<f32>) -> mat3x3<f32> {
    let a00 = m[0][0]; let a01 = m[0][1]; let a02 = m[0][2];
    let a10 = m[1][0]; let a11 = m[1][1]; let a12 = m[1][2];
    let a20 = m[2][0]; let a21 = m[2][1]; let a22 = m[2][2];
    let b01 = a22 * a11 - a12 * a21;
    let b11 = -a22 * a10 + a12 * a20;
    let b21 = a21 * a10 - a11 * a20;
    let det = a00 * b01 + a01 * b11 + a02 * b21;
    return mat3x3<f32>(
        vec3<f32>(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11)) / det,
        vec3<f32>(b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10)) / det,
        vec3<f32>(b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det
    );
}
fn m44ToM33(m: mat4x4<f32>) -> mat3x3<f32> {
    return mat3x3(m[0].xyz, m[1].xyz, m[2].xyz);
}

fn inverseM44(m: mat4x4<f32>) -> mat4x4<f32> {
    let a00 = m[0][0]; let a01 = m[0][1]; let a02 = m[0][2]; let a03 = m[0][3];
    let a10 = m[1][0]; let a11 = m[1][1]; let a12 = m[1][2]; let a13 = m[1][3];
    let a20 = m[2][0]; let a21 = m[2][1]; let a22 = m[2][2]; let a23 = m[2][3];
    let a30 = m[3][0]; let a31 = m[3][1]; let a32 = m[3][2]; let a33 = m[3][3];
    let b00 = a00 * a11 - a01 * a10;
    let b01 = a00 * a12 - a02 * a10;
    let b02 = a00 * a13 - a03 * a10;
    let b03 = a01 * a12 - a02 * a11;
    let b04 = a01 * a13 - a03 * a11;
    let b05 = a02 * a13 - a03 * a12;
    let b06 = a20 * a31 - a21 * a30;
    let b07 = a20 * a32 - a22 * a30;
    let b08 = a20 * a33 - a23 * a30;
    let b09 = a21 * a32 - a22 * a31;
    let b10 = a21 * a33 - a23 * a31;
    let b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    return mat4x4<f32>(
        vec4<f32>(a11 * b11 - a12 * b10 + a13 * b09,
            a02 * b10 - a01 * b11 - a03 * b09,
            a31 * b05 - a32 * b04 + a33 * b03,
            a22 * b04 - a21 * b05 - a23 * b03) / det,
        vec4<f32>(a12 * b08 - a10 * b11 - a13 * b07,
            a00 * b11 - a02 * b08 + a03 * b07,
            a32 * b02 - a30 * b05 - a33 * b01,
            a20 * b05 - a22 * b02 + a23 * b01) / det,
        vec4<f32>(a10 * b10 - a11 * b08 + a13 * b06,
            a01 * b08 - a00 * b10 - a03 * b06,
            a30 * b04 - a31 * b02 + a33 * b00,
            a21 * b02 - a20 * b04 - a23 * b00) / det,
        vec4<f32>(a11 * b07 - a10 * b09 - a12 * b06,
            a00 * b09 - a01 * b07 + a02 * b06,
            a31 * b01 - a30 * b03 - a32 * b00,
            a20 * b03 - a21 * b01 + a22 * b00) / det
    );
}
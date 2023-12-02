
struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) normal: vec4<f32>,
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
    output.normal = normal;
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
    @location(0) normal: vec4<f32>,
    @location(1) svPos: vec4<f32>
) -> @location(0) vec4<f32> {
    var color = vec4<f32>(1.0);
    var shadow = getVSMShadow(params[1].xy, params[0].x, params[0].z, svPos );
    let shadowIntensity = 1.0 - params[0].w;
    shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;
    var f = clamp(dot(normal, params[2].xyz),0.0,1.0);
    f = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;
    
    var color4 = vec4<f32>(color.xyz * vec3(f * 0.9 + 0.1), 1.0);
    return color4;
}
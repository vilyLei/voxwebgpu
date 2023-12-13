struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) uv: vec2<f32>
}
@vertex
fn vertMain(
    @location(0) position: vec3<f32>,
    @location(1) uv: vec2<f32>
) -> VertexOutput {
    var output: VertexOutput;
    output.Position = vec4(position.xyz, 1.0);
    output.uv = uv;
    return output;
}


const PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const PackFactors = vec3<f32>(256. * 256. * 256., 256. * 256., 256.);
const UnpackFactors = UnpackDownscale / vec4<f32>(PackFactors, 1.0);

const ShiftRight8 = 1. / 256.;

fn packDepthToRGBA(v: f32) -> vec4<f32> {
    var r = vec4<f32>(fract(v * PackFactors), v);
    let v3 = r.yzw - (r.xyz * ShiftRight8);
    return vec4<f32>(v3.x, v3) * PackUpscale;
}


fn unpackRGBAToDepth( v: vec4<f32> ) -> f32 {
    return dot( v, UnpackFactors );
}

fn pack2HalfToRGBA( v: vec2<f32> ) -> vec4<f32> {
    let r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
    return vec4<f32>( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
fn unpackRGBATo2Half( v: vec4<f32> ) -> vec2<f32> {
    return vec2<f32>( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

const SAMPLE_RATE = 0.25;
const HALF_SAMPLE_RATE = SAMPLE_RATE * 0.5;
@fragment
fn fragMain(
    @location(0) uv: vec2<f32>,
) -> @location(0) vec4<f32> {
    
    var mean = 0.0;
    var squared_mean = 0.0;
    
    let resolution = viewParam.zw;
    let fragCoord = resolution * uv;
    
    let radius = param[3];
    
    let c4 = textureSample(shadowDataTexture, shadowDataSampler, uv);   
    // This seems totally useless but it's a crazy work around for a Adreno compiler bug
    var depth = unpackRGBAToDepth( c4 );

    for ( var i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {

        #ifdef USE_HORIZONAL_PASS

            let distribution = unpackRGBATo2Half( textureSample(shadowDataTexture, shadowDataSampler, ( fragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );
            mean += distribution.x;
            squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

        #else

            depth = unpackRGBAToDepth( textureSample(shadowDataTexture, shadowDataSampler, ( fragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );
            mean += depth;
            squared_mean += depth * depth;

        #endif

    }

    mean = mean * HALF_SAMPLE_RATE;
    squared_mean = squared_mean * HALF_SAMPLE_RATE;

    let std_dev = sqrt( squared_mean - mean * mean );

    var color4 = pack2HalfToRGBA( vec2<f32>( mean, std_dev ) );

    return color4;
}
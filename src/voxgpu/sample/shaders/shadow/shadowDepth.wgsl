
struct VertexOutput {
	@builtin(position) Position: vec4<f32>,
	@location(0) projPos: vec4<f32>,
	@location(1) objPos: vec4<f32>
}
@vertex
fn vertMain(
    @location(0) position: vec3<f32>
) -> VertexOutput {
    let objPos = vec4(position.xyz, 1.0);
    let wpos = objMat * objPos;
    var output: VertexOutput;
    let projPos = projMat * viewMat * wpos;
    output.Position = projPos;
    output.projPos = projPos;
    output.objPos = objPos;
    return output;
}


const PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const PackFactors = vec3<f32>(256. * 256. * 256., 256. * 256., 256.);
const UnpackFactors = UnpackDownscale / vec4<f32>(PackFactors, 1.0);

const ShiftRight8 = 1. / 256.;

fn packDepthToRGBA(v: f32) -> vec4<f32> {
    var r = vec4<f32>(fract(v * PackFactors), v);
	// r.yzw -= r.xyz * ShiftRight8; // tidy overflow
    let v3 = r.yzw - (r.xyz * ShiftRight8);
    r = vec4<f32>(v3.x, v3);
    return r * PackUpscale;
}

@fragment
fn fragMain(
    @location(0) projPos: vec4<f32>,
    @location(1) objPos: vec4<f32>
) -> @location(0) vec4<f32> {
    // Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
    let fragCoordZ = 0.5 * projPos[2] / projPos[3] + 0.5;
    var color4 = packDepthToRGBA( fragCoordZ );
    // var color4 = vec4<f32>(abs(normalize(projPos.xyz)) + vec3f(0.1), 1.0);
    // var color4 = vec4<f32>(abs(normalize(objPos.xyz)) + vec3f(0.1), 1.0);
    return color4;
}
struct VSOut {
    @builtin(position) Position: vec4f,
    @location(0) uv: vec2f,
};

@vertex
fn main(@location(0) position: vec3f,
        @location(1) uv: vec2f) -> VSOut {
    var vsOut: VSOut;
    vsOut.Position = vec4(position, 1.0);
    vsOut.uv = uv;
    return vsOut;
}

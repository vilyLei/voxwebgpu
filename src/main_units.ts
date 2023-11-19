
/*
let win = window as any;
win['GPUBufferUsage'] = {
    MAP_READ: 0x0001,
    MAP_WRITE: 0x0002,
    COPY_SRC: 0x0004,
    COPY_DST: 0x0008,
    INDEX: 0x0010,
    VERTEX: 0x0020,
    UNIFORM: 0x0040,
    STORAGE: 0x0080,
    INDIRECT: 0x0100,
    QUERY_RESOLVE: 0x0200,
}
win['GPUShaderStage'] = {
    VERTEX: 0x1,
    FRAGMENT: 0x2,
    COMPUTE: 0x3
}
win['GPUTextureUsage'] = {
    COPY_SRC: 0x01,
    COPY_DST: 0x02,
    TEXTURE_BINDING: 0x04,
    STORAGE_BINDING: 0x08,
    TRENDER_ATTACHMENT: 0x10
}
//*/

import { UnitsTest as Demo } from "./unittest/webgpu/UnitsTest";
let demo = new Demo();
demo.initialize();



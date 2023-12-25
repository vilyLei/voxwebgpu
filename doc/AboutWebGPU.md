WebGPU 相关...
1.WebGPU基本文档
a.google入门样例文档: https://codelabs.developers.google.com/your-first-webgpu-app?hl=zh-cn#0
b.MDN相关文档: https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API
c.WEBGPU工程源码: https://github.com/vilyLei/gpuweb
d.WEBGPU使用细节技术文档: https://gpuweb.github.io/gpuweb/#gpurenderpipeline
e.WEBGPU的所有核心: https://surma.dev/things/webgpu/
f.WGSL技术说明: https://gpuweb.github.io/gpuweb/wgsl/
g.WEBGPU基础知识： https://webgpufundamentals.org/
h.小案例
i.元胞自动机及其对应的图形: https://www.zhihu.com/question/30782166
ii.生命游戏不错的js版本示例: https://beltoforion.de/en/game_of_life/?a=game_of_life&hl=en&p=running_the_simulation
i.WEBGPU绘制顶点色的三角形:
i.原文章: https://alain.xyz/blog/raw-webgpu
ii.对应的github代码: https://github.com/alaingalvan/webgpu-seed
j.WEBGPU显示GLTF: https://www.willusher.io/graphics/2023/04/10/0-to-gltf-triangle
k.WGGL shader代码中的常量传值方式: https://gpuweb.github.io/gpuweb/#typedefdef-gpupipelineconstantvalue
l.关于subresource的定义: https://gpuweb.github.io/gpuweb/#subresource
m.关于texture-subresources的定义: https://gpuweb.github.io/gpuweb/#texture-subresources
n.ss
2.WEBGPU若干 Samples:
a.webgpu-samples
i.地址: https://webgpu.github.io/webgpu-samples/samples/texturedCube
ii.GitHub： https://github.com/webgpu/webgpu-samples
iii.三角形旋转动画: https://webgpu.github.io/webgpu-samples/samples/animometer
b.应用demo: https://math.hws.edu/graphicsbook/c9/s4.html
c.webGPU高级应用的介绍：https://developer.chrome.com/blog/webgpu-io2023/
d.fdf
3.WGSL:
a.Wgsl math 等计算过程说明: 
i.基本用法： https://math.hws.edu/graphicsbook/c9/s3.html
1.相关的demo指引: https://math.hws.edu/graphicsbook/c9/s4.html
ii.let用法及相关google官方说明: https://google.github.io/tour-of-wgsl/variables/let/
b.dfdf
c.sfs
4.WebGPU c++:
a.关于mipmap generation：https://eliemichel.github.io/LearnWebGPU/basic-compute/image-processing/mipmap-generation.html
b.WebGL纹理和WebGPU纹理的简单对比: https://www.cnblogs.com/onsummer/p/webgl-vs-webgpu-texture.html
c.sdsd
5.WebGPU 纹理相关:
a.mimap纹理生成工具: https://github.com/toji/web-texture-tool/blob/main/src/webgpu-mipmap-generator.js
b.s
6.相关项目:
a.webGPUBlas: https://github.com/milhidaka/webgpu-blas
7.web端gpu特新测试: 
a.Conformance Test Runner: https://registry.khronos.org/webgl/sdk/tests/webgl-conformance-tests.html
8.RayTracing相关
a.tut01: https://www.youtube.com/watch?v=Gv0EiQfDI7w
b.tut02: https://www.reddit.com/r/webgpu/comments/vlbi3v/new_webgpu_demo_marching_cubes_bloom_via_compute/
c.一个compute着色的例子: https://github.com/mwalczyk/marching-cubes
d.教程及代码仓库: https://cescg.org/our-services/introduction-to-webgpu/
e.sfs
f.sfs
9.WebGPU展示GLTF: 
a.https://toji.github.io/webgpu-gltf-case-study/
10.纹理格式的转换工具函数:
a.https://gpuweb.github.io/cts/docs/tsdoc/functions/webgpu_util_conversion.packRGB9E5UFloat.html
b.https://github.com/gpuweb/cts/blob/c47509f/src/webgpu/util/conversion.ts#L298
c.rgb9e5ufloat用法: https://gist.github.com/greggman/794bd5340709a1d9602fde2df79a94ac
d.sdf
11.RUST与WGSL
a.https://docs.rs/wgsl_preprocessor/latest/wgsl_preprocessor/
b.WGSL Shader 动态构造: https://toji.dev/webgpu-best-practices/dynamic-shader-construction.html
c.WGSL Shader构造过程: https://zhuanlan.zhihu.com/p/463229491
d.sd
12.关于PBR
a.间接光照
i.(实现pbr间接光照 上)https://cloud.tencent.com/developer/article/2145814
ii.(实现pbr间接光照 下)https://cloud.tencent.com/developer/article/2145884
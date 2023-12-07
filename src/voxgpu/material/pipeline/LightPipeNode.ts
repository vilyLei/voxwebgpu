import { BaseLightData, LightParamData } from "../mdata/LightUniformData";

class LightPipeNode {
    type = 'lighting';
    macro = 'USE_LIGHT';
    lightParam = new LightParamData(new Uint32Array([1, 0, 0, 0]), "lightParam", "frag");
    lights = new BaseLightData(new Float32Array([0.0, 200.0, 0, 0.0001]), "lights", "frag");
    lightColors = new BaseLightData(new Float32Array([5.0, 5.0, 5.0, 0.0001]), "lightColors", "frag");
    constructor() { }
}
export { LightPipeNode }
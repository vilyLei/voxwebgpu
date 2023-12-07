import { LightShaderDataParam } from "../../material/BasePBRMaterial";
import Color4 from "../../material/Color4";
import Vector3 from "../../math/Vector3";

export function createLightData(position: Vector3DataType, dis = 200): LightShaderDataParam {
    let pos = new Vector3().setVector4(position);
    let pv0 = pos.clone().addBy(new Vector3(0, dis, 0));
    let pv1 = pos.clone().addBy(new Vector3(dis, 0, 0));
    let pv2 = pos.clone().addBy(new Vector3(0, 0, dis));
    let pv3 = pos.clone().addBy(new Vector3(-dis, 0, 0));
    let pv4 = pos.clone().addBy(new Vector3(0, 0, -dis));
    let posList = [pv0, pv1, pv2, pv3, pv4];

    let c0 = new Color4(0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.0, 0.00002);
    let c1 = new Color4(0.0, 0.1 + Math.random() * 13, 1.0, 0.00002);
    let c2 = new Color4(0.0, 0.1 + Math.random() * 13, 0.1 + Math.random() * 13, 0.00002);
    let c3 = new Color4(0.1 + Math.random() * 13, 1.0, 0.1 + Math.random() * 13, 0.00002);
    let c4 = new Color4(0.5, 1.0, 0.1 + Math.random() * 13, 0.00002);

    let colorList = [c0, c1, c2, c3, c4];

    let pointLightsTotal = posList.length;

    let j = 0;
    let lightsData = new Float32Array(4 * pointLightsTotal);
    let lightColorsData = new Float32Array(4 * pointLightsTotal);

    for (let i = 0; i < lightsData.length;) {
        const pv = posList[j];
        pv.w = 0.00002;
        pv.toArray4(lightsData, i);

        const c = colorList[j];
        c.toArray4(lightColorsData, i);

        j++;
        i += 4;
    }
    let param = { lights: lightsData, colors: lightColorsData, pointLightsTotal };
    return param;
}
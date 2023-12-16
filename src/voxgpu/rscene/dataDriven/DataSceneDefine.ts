
import { DirectionLight } from "../../light/base/DirectionLight";
import { DirectionLightParam } from "../../light/base/DirectionLightImpl";
import { PointLight } from "../../light/base/PointLight";
import { PointLightParam } from "../../light/base/PointLightImpl";
import { SpotLight } from "../../light/base/SpotLight";
import { SpotLightParam } from "../../light/base/SpotLightImpl";
import { MtLightDataDescriptor } from "../../material/mdata/MtLightDataDescriptor";
import { WGRendererConfig } from "../WGRendererParam";
import { DataDrivenEntityParamType, DataDrivenEntityParam } from "./DataDrivenEntityParam";

interface SceneFogDataImpl {
    color: number[];
}
interface SceneShadowDataImpl {
	intensity?: number;
    radius?: number;
}
interface SceneLightDataImpl {
	pointLights: PointLightParam[];
	spotLights: SpotLightParam[];
	directionLights: DirectionLightParam[];
}
interface SceneDataImpl {
	renderer?: WGRendererConfig;
	shadow?: SceneShadowDataImpl;
    light?: SceneLightDataImpl;
    fog?: SceneFogDataImpl;
}
interface DataDrivenSceneParam {
	renderer?: WGRendererConfig;
	scene?: SceneDataImpl;
	entities?: DataDrivenEntityParamType[];
}
function parseLightData(data: SceneLightDataImpl): MtLightDataDescriptor {
    let ld = { pointLights: [], directionLights: [], spotLights: [] } as MtLightDataDescriptor;
    if(data) {
        let pls = data.pointLights;
        if(pls) {
            for(let i = 0; i < pls.length; i++) {
                let p = new PointLight(pls[i]);
                ld.pointLights.push(p);
            }
        }
        let spls = data.spotLights;
        if(spls) {
            for(let i = 0; i < spls.length; i++) {
                let p = new SpotLight(spls[i]);
                ld.spotLights.push(p);
            }
        }
        let dls = data.directionLights;
        if(dls) {
            for(let i = 0; i < dls.length; i++) {
                let p = new DirectionLight(dls[i]);
                ld.directionLights.push(p);
            }
        }
    }
    return ld;
}
export { parseLightData, SceneDataImpl, DataDrivenSceneParam }
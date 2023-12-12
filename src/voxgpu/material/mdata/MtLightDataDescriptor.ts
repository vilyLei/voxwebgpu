
import { PointLight } from "../../light/base/PointLight";
import { DirectionLight } from "../../light/base/DirectionLight";
import { SpotLight } from "../../light/base/SpotLight";

export interface MtLightDataDescriptor {
	pointLights?: PointLight[],
	directionLights?: DirectionLight[],
	spotLights?: SpotLight[]
};


import { PointLight } from "../../light/base/PointLight";
import { DirectionLight } from "../../light/base/DirectionLight";

export interface MtLightDataDescriptor {
	pointLights?: PointLight[],
	directionLights?: DirectionLight[]
};

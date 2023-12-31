import { MtPlNodeImpl } from "./MtPlNodeImpl";
export interface MtPlLightDescriptor {
    enabled?: boolean;
}
export interface MtPlFogDescriptor {
    enabled?: boolean;
}
export interface MtPlVSMDescriptor {
    type?: string;
    enabled?: boolean;
    intensity?: number;
    radius?: number;
    mapWidth?: number;
    mapHeight?: number;
    mapSize?: number;
}
/**
 * material pipeline MtPlDescriptor
 */
export interface MtPlDescriptor {
    enabled?: boolean;
    vsm?: MtPlVSMDescriptor;
}
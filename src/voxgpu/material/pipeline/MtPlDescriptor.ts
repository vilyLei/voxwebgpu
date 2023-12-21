import { MtPlNodeImpl } from "./MtPlNodeImpl";

export interface MtPlVSMDescriptor {
    enabled?: boolean;
    intensity?: number;
    radius?: number;
    mapWidth?: number;
    mapHeight?: number;
}
/**
 * material pipeline MtPlDescriptor
 */
export interface MtPlDescriptor {
    enabled?: boolean;
}
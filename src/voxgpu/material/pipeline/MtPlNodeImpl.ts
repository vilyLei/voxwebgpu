import { WGRBufferData } from "../mdata/MaterialUniformData";
/**
 * material pipeline node interface
 */
export interface MtPlNodeImpl {
    type: string;
    macros: string[];
    merge(ls: WGRBufferData[]): void;
    getDataList(): WGRBufferData[];
    isEnabled(): boolean;
}
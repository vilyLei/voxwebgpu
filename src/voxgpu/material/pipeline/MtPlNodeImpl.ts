import { WGRBufferData } from "../mdata/MaterialUniformData";
/**
 * material pipeline node interface
 */
export interface MtPlNodeImpl {
    type: string;
    macro: string;
    merge(ls: WGRBufferData[]): void;
    getDataList(): WGRBufferData[];
}
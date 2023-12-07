import { WGRBufferData } from "../mdata/MaterialUniformData";

export interface MtlPipeNodeImpl {
    type: string;
    macro: string;
    merge(ls: WGRBufferData[]): void;
    getDataList(): WGRBufferData[];
}
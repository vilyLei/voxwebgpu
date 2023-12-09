import { MtPlNodeImpl } from "./MtPlNodeImpl";
/**
 * material pipeline param
 */
export interface MtPlParam {
    uuid?: string;
    uid?: number;
    nodes?: MtPlNodeImpl[];
}
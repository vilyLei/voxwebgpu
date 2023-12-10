import { MtPlNodeImpl } from "./MtPlNodeImpl";
/**
 * material pipeline param
 */
export interface MtPlParam {
    uuid?: string;
    uid?: number;
    nodes?: MtPlNodeImpl[];
    /**
     * Posssible values are: "vert-frag", "vert", "frag", "comp",
     * the default value is "vert-frag";
     */
    shaderType?: string;
}
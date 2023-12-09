import { WGRBufferData } from "../mdata/MaterialUniformData";
/**
 * material pipeline node
 */
class MtPlNode {
    constructor() { }

    contains(ls: WGRBufferData[], item: WGRBufferData, begin = 0, end = -1): boolean {
        end = end < 0 ? ls.length - 1 : end;
        for (let i = begin; i <= end; i++) {
            if (ls[i].shdVarName && ls[i].shdVarName === item.shdVarName) {
                return true;
            }
        }
        return false;
    }
    addTo(ls: WGRBufferData[], item: WGRBufferData, begin = 0, end = -1): void {

        let contains = this.contains(ls, item, 0, end);
        console.log('addTo(), contains: ', contains, ', item: ', item);
        if (!contains) {
            ls.push(item);
        }
    }
    getDataList(): WGRBufferData[] {
        return [];
    }
}
export { MtPlNode }
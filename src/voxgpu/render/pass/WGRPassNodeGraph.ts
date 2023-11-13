
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { WGRCmdWrapper, WGRPassWrapperImpl } from "../pipeline/WGRPassWrapperImpl";
class WGRPassNodeGraph {
    passes: WGRPassWrapperImpl[] = null;
	cmdWrapper: WGRCmdWrapper = {rcommands: [] as GPUCommandBuffer[]};
    constructor(){}
    runBegin(): void {
        this.cmdWrapper.rcommands = [];
        const ps = this.passes;
        if(ps != null) {
            for(let i = 0; i < ps.length; ++i) {
                ps[i].cmdWrapper = this.cmdWrapper;
            }
        }
    }
    run(): void {
    }
}
export { WGRPassNodeGraph }

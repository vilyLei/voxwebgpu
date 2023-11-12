
import { GPUCommandBuffer } from "../../gpu/GPUCommandBuffer";
import { IWGRPassWrapper } from "../pipeline/IWGRPassWrapper";
class WGRPassNodeGraph {
    passes: IWGRPassWrapper[] = null;
	rcommands: GPUCommandBuffer[];
    constructor(){}
    runBegin(): void {
        this.rcommands = [];
    }
    run(): void {
    }
}
export { WGRPassNodeGraph }
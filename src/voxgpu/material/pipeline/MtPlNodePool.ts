import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { LightPipeNode } from "./LightPipeNode";
import { VSMPipeNode } from "./VSMPipeNode";

export class MtPlNodePool {
    pool: Map<string, MtPlNodeImpl> = new Map();
    addNode(node: MtPlNodeImpl): void {
        if (node) {
            this.pool.set(node.type, node);
        }
    }
    hasNodeByType(type: string): boolean {
        return this.pool.has(type);
    }
    getNodeByType(type: string): MtPlNodeImpl {
        return this.pool.get(type);
    }
    initialize(): void {
        let lightNode = new LightPipeNode();
        this.addNode(lightNode);

        let vsmNode = new VSMPipeNode();
        this.addNode(vsmNode);
    }
}
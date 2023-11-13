import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGWaitEntityNode } from "./WGEntityNode";
import { WGRObjBuilder } from "../render/WGRObjBuilder";

class WGEntityNodeMana {
	private mNodes: WGWaitEntityNode[] = [];
	private mEnabled = false;

	wgctx: WebGPUContext;
	roBuilder: WGRObjBuilder;

	private receiveNode(wnode: WGWaitEntityNode): void {

		wnode.block.addEntityToBlock(wnode.entity, wnode.node);

		wnode.entity = null;
		wnode.node = null;
		wnode.builder = null;
		wnode.block = null;
	}
	addEntity(node: WGWaitEntityNode): void {
		// console.log("WGEntityNodeMana::addEntity(), this.mNodes.length: ", this.mNodes.length);
		this.mNodes.push(node);
	}
	update(): void {
		if (this.mEnabled) {
			const ls = this.mNodes;

			for (let i = 0; i < ls.length; ++i) {
				const node = ls[i];
				const entity = node.entity;
				if (node.rever == node.node.rstate.__$rever) {
					if (!entity.isREnabled()) {
						const ms = entity.materials;
						if (ms) {
							// console.log("ppp b 03");
							for (let j = 0; j < ms.length; ++j) {
								this.updateMaterial(ms[j]);
							}
						}
						// 保证顺序
						if(!(node.syncSort === false)) {
							break;
						}
					}
					if (entity.isREnabled()) {
						// console.log("WGEntityNodeMana::update(), ppp a 01");
						ls.splice(i, 1);
						--i;
						this.receiveNode( node );
					}
				} else {
					ls.splice(i, 1);
					--i;
					console.log("WGEntityNodeMana::update(), remove a waiting entity.");
				}
			}
		}
	}
	private updateMaterial(m: WGMaterial): void {
		if (!m.isREnabled()) {
			const ctx = this.wgctx;
			const texs = m.textures;
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				if (tex.texture && tex.texture.data && !tex.texture.texture) {
					tex.texture.texture = tex.texture.data.build(ctx);
				}
			}
		}
	}
	updateToTarget(): void {
		this.mEnabled = true;
	}
}
export { WGWaitEntityNode, WGEntityNodeMana };

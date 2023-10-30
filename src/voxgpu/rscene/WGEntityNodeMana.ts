import { WebGPUContext } from "../gpu/WebGPUContext";
import { Entity3D } from "../entity/Entity3D";
import { WGMaterial } from "../material/WGMaterial";
import { WGWaitEntityNode } from "./WGEntityNode";

interface NodeManaTarget {
	addEntity(entity: Entity3D, processIndex?: number, deferred?: boolean): void;
	getWGCtx(): WebGPUContext;
	isEnabled(): boolean;
}
class WGEntityNodeMana {
	private mNodes: WGWaitEntityNode[] = [];
	private mEnabled = false;
	target: NodeManaTarget;

	addEntity(entity: Entity3D, processIndex = 0, deferred = true): void {
		// console.log("WGEntityNodeMana::addEntity(), this.mNodes.length: ", this.mNodes.length);
		this.mNodes.push({ entity: entity, processIndex: processIndex, deferred: deferred });
	}
	update(): void {
		if (this.mEnabled) {
			const ls = this.mNodes;

			for (let i = 0; i < ls.length; ++i) {
				const node = ls[i];
				const entity = node.entity;
				// console.log("ppp 01");
				if (!entity.isREnabled()) {
					const ms = entity.materials;
					if (ms) {
						// console.log("ppp b 03");
						for (let j = 0; j < ms.length; ++j) {
							this.updateMaterial(ms[j]);
						}
					}
				}
				if (entity.isREnabled()) {
					console.log("WGEntityNodeMana::update(), ppp a 01");
					ls.splice(i, 1);
					--i;
					this.target.addEntity(entity, node.processIndex, node.deferred);
				}
			}
		}
	}
	private updateMaterial(m: WGMaterial): void {
		if (!m.isREnabled()) {
			// console.log("ppp b 03 b");
			const ctx = this.target.getWGCtx();
			const texs = m.textures;
			for (let i = 0; i < texs.length; ++i) {
				const tex = texs[i];
				if (tex.texture && tex.texture.data && !tex.texture.texture) {
					tex.texture.texture = tex.texture.data.build(ctx);
					console.log("WGEntityNodeMana::updateMaterial(), rrr a 01");
				}
			}
		}
	}
	updateToTarget(): void {
		this.mEnabled = true;
	}
}
export { WGEntityNodeMana };

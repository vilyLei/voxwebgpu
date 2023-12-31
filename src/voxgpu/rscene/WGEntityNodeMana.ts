import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGMaterial } from "../material/WGMaterial";
import { WGWaitEntityNode } from "./WGEntityNode";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { Entity3D } from "../entity/Entity3D";
import { updateMaterialData } from "../material/MtUtils";
import { IWGMaterial } from "../material/IWGMaterial";

class WGEntityNodeMana {
	private mNodes: WGWaitEntityNode[] = [];
	private mEnabled = false;

	wgctx: WebGPUContext;
	roBuilder: WGRObjBuilder;

	private receiveNode(wnode: WGWaitEntityNode): void {

		wnode.block.addEntityToBlock(wnode.entity, wnode.node, wnode.entityParam);

		wnode.entity = null;
		wnode.node = null;
		wnode.builder = null;
		wnode.block = null;
		wnode.entityParam = null;
	}
	addEntity(node: WGWaitEntityNode): void {
		// let param = node.entityParam;
		// if(param && param.materials && param.materials.length > 0) {
		// 	console.log('XXXXXXXX param.materials: ', param.materials);
		// }
		this.mNodes.push(node);
		// console.log("WGEntityNodeMana::addEntity(), this.mNodes.length: ", this.mNodes.length);
	}
	
	testEntity(entity: Entity3D, ms: IWGMaterial[], wnode: WGWaitEntityNode, debufFlag = false): boolean {
		
		const mtpl = this.roBuilder.mtpl;
		if(!mtpl.testRMaterials(ms)) {
			return false;
		}

		if(!entity.isREnabled()) {
			let g = entity.geometry;
			if (!g || !g.isREnabled()) {
				// console.log("aaa g.isREnabled(), !g: ", !g,', ', this.geometry);
				return false;
			}
		}
		return true;
	}
	update(): void {
		// console.log("WGEntityNodeMana::update(), this.mNodes.length: ", this.mNodes.length, this.mEnabled);
		if (this.mEnabled) {
			const ls = this.mNodes;

			for (let i = 0; i < ls.length; ++i) {
				const node = ls[i];
				const entity = node.entity;
				if (node.rever == node.node.rstate.__$rever) {
					// console.log('A entity.isREnabled(): ', entity.isREnabled());
					// if (!entity.isREnabled()) {
					let param = node.entityParam;
					let mflag = param && param.materials && param.materials.length > 0;
					const ms = mflag ? param.materials : entity.materials;
					mflag = this.testEntity(entity, ms, node, mflag);
					if (!mflag) {
						if (ms) {
							// console.log("ppp b 03");
							for (let j = 0; j < ms.length; ++j) {
								// this.updateMaterial(ms[j]);
								updateMaterialData(this.wgctx, ms[j]);
							}
						}
						// 保证顺序
						if(!(node.syncSort === false)) {
							break;
						}
					}
					// console.log('B entity.isREnabled(): ', entity.isREnabled());
					if (mflag) {
						// console.log("WGEntityNodeMana::update(), a entity is rendering enabled.");
						ls.splice(i, 1);
						--i;
						this.receiveNode( node );
					}
				} else {
					ls.splice(i, 1);
					--i;
					// console.log("WGEntityNodeMana::update(), remove a waiting entity.");
				}
			}
		}
	}
	updateToTarget(): void {
		this.mEnabled = true;
	}
}
export { WGWaitEntityNode, WGEntityNodeMana };

import { IWGRUnit } from "./IWGRUnit";

import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGEntityNodeMana } from "../rscene/WGEntityNodeMana";
import Camera from "../view/Camera";
import { WGREntityNode } from "./WGREntityNode";
import { Entity3D } from "../entity/Entity3D";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";

type BlockParam = { entityMana: WGEntityNodeMana, roBuilder: WGRObjBuilder, camera: Camera };

const __$RUB = { uid: 0, blocks: [] as WGRenderUnitBlock[] };
class WGRenderUnitBlock {
	private mUid = __$RUB.uid++;
	private mUnits: IWGRUnit[] = [];

	rbParam: BlockParam;
	builder: IWGRPassNodeBuilder;

	private constructor() { }
	static createBlock(): WGRenderUnitBlock {
		const b = new WGRenderUnitBlock();
		__$RUB.blocks.push(b);
		return b;
	}
	static getBlockAt(i: number): WGRenderUnitBlock {
		return __$RUB.blocks[i];
	}
	get uid(): number {
		return this.mUid;
	}

	private mENodeMap: Map<number, WGREntityNode> = new Map();
	addEntityToBlock(entity: Entity3D, node: WGREntityNode): void {
		entity.update();
		node.rstate.__$rever++;
		const runit = this.rbParam.roBuilder.createRUnit(entity, this.builder, node);
		runit.etuuid = entity.uuid;
		this.addRUnit(runit);
	}
	addEntity(entity: Entity3D): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity) {
			const map = this.mENodeMap;
			const euid = entity.uid;
			if (!map.has(euid)) {

				let node = new WGREntityNode();
				node.entity = entity;
				node.entityid = euid;
				node.blockid = this.uid;

				entity.__$bids.push( node.blockid );

				map.set(euid, node);
				entity.rstate.__$inRenderer = true;
				entity.update();
				console.log("and a new entity into the unit bolck, entity: ", entity);
				console.log("and a new entity into the unit bolck, entity.isInRenderer(): ", entity.isInRenderer());

				const wgctx = this.rbParam.roBuilder.wgctx;
				let flag = true;
				if (wgctx && wgctx.enabled) {
					if (entity.isREnabled()) {
						flag = false;
						this.addEntityToBlock(entity, node);
					}
				}
				if (flag) {
					this.rbParam.entityMana.addEntity({ entity: entity, rever: node.rstate.__$rever, builder: this.builder, node, block: this });
				}
			}else {
				console.log("has exist the entity in the unit bolck...");
			}
		}
	}
	removeEntity(entity: Entity3D): void {
		console.log("WGRenderUnitBlock::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity) {
			const map = this.mENodeMap;
			const euid = entity.uid;
			console.log("WGRenderUnitBlock::removeEntity(), map.has(euid): ", map.has(euid),", euid: ", euid);
			if (map.has(euid)) {
				const node = map.get(euid);
				node.rstate.__$rever++;
				map.delete(euid);
				const et = node.entity;
				const ls = et.__$bids;
				if(ls) {
					const bid = this.uid;
					for(let i = 0; i < ls.length; ++i) {
						if(ls[i] == bid) {
							ls.splice(i, 1);
							break;
						}
					}
				}
				node.entity = null;
			}
		}
	}
	addRUnit(unit: IWGRUnit): void {
		/**
		 * 正式加入渲染器之前，对shader等的分析已经做好了
		 */
		if (unit) {
			this.mUnits.push(unit);
		}
	}
	run(): void {
		const uts = this.mUnits;
		let utsLen = uts.length;
		for (let i = 0; i < utsLen;) {
			const ru = uts[i];
			if (ru.__$rever == ru.pst.__$rever) {
				if (ru.getRF()) {
					if (ru.passes) {
						const ls = ru.passes;
						// console.log("apply multi passes total", ls.length);
						for (let i = 0, ln = ls.length; i < ln; ++i) {
							ls[i].runBegin();
							ls[i].run();
						}
					} else {
						// console.log("apply single passes ...");
						ru.runBegin();
						ru.run();
					}
				}
				i++;
			} else {
				ru.destroy();
				uts.splice(i, 1);
				utsLen--;
				console.log("WGRenderUnitBlock::run(), remove a rendering runit.");
			}
		}
	}
	destroy(): void {
		const uts = this.mUnits;
		if (uts) {
			let utsLen = uts.length;
			for (let i = 0; i < utsLen; ++i) {
				const ru = uts[i];
				ru.destroy();
			}
		}
	}
}
export { BlockParam, WGRenderUnitBlock };

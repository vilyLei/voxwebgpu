import { IWGRUnit } from "./IWGRUnit";

import { WGREntityParam } from "../render/WGREntityParam";
import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGEntityNodeMana } from "../rscene/WGEntityNodeMana";
import Camera from "../view/Camera";
import { WGREntityNode } from "./WGREntityNode";
import { Entity3D } from "../entity/Entity3D";
import { IWGRPassNodeBuilder } from "./IWGRPassNodeBuilder";
import { WGMaterialDescripter } from "../material/WGMaterialDescripter";

type BlockParam = { entityMana: WGEntityNodeMana, roBuilder: WGRObjBuilder, camera: Camera };

const __$RUB = { uid: 0, blocks: [] as WGRenderUnitBlock[] };
class UnitLayer {
	units: IWGRUnit[] = [];
}
class WGRenderUnitBlock {
	private mUid = __$RUB.uid++;
	// private mUnits: IWGRUnit[] = [];
	private mLayers: UnitLayer[] = [new UnitLayer()];

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
	private mMaterialMap: Map<number, WGMaterialDescripter> = new Map();

	hasMaterial(material: WGMaterialDescripter, uniqueKey: string): boolean {
		if (material.uid !== undefined) {
			const map = this.mMaterialMap;
			if (map.has(material.uid)) {
				return true;
			}
			// map.set(material.uid, material);
		}
		return false;
	}
	setMaterial(material: WGMaterialDescripter, uniqueKey: string): void {
		// console.log("xxxxxxxxxxx setMaterial(), vvvvvvvvvvvvvvvvv");
		if (material.uid !== undefined) {
			const map = this.mMaterialMap;
			if (!map.has(material.uid)) {
				map.set(material.uid, material);
			}
		}
	}
	addEntityToBlock(entity: Entity3D, node: WGREntityNode, param?: WGREntityParam): void {

		const rob = this.rbParam.roBuilder;
		entity.update();
		node.rstate.__$rever++;
		const runit = rob.createRUnit(entity, this.builder, node, this.uid, param);
		runit.etuuid = entity.uuid + '-[block(' + this.uid + ')]';
		this.addRUnit(runit, param ? param.layerIndex : 0);
		let flag = true;
		if (param) {
			// console.log('addEntityToBlock(), param.phase: ', param.phase);
			if (param.phase === 'finish') {
				flag = false;
			}
		}
		if (flag) {
			// console.log('addEntityToBlock(), phase useful ...');
			rob.mtpl.shadow.addEntity(entity);
		}
	}
	addEntity(entity: Entity3D, param?: WGREntityParam): void {
		// console.log("Renderer::addEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity) {
			const map = this.mENodeMap;
			const euid = entity.uid;
			if (!map.has(euid)) {

				let node = new WGREntityNode();
				node.entity = entity;
				node.entityid = euid;
				node.blockid = this.uid;

				entity.__$bids.push(node.blockid);

				map.set(euid, node);
				entity.rstate.__$inRenderer = true;
				entity.update();
				// console.log("and a new entity into the unit bolck, entity: ", entity);
				// console.log("and a new entity into the unit bolck, entity.isInRenderer(): ", entity.isInRenderer());
				// console.log("and a new entity into the unit bolck, this.builder: ", this.builder);

				const wgctx = this.rbParam.roBuilder.wgctx;
				let flag = true;
				if (wgctx && wgctx.enabled) {
					if (entity.isREnabled()) {
						flag = false;
						this.addEntityToBlock(entity, node);
					}
				}
				if (flag) {
					let rever = node.rstate.__$rever;
					let builder = this.builder;
					let block = this;
					let entityParam = param;
					this.rbParam.entityMana.addEntity({ entity, rever, builder, node, block, entityParam });
				}
			} else {
				console.log("has exist the entity in the unit bolck...");
			}
		}
	}
	removeEntity(entity: Entity3D): void {
		console.log("WGRenderUnitBlock::removeEntity(), entity.isInRenderer(): ", entity.isInRenderer());
		if (entity) {
			const map = this.mENodeMap;
			const euid = entity.uid;
			console.log("WGRenderUnitBlock::removeEntity(), map.has(euid): ", map.has(euid), ", euid: ", euid);
			if (map.has(euid)) {
				const node = map.get(euid);
				node.rstate.__$rever++;
				map.delete(euid);
				const et = node.entity;
				const ls = et.__$bids;
				if (ls) {
					const bid = this.uid;
					for (let i = 0; i < ls.length; ++i) {
						if (ls[i] == bid) {
							ls.splice(i, 1);
							break;
						}
					}
				}
				node.entity = null;
			}
		}
	}
	addRUnit(unit: IWGRUnit, layerIndex?: number): void {
		/**
		 * 正式加入渲染器之前，对shader等的分析已经做好了
		 */
		if (unit) {
			if (layerIndex === undefined) {
				layerIndex = 0;
			}
			if (layerIndex < 0) {
				layerIndex = 0;
			} else if (layerIndex > 127) {
				layerIndex = 127;
			}
			let layers = this.mLayers;
			if (layerIndex >= layers.length) {
				for (let i = layers.length; i <= layerIndex; ++i) {
					layers.push(new UnitLayer());
				}
			}
			let layer = layers[layerIndex];
			// this.mUnits.push(unit);
			layer.units.push(unit);
		}
	}
	run(): void {
		let layers = this.mLayers;
		// console.log("layers.length: ", layers.length);
		for (let k = 0; k < layers.length; ++k) {
			// const uts = this.mUnits;
			const uts = layers[k].units;
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
	}
	destroy(): void {

		let layers = this.mLayers;
		for (let k = 0; k < layers.length; ++k) {
			// const uts = this.mUnits;
			const uts = layers[k].units;
			// const uts = this.mUnits;
			if (uts) {
				let utsLen = uts.length;
				for (let i = 0; i < utsLen; ++i) {
					const ru = uts[i];
					ru.destroy();
				}
				uts = [];
			}
		}
	}
}
export { BlockParam, WGRenderUnitBlock };

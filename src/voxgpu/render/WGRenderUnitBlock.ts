import { IWGRUnit } from "./IWGRUnit";

import { WGRObjBuilder } from "../render/WGRObjBuilder";
import { WGEntityNodeMana } from "../rscene/WGEntityNodeMana";
import Camera from "../view/Camera";
type BlockParam = {entityMana: WGEntityNodeMana, roBuilder: WGRObjBuilder, camera: Camera};

const __$RUB = { uid: 0, blocks: [] as WGRenderUnitBlock[] };
class WGRenderUnitBlock {
	private mUid = __$RUB.uid ++;
	private mUnits: IWGRUnit[] = [];
	private constructor() {}
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
		for (let i = 0; i < utsLen; ) {
			const ru = uts[i];
			if (ru.__$rever == ru.st.__$rever) {
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

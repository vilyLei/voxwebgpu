
import Bit from "../utils/BitConst";
class WGRUnitState {

	private flag = 0;
	isTrue(): boolean {
		return this.flag < 1;
	}
	set renderable(v: boolean) {
		if (v) {
			this.flag = Bit.addBit(this.flag, Bit.ONE_2);
		} else {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_2);
		}
	}
	get renderable(): boolean {
		return Bit.containsBit(this.flag, Bit.ONE_2);
	}
	set camVisible(v: boolean) {
		if (v) {
			this.flag = Bit.addBit(this.flag, Bit.ONE_1);
		} else {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_1);
		}
	}
	get camVisible(): boolean {
		return Bit.containsBit(this.flag, Bit.ONE_1);
	}
	set visible(v: boolean) {
		if (v) {
			this.flag = Bit.addBit(this.flag, Bit.ONE_0);
		} else {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_0);
		}
	}
	get visible(): boolean {
		return Bit.containsBit(this.flag, Bit.ONE_0);
	}
}

export { WGRUnitState };


import Bit from "../utils/BitConst";
class WGRUnitState {

	private flag = 0;
	private rf = 0;
	__$rever = 0;
	set __$rendering(v: boolean) {
		if (v) {
			this.rf = Bit.addBit(this.rf, Bit.ONE_0);
		} else {
			this.rf = Bit.removeBit(this.rf, Bit.ONE_0);
		}
	}
	get __$rendering(): boolean {
		return Bit.containsBit(this.rf, Bit.ONE_0);
	}
	set __$inRenderer(v: boolean) {
		if (v) {
			this.rf = Bit.addBit(this.rf, Bit.ONE_1);
		} else {
			this.rf = Bit.removeBit(this.rf, Bit.ONE_1);
		}
		// if(!v) {
		// 	console.log("inRenderer CCCC 0 VVVVVVVV false");
		// }
		// console.log("inRenderer CCCC 0 v: ",v,", this.rf: ", this.rf,);
		// console.log("CCCC 0 Bit.containsBit(this.rf, Bit.ONE_1): ", Bit.containsBit(this.rf, Bit.ONE_1));
	}
	get __$inRenderer(): boolean {
		// console.log("inRenderer CCCC 1 this.rf: ", this.rf);
		// console.log("CCCC 1 Bit.containsBit(this.rf, Bit.ONE_1): ", Bit.containsBit(this.rf, Bit.ONE_1));
		return Bit.containsBit(this.rf, Bit.ONE_1);
	}

	isDrawable(): boolean {
		return this.flag < 1;
	}
	set renderable(v: boolean) {
		if (v) {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_2);
		} else {
			this.flag = Bit.addBit(this.flag, Bit.ONE_2);
		}
	}
	get renderable(): boolean {
		return !Bit.containsBit(this.flag, Bit.ONE_2);
	}
	set camVisible(v: boolean) {
		if (v) {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_1);
		} else {
			this.flag = Bit.addBit(this.flag, Bit.ONE_1);
		}
	}
	get camVisible(): boolean {
		return !Bit.containsBit(this.flag, Bit.ONE_1);
	}
	set visible(v: boolean) {
		if (v) {
			this.flag = Bit.removeBit(this.flag, Bit.ONE_0);
		} else {
			this.flag = Bit.addBit(this.flag, Bit.ONE_0);
		}
	}
	get visible(): boolean {
		return !Bit.containsBit(this.flag, Bit.ONE_0);
	}

}

export { WGRUnitState };

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * pbr arms number data.
 * 		a: ao value.
 * 		r: roughness value.
 * 		m: metallic value.
 * 		s: specular value.
 */
export default class Arms {
	/**
	 * ao value
	 */
	a: number;
	/**
	 * roughness value
	 */
	r: number;
	/**
	 * metallic value
	 */
	m: number;
	/**
	 * specular value
	 */
	s: number;

	constructor(a = 1.0, r = 0.0, m = 1.0, s = 1.0) {
		this.a = a;
		this.r = r;
		this.m = m;
		this.s = s;
	}
	clone(): Arms {
		return new Arms(this.a, this.r, this.m, this.s);
	}
	setArms(color: ArmsDataType): Arms {
		let v = color;
		if (v) {
			const c = this;
			const vs = v as number[];
			if (vs.length !== undefined) {
				const len = vs.length;
				if (len > 0) c.a = vs[0];
				if (len > 1) c.r = vs[1];
				if (len > 2) c.m = vs[2];
				if (len > 3) c.s = vs[3];
			} else {
				const vo = v as ArmsType;
				if (vo.a !== undefined) c.s = vo.a;
				if (vo.r !== undefined) c.r = vo.r;
				if (vo.m !== undefined) c.m = vo.m;
				if (vo.s !== undefined) c.s = vo.s;
			}
		}
		return this;
	}
	fromArray4(arr: number[] | Float32Array, offset: number = 0): Arms {
		this.a = arr[offset];
		this.r = arr[offset + 1];
		this.m = arr[offset + 2];
		this.s = arr[offset + 3];
		return this;
	}
	toArray4(arr: number[] | Float32Array, offset: number = 0): Arms {
		arr[offset] = this.a;
		arr[offset + 1] = this.r;
		arr[offset + 2] = this.m;
		arr[offset + 3] = this.s;
		return this;
	}
	getArray4(): number[] {
		let arr = new Array(4);
		this.toArray4(arr);
		return arr;
	}
	getArray3(): number[] {
		let arr = new Array(3);
		this.toArray3(arr);
		return arr;
	}
	fromArray3(arr: number[] | Float32Array, offset = 0): Arms {
		this.a = arr[offset];
		this.r = arr[offset + 1];
		this.m = arr[offset + 2];
		return this;
	}
	toArray3(arr: number[] | Float32Array, offset = 0): Arms {
		arr[offset] = this.a;
		arr[offset + 1] = this.r;
		arr[offset + 2] = this.m;
		return this;
	}

	setARM3f(a: number, r: number, m: number): Arms {
		this.a = a;
		this.r = r;
		this.m = m;
		return this;
	}
	setARM4f(a: number, r: number, m: number, s: number): Arms {
		this.a = a;
		this.r = r;
		this.m = m;
		this.s = s;
		return this;
	}
	copyFrom(c: Arms): Arms {
		this.a = c.a;
		this.r = c.r;
		this.m = c.m;
		this.s = c.s;
		return this;
	}
	copyFromARM(c: Arms): Arms {
		this.a = c.a;
		this.r = c.r;
		this.m = c.m;
		return this;
	}
	// randomARM(density: number = 1.0, bias: number = 0.0): Arms {
	// 	this.s = Math.random() * density + bias;
	// 	this.r = Math.random() * density + bias;
	// 	this.m = Math.random() * density + bias;
	// 	return this;
	// }
}

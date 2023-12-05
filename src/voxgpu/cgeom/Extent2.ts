/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class Extent2 {

	x = 0;
	y = 0;
	width = 100;
	height = 100;

	constructor(extent?: Extent2DataType) {
		this.setExtent(extent);
	}
	clone(): Extent2 {
		return new Extent2(this);
	}
	setXYWH(x: number, y: number, width: number, height: number): Extent2 {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		return this;
	}
	setXY(x: number, y: number): Extent2 {
		this.x = x;
		this.y = y;
		return this;
	}
	setSize(w: number, h: number): Extent2 {
		this.width = w;
		this.height = h;
		return this;
	}
	setExtent(extent: Extent2DataType): Extent2 {
		let v = extent;
		if (v) {
			const c = this;
			const vs = v as number[];
			if (vs.length !== undefined) {
				const len = vs.length;
				if (len > 0) c.x = vs[0];
				if (len > 1) c.y = vs[1];
				if (len > 2) c.height = vs[2];
				if (len > 3) c.width = vs[3];
			} else {
				const vo = v as Extent2Type;
				if (vo.x !== undefined) c.x = vo.x;
				if (vo.y !== undefined) c.y = vo.y;
				if (vo.width !== undefined) c.width = vo.width;
				if (vo.height !== undefined) c.height = vo.height;
			}
		}
		return this;
	}
	fromArray4(arr: number[] | Float32Array, offset: number = 0): Extent2 {
		this.x = arr[offset];
		this.y = arr[offset + 1];
		this.width = arr[offset + 2];
		this.height = arr[offset + 3];
		return this;
	}
	toArray4(arr: number[] | Float32Array, offset: number = 0): Extent2 {
		arr[offset] = this.x;
		arr[offset + 1] = this.y;
		arr[offset + 2] = this.width;
		arr[offset + 3] = this.height;
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
	fromArray3(arr: number[] | Float32Array, offset: number = 0): Extent2 {
		this.x = arr[offset];
		this.y = arr[offset + 1];
		this.width = arr[offset + 2];
		return this;
	}
	toArray3(arr: number[] | Float32Array, offset: number = 0): Extent2 {
		arr[offset] = this.x;
		arr[offset + 1] = this.y;
		arr[offset + 2] = this.width;
		return this;
	}

	copyFrom(c: Extent2): Extent2 {
		this.x = c.x;
		this.y = c.y;
		this.width = c.width;
		this.height = c.height;
		return this;
	}
	scaleBy(s: number): Extent2 {
		this.x *= s;
		this.y *= s;
		this.width *= s;
		this.height *= s;
		return this;
	}
	update(): void {

	}
}

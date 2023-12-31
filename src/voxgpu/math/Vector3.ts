/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IVector3 from "./IVector3";

const v_m_180pk = 180.0 / Math.PI;
const v_m_minp = 1e-7;
export default class Vector3 implements IVector3 {
    x = 0.0;
    y = 0.0;
    z = 0.0;
    w = 0.0;
    constructor(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0) {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
    }
    clone(): Vector3 {
        return new Vector3(this.x, this.y, this.z, this.w);
    }
	toZero(): Vector3 {
		return this.setXYZW(0,0,0,0);
	}
	toOne(): Vector3 {
		return this.setXYZW(1,1,1,1);
	}
	setVector4(vector4: Vector3DataType): Vector3 {
		let v = vector4;
		if (v) {
			const t = this;
			const vs = v as number[];
			if (vs.length !== undefined) {
				const len = vs.length;
				if (len > 0) t.x = vs[0];
				if (len > 1) t.y = vs[1];
				if (len > 2) t.z = vs[2];
				if (len > 3) t.w = vs[3];
			} else {
				const tv = v as Vector3Type;
				if (tv.x !== undefined) t.x = tv.x;
				if (tv.y !== undefined) t.y = tv.y;
				if (tv.z !== undefined) t.z = tv.z;
				if (tv.w !== undefined) t.w = tv.w;
			}
		}
		return this;
	}
	setVector3(vector3: Vector3DataType): Vector3 {
		let v = vector3;
		if (v) {
			const t = this;
			const vs = v as number[];
			if (vs.length !== undefined) {
				const len = vs.length;
				if (len > 0) t.x = vs[0];
				if (len > 1) t.y = vs[1];
				if (len > 2) t.z = vs[2];
			} else {
				const tv = v as Vector3Type;
				if (tv.x !== undefined) t.x = tv.x;
				if (tv.y !== undefined) t.y = tv.y;
				if (tv.z !== undefined) t.z = tv.z;
			}
		}
		return this;
	}
	setVector2(vector3: Vector3DataType): Vector3 {
		let v = vector3;
		if (v) {
			const t = this;
			const vs = v as number[];
			if (vs.length !== undefined) {
				const len = vs.length;
				if (len > 0) t.x = vs[0];
				if (len > 1) t.y = vs[1];
			} else {
				const tv = v as Vector3Type;
				if (tv.x !== undefined) t.x = tv.x;
				if (tv.y !== undefined) t.y = tv.y;
			}
		}
		return this;
	}
	abs(): Vector3 {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}
    setXYZW(px: number, py: number, pz: number, pw: number): Vector3 {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
        return this;
    }
    setXYZ(px: number, py: number, pz: number): Vector3 {
        this.x = px;
        this.y = py;
        this.z = pz;
        return this;
    }
	/**
     * example: [0],[1],[2],[3] => x,y,z,w
     */
    fromArray3(arr: NumberArrayType, offset: number = 0): Vector3 {
        this.x = arr[offset];
        this.y = arr[offset + 1];
        this.z = arr[offset + 2];
        return this;
    }
	/**
     * example: x,y,z => [0],[1],[2]
     */
    toArray3(arr: NumberArrayType, offset: number = 0): Vector3 {
        arr[offset] = this.x;
        arr[offset + 1] = this.y;
        arr[offset + 2] = this.z;
        return this;
    }
    fromArray4(arr: NumberArrayType, offset: number = 0): Vector3 {
        this.x = arr[offset];
        this.y = arr[offset + 1];
        this.z = arr[offset + 2];
        this.w = arr[offset + 3];
        return this;
    }
    toArray4(arr: NumberArrayType, offset: number = 0): Vector3 {
        arr[offset] = this.x;
        arr[offset + 1] = this.y;
        arr[offset + 2] = this.z;
        arr[offset + 3] = this.w;
        return this;
    }
    copyFrom(v3: Vector3): Vector3 {
        this.x = v3.x;
        this.y = v3.y;
        this.z = v3.z;
        return this;
    }
    dot(a: Vector3): number {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    multBy(a: Vector3): Vector3 {
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
    }
    normalize(): Vector3 {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > v_m_minp) {
            this.x /= d;
            this.y /= d;
            this.z /= d;
        }
        return this;
    }
    normalizeTo(a: Vector3): void {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > v_m_minp) {
            a.x = this.x / d;
            a.y = this.y / d;
            a.z = this.z / d;
        }
        else {
            a.x = this.x;
            a.y = this.y;
            a.z = this.z;
        }
    }
    scaleVector(s: Vector3): Vector3 {
        this.x *= s.x;
        this.y *= s.y;
        this.z *= s.z;
        return this;
    }
    scaleBy(s: number): Vector3 {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    negate(): Vector3 {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    equalsXYZ(a: Vector3): boolean {
        return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp;
    }
    equalsAll(a: Vector3): boolean {
        return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp && Math.abs(this.w - a.w) < v_m_minp;
    }
    project(): void {
        let t: number = 1.0 / this.w;
        this.x *= t;
        this.y *= t;
        this.z *= t;
    }
    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    getLengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    addBy(a: Vector3): Vector3 {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }
    subtractBy(a: Vector3): Vector3 {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
    }
    subtract(a: Vector3): Vector3 {
        return new Vector3(this.x - a.x, this.y - a.y, this.z - a.z);
    }
    add(a: Vector3): Vector3 {
        return new Vector3(this.x + a.x, this.y + a.y, this.z + a.z);
    }
    crossProduct(a: Vector3): Vector3 {
        return new Vector3(
            this.y * a.z - this.z * a.y
            , this.z * a.x - this.x * a.z
            , this.x * a.y - this.y * a.x
        );
    }
    crossBy(a: Vector3): Vector3 {
        let px = this.y * a.z - this.z * a.y;
        let py = this.z * a.x - this.x * a.z;
        let pz = this.x * a.y - this.y * a.x;
        this.x = px;
        this.y = py;
        this.z = pz;
        return this;
    }
    reflectBy(nv: Vector3): Vector3 {
        let idotn2 = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
        this.x = this.x - idotn2 * nv.x;
        this.y = this.y - idotn2 * nv.y;
        this.z = this.z - idotn2 * nv.z;
        return this;
    }

    scaleVecTo(va: Vector3, scale: number): Vector3 {
        this.x = va.x * scale;
        this.y = va.y * scale;
        this.z = va.z * scale;
        return this;
    }
    subVecsTo(va: Vector3, vb: Vector3): Vector3 {
        this.x = va.x - vb.x;
        this.y = va.y - vb.y;
        this.z = va.z - vb.z;
        return this;
    }
    addVecsTo(va: Vector3, vb: Vector3): Vector3 {
        this.x = va.x + vb.x;
        this.y = va.y + vb.y;
        this.z = va.z + vb.z;
        return this;
    }
    crossVecsTo(va: Vector3, vb: Vector3): Vector3 {
        this.x = va.y * vb.z - va.z * vb.y;
        this.y = va.z * vb.x - va.x * vb.z;
        this.z = va.x * vb.y - va.y * vb.x;
        return this;
    }
    toString(): string {
        return "Vector3(" + this.x + "" + this.y + "" + this.z + ")"
    }
    static readonly X_AXIS = new Vector3(1, 0, 0);
    static readonly Y_AXIS = new Vector3(0, 1, 0);
    static readonly Z_AXIS = new Vector3(0, 0, 1);
    static readonly ZERO = new Vector3(0, 0, 0);
    static readonly ONE = new Vector3(1, 1, 1);

    /**
     * 右手法则(为正)
     */
    static Cross(a: Vector3, b: Vector3, result: Vector3): void {
        result.x = a.y * b.z - a.z * b.y;
        result.y = a.z * b.x - a.x * b.z;
        result.z = a.x * b.y - a.y * b.x;
    }
    // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)
    static CrossSubtract(va0: Vector3, va1: Vector3, vb0: Vector3, vb1: Vector3, result: Vector3): void {
        v_m_v0.x = va1.x - va0.x;
        v_m_v0.y = va1.y - va0.y;
        v_m_v0.z = va1.z - va0.z;

        v_m_v1.x = vb1.x - vb0.x;
        v_m_v1.y = vb1.y - vb0.y;
        v_m_v1.z = vb1.z - vb0.z;
        va0 = v_m_v0;
        vb0 = v_m_v1;
        result.x = va0.y * vb0.z - va0.z * vb0.y;
        result.y = va0.z * vb0.x - va0.x * vb0.z;
        result.z = va0.x * vb0.y - va0.y * vb0.x;
    }
    static Subtract(a: Vector3, b: Vector3, result: Vector3): void {
        result.x = a.x - b.x;
        result.y = a.y - b.y;
        result.z = a.z - b.z;
    }
    static DistanceSquared(a: Vector3, b: Vector3): number {
        v_m_v0.x = a.x - b.x;
        v_m_v0.y = a.y - b.y;
        v_m_v0.z = a.z - b.z;
        return v_m_v0.getLengthSquared();
    }
    static DistanceXYZ(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number {
        v_m_v0.x = x0 - x1;
        v_m_v0.y = y0 - y1;
        v_m_v0.z = z0 - z1;
        return v_m_v0.getLength();
    }
    static Distance(v0: Vector3, v1: Vector3): number {
        v_m_v0.x = v0.x - v1.x;
        v_m_v0.y = v0.y - v1.y;
        v_m_v0.z = v0.z - v1.z;
        return v_m_v0.getLength();
    }

    /**
     * get angle degree between two Vector3 objects
     * @param v0 src Vector3 object
     * @param v1 dst Vector3 object
     * @returns angle degree
     */
    static AngleBetween(v0: Vector3, v1: Vector3): number {
        v0.normalizeTo(v_m_v0);
        v1.normalizeTo(v_m_v1);
        return Math.acos(v_m_v0.dot(v_m_v1)) * v_m_180pk;
    }
    /**
     * get angle radian between two Vector3 objects
     * @param v0 src Vector3 object
     * @param v1 dst Vector3 object
     * @returns angle radian
     */
    static RadianBetween(v0: Vector3, v1: Vector3) {
        v0.normalizeTo(v_m_v0);
        v1.normalizeTo(v_m_v1);
        return Math.acos(v_m_v0.dot(v_m_v1));
    }

    static RadianBetween2(v0: Vector3, v1: Vector3): number {
        //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
        //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
        let pa = v0.getLengthSquared();
        let pb = v1.getLengthSquared();
        v_m_v0.subVecsTo(v0, v1);
        return Math.acos((pa + pb - v_m_v0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));

    }
    static Reflect(iv: Vector3, nv: Vector3, rv: Vector3): void {
        let idotn2 = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
        rv.x = iv.x - idotn2 * nv.x;
        rv.y = iv.y - idotn2 * nv.y;
        rv.z = iv.z - idotn2 * nv.z;
    }

    /**
     * 逆时针转到垂直
     */
    static VerticalCCWOnXOY(v: Vector3): void {
        const x = v.x;
        v.x = -v.y;
        v.y = x;
    }
    /**
     * 顺时针转到垂直
     */
    static VerticalCWOnXOY(v: Vector3): void {
        const y = v.y;
        v.y = -v.x;
        v.x = y;
    }
}

const v_m_v0 = new Vector3();
const v_m_v1 = new Vector3();

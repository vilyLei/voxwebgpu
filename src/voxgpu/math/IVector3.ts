/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IVector3 {
    /**
     * the default value is 0.0
     */
    x: number;
    /**
     * the default value is 0.0
     */
    y: number;
    /**
     * the default value is 0.0
     */
    z: number;
    /**
     * the default value is 1.0
     */
    w: number;
    clone(): IVector3;
	abs(): IVector3;
    setTo(px: number, py: number, pz: number, pw?: number): IVector3;

    /**
     * example: [0],[1],[2],[3] => x,y,z,w
     */
    fromArray4(arr: number[] | Float32Array, offset?: number): IVector3;
    /**
     * example: x,y,z,w => [0],[1],[2],[3]
     */
    toArray4(arr?: number[] | Float32Array, offset?: number): IVector3;
    /**
     * example: [0],[1],[2] => x,y,z
     */
    fromArray(arr: number[] | Float32Array, offset?: number): IVector3;
     /**
      * example: x,y,z => [0],[1],[2]
      */
    toArray(arr?: number[] | Float32Array, offset?: number): IVector3;

    setXYZ(px: number, py: number, pz: number): IVector3;
    copyFrom(v3: IVector3): IVector3;
    dot(a: IVector3): number;
    multBy(a: IVector3): IVector3;
    normalize(): IVector3;
    normalizeTo(a: IVector3): void;
    scaleVector(s: IVector3): IVector3;
    scaleBy(s: number): IVector3;
    negate(): IVector3;
    equalsXYZ(a: IVector3): boolean;
    equalsAll(a: IVector3): boolean;
    project(): void;
    getLength(): number;
    getLengthSquared(): number;
    addBy(a: IVector3): IVector3;
    subtractBy(a: IVector3): IVector3;
    subtract(a: IVector3): IVector3;
    add(a: IVector3): IVector3;
    crossProduct(a: IVector3): IVector3;
    crossBy(a: IVector3): IVector3;
    reflectBy(nv: IVector3): IVector3;

    scaleVecTo(va: IVector3, scale: number): IVector3;
    subVecsTo(va: IVector3, vb: IVector3): IVector3;
    addVecsTo(va: IVector3, vb: IVector3): IVector3;
    crossVecsTo(va: IVector3, vb: IVector3): IVector3;

}
export default IVector3;

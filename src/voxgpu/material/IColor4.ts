/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IColor4 {
    /**
     * the default value is 1.0
     */
    r: number;
    /**
     * the default value is 1.0
     */
    g: number;
    /**
     * the default value is 1.0
     */
    b: number;
    /**
     * the default value is 1.0
     */
    a: number;

    h: number;
    s: number;
    l: number;
    v: number;

    c: number;
    m: number;
    y: number;
    k: number;

    clone(): IColor4;
    setColor(color: ColorDataType): IColor4;
	toBlack(brn?: number): IColor4;
	toWhite(brn?: number): IColor4;
	gammaCorrect(): IColor4;
    clamp(): IColor4;
	ceil(): IColor4;
    /**
     * example: [0],[1],[2],[3] => r,g,b,a
     */
    fromArray4(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * example: r,g,b,a => [0],[1],[2],[3]
     */
    toArray4(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * example: [0],[1],[2] => r,g,b
     */
    fromArray3(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * example: r,g,b => [0],[1],[2]
     */
    toArray3(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * example: [0],[1],[2] => r,g,b
     */
    fromBytesArray3(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * example: r,g,b => [0],[1],[2]
     */
    toBytesArray3(arr: NumberArrayType, offset?: number): IColor4;
    /**
     * set rgb with three float values
     * @param r example: 0.5
     * @param g example: 0.6
     * @param b example: 0.7
     */
    setRGB3f(r: number, g: number, b: number): IColor4;
    /**
     * @param rgbUint24 example: 0xFF88cc
     */
    setRGBUint24(rgbUint24: number): IColor4;
    /**
     * @param argbUint32 example: 0xFFFF88cc
     */
    setARGBUint32(argbUint32: number): IColor4;
    getARGBUint32(): number;
    /**
     * @param r example: 40
     * @param g example: 50
     * @param b example: 60
     */
    setRGB3Bytes(r: number, g: number, b: number): IColor4;
    getRGBUint24(): number;
    /**
     * set rgba with four float values
     * @param r example: 0.5
     * @param g example: 0.6
     * @param b example: 0.7
     * @param a example: 1.0
     */
    setRGBA4f(r: number, g: number, b: number, a: number): IColor4;
    setAlpha(a: number): IColor4;
	setContrast(contrast: number): IColor4;
	toGray(): IColor4;
	setHSL( h: number, s: number, l: number ): IColor4;
	/**
	 * @param target the default value is null
	 */
	getHSL( target?: IColor4 ): IColor4;
    copyFrom(c: IColor4): IColor4;
    copyFromRGB(c: IColor4): IColor4;
    scaleBy(s: number): IColor4;
    rgbSizeTo(size: number): IColor4;

    inverseRGB(): IColor4;
    /**
     * @param density the default value is 1.0
     * @param bias the default value is 0.0
     */
    randomRGB(density: number, bias?: number): IColor4;
    normalizeRandom(density?: number, bias?: number): IColor4;
    normalize(density: number): IColor4;
	lerp(color: IColor4, factor: number): IColor4;

	lerpColors(color1: IColor4, color2: IColor4, factor: number): IColor4;
	lerpHSL(color: IColor4, factor: number): IColor4;
    /**
     * @returns for example: rgba(255,255,255,1.0)
     */
    getCSSDecRGBAColor(): string
    /**
     * @returns for example: #350b7e
     */
    getCSSHeXRGBColor(): string;
	copySRGBToLinear( color: IColor4 ): IColor4;
	copyLinearToSRGB( color: IColor4 ): IColor4;
	convertSRGBToLinear(): IColor4;
	convertLinearToSRGB(): IColor4;
}
export default IColor4;

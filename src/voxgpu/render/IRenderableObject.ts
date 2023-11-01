/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../entity/IROTransform";
import IAABB from "../cgeom/IAABB";
import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";

/**
 * to be used in the renderer runtime
 */
interface IRenderableObject {
	/**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */
    __$rseFlag: number;
	// __$rrver?: number;

	uuid?: string;
	// readonly rers?:Uint16Array;
	/**
	 * mouse interaction enabled, the default value is false
	 */
	mouseEnabled: boolean;
	cameraViewing: boolean;

	isRendering(): boolean;
	isInRenderer(): boolean;

	getGlobalBounds(): IAABB;
	getLocalBounds(): IAABB;
	getGlobalBoundsVer(): number;

	localToGlobal(pv: IVector3): IRenderableObject;
	globalToLocal(pv: IVector3): IRenderableObject;
	/**
	 * @returns value < 12 , the instance is a renderable entity instance, otherwise it is a DisplayEntityContainer instance
	 */
	getREType(): number;
	isContainer(): boolean;

	getUid(): number;
	setVisible(boo: boolean): IRenderableObject;
	isVisible(): boolean;
	getTransform(): IROTransform;
	update(): IRenderableObject;
	destroy(): void;

	getInvMatrix(): IMatrix4;
	getMatrix(): IMatrix4;
	hasParent(): boolean;
}

export { IRenderableObject };

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import { IRenderableEntityContainer } from "./IRenderableEntityContainer";
import { IRenderableObject } from "./IRenderableObject";

/**
 * to be used in the renderer runtime
 */
interface IRenderableEntity extends IRenderableObject {

    __$getParent(): IRenderableEntityContainer;
	__$setParent(parent: IRenderableEntityContainer): void;

    __$testContainerEnabled(): boolean;
    // getRendererUid(): number;
    // /**
    //  * @returns 自身是否未被任何渲染器相关的系统使用
    //  */
    // isFree(): boolean;
    // dispatchEvt(evt: any): number;
    // getEvtDispatcher(evtClassType: number): IEvtDispatcher;

    /**
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: IVector3, rltv: IVector3, outV: IVector3, boundsHit: boolean): number;
    /**
     * @return 返回true表示包含有mesh对象,反之则没有
     */
    hasGeometry(): boolean;
    /**
     * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
     */
    isPolyhedral(): boolean;
    updateBounds(): void;

    // /**
    //  * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
    //  */
    // isInRenderer(): boolean;
    // /**
    //  * @returns 是否在渲染器渲染过程中
    //  */
    // isInRendererProcess(): boolean;
    // /**
    //  * @returns 是否能被渲染
    //  */
    // isRenderEnabled(): boolean;


}

export { IRenderableEntity }

/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import IAABB from "../cgeom/IAABB";
import IRenderer from "../rscene/IRenderer";
import { IRenderableObject } from "./IRenderableObject";
import { IRenderableEntity } from "./IRenderableEntity";

interface IRenderableEntityContainer extends IRenderableObject {

	// 自身所在的world的唯一id, 通过这个id可以找到对应的world
	__$wuid: number;

	/**
	 * render process uid, the default value is -1
	 */
	__$wprocuid: number;
	// 记录自身是否在容器中(取值为0和1), 不允许外外面其他代码调用
	__$contId: number;

	__$setRenderer(renderer: IRenderer): void;
	getRenderer(): IRenderer;

	getParent(): IRenderableEntityContainer;

	getGlobalBounds(): IAABB;
	getChildrenTotal(): number;
	getEntitiesTotal(): number;
	getEntities(): IRenderableEntity[];
	getChildren(): IRenderableEntityContainer[];

	setXYZ(px: number, py: number, pz: number): void;
	/**
	 * @param resultPos the default value is null
	 */
	getPosition(resultPos?: IVector3): IVector3;
	setPosition(pv: IVector3): void;

	/**
	 * @param rv the default value is null
	 */
	getRotation(rv?: IVector3): IVector3;
	setRotation(rv: IVector3): void;

	setRotationXYZ(rx: number, ry: number, rz: number): void;
	setRotationX(r: number): void;
	setRotationY(r: number): void;
	setRotationZ(r: number): void;

	setScaleXYZ(sx: number, sy: number, sz: number): void;
	/**
	 * @param sv the default value is null
	 */
	getScale(sv?: IVector3): IVector3;
	setScale(sv: IVector3): void;

}

export { IRenderableEntityContainer };

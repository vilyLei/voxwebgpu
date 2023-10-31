/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3 from "../math/IVector3";
import IAABB from "../cgeom/IAABB";
import IROTransform from "../entity/IROTransform";
import { IRenderableEntity } from "./IRenderableEntity";
import { IRenderableEntityContainer } from "./IRenderableEntityContainer";

interface ITransformEntity extends IRenderableEntity{

    __$setParent(parent: IRenderableEntityContainer): void;

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

	localToGlobal(pv: IVector3): ITransformEntity;
	globalToLocal(pv: IVector3): ITransformEntity;

}

export default ITransformEntity;

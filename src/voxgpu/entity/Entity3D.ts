import REF from "../rscene/RSEntityFlag";
import IROTransform from "./IROTransform";
import ROTransform from "./ROTransform";
import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";
import IAABB from "../cgeom/IAABB";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGMaterial } from "../material/WGMaterial";
import { IRenderableEntity } from "../render/IRenderableEntity";
import { IRenderableEntityContainer } from "../render/IRenderableEntityContainer";
import AABB from "../cgeom/AABB";
import { WGRUnitState } from "../render/WGRUnitState";

class Entity3D implements IRenderableEntity {

	private static sUid = 0;
	private mUid = Entity3D.sUid++;

	private mVisible = true;
	protected mParent: IRenderableEntityContainer;
	protected mLBs: IAABB;
	protected mGBs: IAABB;
	/**
		 * renderer scene entity flag, be used by the renderer system
		 * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
		 * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
		 * 第27位存放是否在container里面
		 * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
		 * 第30位位存放是否渲染运行时排序
		 */
	__$rseFlag = REF.DEFAULT;
	// __$rrver = 0;

	uuid?: string;

	materials: WGMaterial[];
	geometry?: WGGeometry;

	bounds?: IAABB;
	transform?: ROTransform;

	cameraViewing = true;

	readonly rstate = new WGRUnitState();
	// readonly rers = new Uint16Array([0, 0, 0, 0]);

	/**
	 * mouse interaction enabled
	 */
	mouseEnabled = false;

	constructor(transformEnabled = true) {
		this.init(transformEnabled);
	}
	protected init(transformEnabled: boolean): void {
		if (transformEnabled) {
			this.transform = ROTransform.Create();
		}
		this.initBounds( transformEnabled );
	}

	protected initBounds(transformEnabled: boolean): void {
		this.mGBs = new AABB();
		// this.mLBs = new AABB();
	}

	__$testSpaceEnabled(): boolean {
		//return this.__$spaceId < 0 && this.__$contId < 1;
		return REF.TestSpaceEnabled2(this.__$rseFlag);
	}
	__$testContainerEnabled(): boolean {
		//return this.__$wuid < 0 && this.__$contId < 1;
		return REF.TestContainerEnabled(this.__$rseFlag);
	}
	__$testRendererEnabled(): boolean {
		//return this.__$wuid < 0 && this.__$weid < 0 && this.__$contId < 1;
		return REF.TestRendererEnabled(this.__$rseFlag);
	}
	getRendererUid(): number {
		return REF.GetRendererUid(this.__$rseFlag);
	}

	getUid(): number {
		return this.mUid;
	}

	isREnabled(): boolean {
		const ms = this.materials;
		if (ms) {
			for (let i = 0; i < ms.length; ++i) {
				if (!ms[i].isREnabled()) {
					return false;
				}
			}
		} else {
			return false;
		}
		const g = this.geometry;
		if (g) {
			if (!g.isREnabled()) {
				return false;
			}
		} else {
			return false;
		}
		return true;
	}
	updateBounds(): void {
		if(this.mGBs) {

		}
	}
	update(): Entity3D {
		if (this.transform) {
			this.transform.update();
		}
		if(this.geometry && !this.mLBs) {
			this.mLBs = this.geometry.bounds;
		}
		return this;
	}
	destroy(): void {}

	/**
	 * 表示没有加入任何渲染场景或者渲染器
	 */
	isRenderFree(): boolean {
		return !this.rstate.__$inRenderer;
	}
	/**
	 * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
	 */
	isInRenderer(): boolean {
		return this.rstate.__$inRenderer;
	}
	/**
	 * @returns 是否在渲染器实际的渲染工作流中, 返回true并不表示当前帧一定会绘制
	 */
	isRendering(): boolean {
		return this.rstate.__$rendering;
	}

	getGlobalBounds(): IAABB {
		return this.mGBs;
	}
	getLocalBounds(): IAABB {
		return this.mLBs;
	}
	getGlobalBoundsVer(): number {
		if (this.mGBs) {
			return this.mGBs.version;
		}
		return -1;
	}

	localToGlobal(pv: IVector3): Entity3D {
		return this;
	}
	globalToLocal(pv: IVector3): Entity3D {
		return null;
	}
	/**
	 * @returns value < 12 , the instance is a renderable entity instance, otherwise it is a DisplayEntityContainer instance
	 */
	getREType(): number {
		return 11;
	}
	isContainer(): boolean {
		return false;
	}
	/**
	 * @returns 自身是否未必任何渲染器相关的系统使用
	 */
	isFree(): boolean {
		return this.__$rseFlag == REF.DEFAULT;
	}
	setVisible(v: boolean): Entity3D {
		this.mVisible = v;
		return this;
	}
	isVisible(): boolean {
		return this.mVisible;
	}
	getTransform(): IROTransform {
		return this.transform;
	}

	getInvMatrix(): IMatrix4 {
		return this.transform.getInvMatrix();
	}
	getMatrix(): IMatrix4 {
		return this.transform.getMatrix();
	}

	hasParent(): boolean {
		return this.mParent ? true : false;
	}
	__$getParent(): IRenderableEntityContainer {
		return this.mParent;
	}
	__$setParent(parent: IRenderableEntityContainer): void {
		this.mParent = parent;
	}

	/**
	 * @boundsHit       表示是否包围盒体已经和射线相交了
	 * @rlpv            表示物体坐标空间的射线起点
	 * @rltv            表示物体坐标空间的射线朝向
	 * @outV            如果检测相交存放物体坐标空间的交点
	 * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
	 */
	testRay(rlpv: IVector3, rltv: IVector3, outV: IVector3, boundsHit: boolean): number {
		return -1;
	}
	/**
	 * @return 返回true表示包含有geometry对象,反之则没有
	 */
	hasGeometry(): boolean {
		return this.geometry ? true : false;
	}
	/**
	 * @return 返回true表示基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)，不能直接用于渲染
	 */
	isPolyhedral(): boolean {
		return true;
	}
}
export { Entity3D };

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
import Vector3 from "../math/Vector3";
import { EntityVolume } from "../space/EntityVolume";
import { checkEntityMaterialsInfo, TransformParam, getUniformValueFromParam, Entity3DParam } from "./Entity3DParam";

class Entity3D implements IRenderableEntity {
	private static sUid = 0;
	private mUid = Entity3D.sUid++;

	private mTransVer = -1;
	protected mDescParam: Entity3DParam;
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
	__$bids: number[] = [];

	uuid?: string;

	private mMaterials: WGMaterial[];
	set materials( ms: WGMaterial[] ) {
		this.mMaterials = ms;
	}
	get materials():  WGMaterial[] {
		return this.mMaterials;
	}
	// materials: WGMaterial[];
	geometry?: WGGeometry;

	transform?: ROTransform;

	volume?: EntityVolume;

	/**
	 * for compute shader computing process
	 */
	workcounts?: Uint16Array;

	cameraViewing = true;

	rstate = new WGRUnitState();

	/**
	 * mouse interaction enabled
	 */
	mouseEnabled = false;

	constructor(param?: Entity3DParam) {
		if (!param) param = {};
		if (!(param.building === false)) {
			this.init(param);
		}
		this.mDescParam = param;
	}
	protected init(param?: Entity3DParam): void {
		this.rstate = param.rstate? param.rstate : new WGRUnitState();
		this.cameraViewing = param.cameraViewing === false ? false : true;
		let transformEnabled = !param || param.transformEnabled === undefined || param.transformEnabled === true;
		let transform: ROTransform | IMatrix4 | Float32Array;
		if (param) {
			transform = param.transform as ROTransform;
			transformEnabled = transformEnabled || this.transform !== undefined;
		}
		if (transformEnabled) {
			if (transform) {
				const fs32 = transform as Float32Array;
				if (fs32.byteLength !== undefined) {
					this.transform = ROTransform.Create({ fs32 });
				}
				if (!this.transform) {
					const matrix = transform as IMatrix4;
					if (matrix.identity !== undefined) {
						this.transform = ROTransform.Create({ matrix });
					}
				}
				if (!this.transform) {
					const trans = transform as ROTransform;
					if (trans.getMatrixFS32 !== undefined) {
						this.transform = trans;
					}
				}
				if (!this.transform) {
					const trans = transform as TransformParam;
					if (!trans.scale || !trans.rotation || !trans.position || !trans.matrix) {
						this.transform = ROTransform.Create({ transform: trans });
					}
				}
			} else {
				this.transform = ROTransform.Create();
			}
		}
		this.initBounds(transformEnabled);
		if (param) {
			if (param.transufvShared === true) {
				this.transform.uniformv.shared = true;
			}
			// this.materials = param.materials;
			if(param.materials !== undefined) this.materials = param.materials;
			if(param.geometry !== undefined) this.geometry = param.geometry;
			this.update();
		}
	}

	protected initBounds(transformEnabled: boolean): void {
		this.mGBs = new AABB();
		this.mLBs = new AABB();
		this.mLBs.version = -137;
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

	get uid(): number {
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
		let g = this.geometry;
		if (!g || !g.isREnabled()) {
			// console.log("aaa g.isREnabled(), !g: ", !g,', ', this.geometry);
			return false;
		}
		return true;
	}
	updateBounds(): void {
		const trans = this.transform;
		const lb = this.mLBs;
		if (trans && lb) {
			// this.m_transStatus = ROTransform.UPDATE_TRANSFORM;
			const g = this.geometry;
			if (g) {
				const slb = g.bounds;
				if (lb.version != slb.version) {

					lb.reset();
					const gd = g.geometryData;
					let ivs = gd.getIVS();
					const ivsIndex = 0;
					const vtCount = gd.vtCount;
					lb.addFloat32AndIndices(gd.getVS(), ivs.subarray(ivsIndex, ivsIndex + vtCount), gd.getVSStride());
					lb.update();
					this.update();
				}
			}
		}
	}
	private static sBoundsOutVS = new Float32Array(24);
	private static sPos = new Vector3();
	private static sPrePos = new Vector3();
	private mLBoundsVS: Float32Array;
	private updateLocalBoundsVS(bounds: IAABB): void {
		let min = bounds.min;
		let max = bounds.max;
		if (!this.mLBoundsVS) {
			this.mLBoundsVS = new Float32Array(24);
		}
		const pvs = this.mLBoundsVS;
		pvs[0] = min.x;
		pvs[1] = min.y;
		pvs[2] = min.z;
		pvs[3] = max.x;
		pvs[4] = min.y;
		pvs[5] = min.z;
		pvs[6] = min.x;
		pvs[7] = min.y;
		pvs[8] = max.z;
		pvs[9] = max.x;
		pvs[10] = min.y;
		pvs[11] = max.z;
		pvs[12] = min.x;
		pvs[13] = max.y;
		pvs[14] = min.z;
		pvs[15] = max.x;
		pvs[16] = max.y;
		pvs[17] = min.z;
		pvs[18] = min.x;
		pvs[19] = max.y;
		pvs[20] = max.z;
		pvs[21] = max.x;
		pvs[22] = max.y;
		pvs[23] = max.z;
	}
	protected updateGlobalBounds(): void {

		// 这里的逻辑也有问题,需要再处理，为了支持摄像机等的拾取以及支持遮挡计算等空间管理计算

		const trans = this.transform;
		const slb = this.geometry.bounds;
		const lb = this.mLBs;

		if (trans && lb && slb) {

			const gb = this.mGBs;
			const DE = Entity3D;

			if (trans.isDirty() || this.mTransVer != trans.version || lb.version != slb.version) {

				this.mTransVer = trans.version;
				lb.version = slb.version;
				trans.update();

				const mat = trans.getMatrix();
				if (lb.version != slb.version || !this.mLBoundsVS) {
					this.updateLocalBoundsVS(lb);
				}
				let invs = this.mLBoundsVS;
				let outvs = DE.sBoundsOutVS;
				mat.transformVectors(invs, 24, outvs);
				gb.reset();
				gb.addFloat32Arr(outvs);
				gb.update();

			} else {

				DE.sPrePos.setXYZ(0, 0, 0);
				DE.sPos.setXYZ(0, 0, 0);

				let matrix = trans.getMatrix(false);
				matrix.transformVector3Self(DE.sPrePos);
				trans.update();
				matrix = trans.getMatrix(false);
				matrix.transformVector3Self(DE.sPos);
				DE.sPos.subtractBy(DE.sPrePos);

				gb.min.addBy(DE.sPos);
				gb.max.addBy(DE.sPos);
				gb.center.addBy(DE.sPos);

				++gb.version;
			}
		}
	}
	update(): Entity3D {
		const g = this.geometry;
		if (g) {
			const lb = this.mLBs;
			if (lb && g.bounds && lb.version != g.bounds.version) {
				lb.copyFrom(g.bounds);
			}
			this.updateGlobalBounds();
		}
		if(this.transform) {
			this.transform.update();
		}
		return this;
	}
	destroy(): void {
		if (this.mDescParam) {
			this.mDescParam = null;
		}
	}

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

	get globalBounds(): IAABB {
		return this.mGBs;
	}
	get localBounds(): IAABB {
		return this.mLBs;
	}
	get globalBoundsVer(): number {
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
	set visible(v: boolean) {
		this.rstate.visible = v;
	}
	get visible(): boolean {
		return this.rstate.visible;
	}

	setVisible(v: boolean): Entity3D {
		this.rstate.visible = v;
		return this;
	}
	isVisible(): boolean {
		return this.rstate.visible;
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
export { checkEntityMaterialsInfo, TransformParam, Entity3DParam, getUniformValueFromParam, Entity3D };

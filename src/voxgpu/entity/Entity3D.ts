import REF from "../rscene/RSEntityFlag";
import IROTransform from "./IROTransform";
import ROTransform from "./ROTransform";
import IVector3 from "../math/IVector3";
import IMatrix4 from "../math/IMatrix4";
import IAABB from "../cgeom/IAABB";
import { WGGeometry } from "../geometry/WGGeometry";
import { WGTextureDataDescriptor, WGMaterial } from "../material/WGMaterial";
import { IRenderableEntity } from "../render/IRenderableEntity";
import { IRenderableEntityContainer } from "../render/IRenderableEntityContainer";
import AABB from "../cgeom/AABB";
import { WGRUnitState } from "../render/WGRUnitState";
import { WGRShderSrcType } from "../material/WGMaterialDescripter";
import { WGRBufferData } from "../render/buffer/WGRBufferData";
import { WGRMaterialPassViewImpl } from "../render/pipeline/WGRMaterialPassViewImpl";

interface Entity3DParam {
	cameraViewing?: boolean;
	transformEnabled?: boolean;
	transform?: ROTransform | IMatrix4 | Float32Array;
	transufvShared?: boolean;
	materials?: WGMaterial[];
	geometry?: WGGeometry;
	textures?: WGTextureDataDescriptor[];
	blendModes?: string[];
	faceCullMode?: string;
	depthWriteEnabled?: boolean;
	shaderSrc?: WGRShderSrcType;
	uniformValues?: WGRBufferData[];
	// uniformValueMap?: { [key: string]: WGRUniformValue }
	shadinguuid?: string;
	instanceCount?: number;
	rpasses?: WGRMaterialPassViewImpl[];
}
function getUniformValueFromParam(key: string, param: Entity3DParam, defaultV?: WGRBufferData ): WGRBufferData {
	const ufvs = param.uniformValues;
	if(param.uniformValues) {
		for(let i = 0; i < ufvs.length; ++i) {
			if(ufvs[i].shdVarName == key) {
				return ufvs[i];
			}
		}
	}
	return defaultV;
}
class Entity3D implements IRenderableEntity {
	private static sUid = 0;
	private mUid = Entity3D.sUid++;

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

	materials: WGMaterial[];
	geometry?: WGGeometry;

	transform?: ROTransform;

	/**
	 * for compute shader computing process
	 */
	workcounts?: Uint16Array;

	cameraViewing = true;

	readonly rstate = new WGRUnitState();

	/**
	 * mouse interaction enabled
	 */
	mouseEnabled = false;

	constructor(param?: Entity3DParam) {
		if(!param) param = {};
		this.init(param);
	}
	protected init(param?: Entity3DParam): void {
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
				const matrix = transform as IMatrix4;
				if (matrix.identity !== undefined) {
					this.transform = ROTransform.Create({ matrix });
				}
				const trans = transform as ROTransform;
				if (trans.getMatrixFS32 !== undefined) {
					this.transform = trans;
				}
			} else {
				this.transform = ROTransform.Create();
			}
		}
		this.initBounds(transformEnabled);
		if (param) {
			if(param.transufvShared === true) {
				this.transform.uniformv.shared = true;
			}
			this.materials = param.materials;
			this.geometry = param.geometry;
			if (this.geometry) {
				this.update();
			}
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
		if (this.mGBs) {
		}
	}
	update(): Entity3D {
		this.transform.update();
		const g = this.geometry;
		if (g) {
			const lb = this.mLBs;
			if (lb && g.bounds && lb.version != g.bounds.version) {
				lb.copyFrom(g.bounds);
			}
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
export { Entity3DParam, getUniformValueFromParam, Entity3D };

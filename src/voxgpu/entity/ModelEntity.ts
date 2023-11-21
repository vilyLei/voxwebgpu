import { CoGeomDataType, modelLoader } from "../asset/loader/utils";
import { WGGeometry } from "../geometry/WGGeometry";
import { PrimitiveEntityParam, PrimitiveEntity } from "./PrimitiveEntity";

interface ModelEntityParam extends PrimitiveEntityParam {
	modelUrl?: string;
	callback?: () => void;
}
class ModelEntity extends PrimitiveEntity {
	constructor(param?: ModelEntityParam) {
		let flag = param.modelUrl !== undefined && param.geometry === undefined;
		if (flag) {
			param.building = false;
		}
		super(param);
		if (flag) {
			this.initModel(param);
		}
	}

	private createModelGeometry(gd: CoGeomDataType): WGGeometry {
		const g = this.geometry
			.addAttribute({ position: gd.vertices })
			.addAttribute({ uv: gd.uvsList[0] })
			.addAttribute({ normal: gd.normals })
			.setIndices(gd.indices);
		return g;
	}
	private initModel(param?: ModelEntityParam): void {
		if (!this.geometry) this.geometry = new WGGeometry();

		let url = (this.mDescParam as ModelEntityParam).modelUrl;
		modelLoader.load([url], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			// console.log("ModelEntity::initModel(), loaded models: ", models);
			let len = models.length;
			for (let i = 0; i < len; ++i) {
				this.geometry = this.createModelGeometry(models[i]);
				this.mDescParam.building = true;
				this.init(this.mDescParam);
				this.createMaterial(this.mDescParam);
				break;
			}
			if(param.callback !== undefined) {
				param.callback();
				param.callback = undefined;
			}
		});
	}
}
export { ModelEntityParam, ModelEntity };

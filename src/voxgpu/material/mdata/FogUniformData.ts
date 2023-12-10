import Vector3 from "../../math/Vector3";
import Color4 from "../Color4";
import {
	MaterialUniformVec4ArrayData
} from "./MaterialUniformData";

class FogUniformData extends MaterialUniformVec4ArrayData {
	fogParam = new Vector3();
	fogColor = new Color4();
	constructor(data: Float32Array, shdVarName: string, visibility?: string) {
		super(data, shdVarName, visibility);
		this.data = new Float32Array([
			600, 3500, 0, 0.0005,	// fogParam
			1, 1, 1, 1	// fogColor
		]);
		let pos = 0;
		this.fogParam.fromArray4(data, pos);
		pos += 4;
		this.fogColor.fromArray4(data, pos);
	}
	update(): void {
		const data = this.storage.data;
		let pos = 0;
		this.fogParam.toArray4(data as NumberArrayType, pos);
		pos += 4;
		this.fogColor.toArray4(data as NumberArrayType, pos);
		this.version++;
		this.storage.update();
	}
}

export { FogUniformData };

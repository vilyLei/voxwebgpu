import {
	MaterialUniformVec4Wrapper
} from "./MaterialUniformData";


class FogDataWrapper extends MaterialUniformVec4Wrapper {
	set near(v: number) {
		this.property.x = v;
		this.update();
	}
	get near(): number {
		return this.property.x;
	}
	set far(v: number) {
		this.property.y = v;
		this.update();
	}
	get far(): number {
		return this.property.y;
	}
	set density(v: number) {
		this.property.w = v;
		this.update();
	}
	get density(): number {
		return this.property.w;
	}
}

export { FogDataWrapper };

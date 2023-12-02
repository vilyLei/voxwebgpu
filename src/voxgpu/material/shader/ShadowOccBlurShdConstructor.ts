import shaderSrcCode from "./include/shadowDepthOccBlur.wgsl";
import { WGShaderPredefine } from "./WGShaderPredefine";

class ShadowOccBlurShdConstructor {
	readonly predefine = new WGShaderPredefine();
	constructor() { }
	reset(): void {
		this.predefine.reset();
	}

	build(predefine: string): string {

		const preDef = this.predefine;
		preDef.parsePredefineVar(predefine);

		let shdWGSL = shaderSrcCode;
		
		shdWGSL = preDef.applyPredefine(shdWGSL);
		console.log("\n###### predefine:");
		console.log(predefine);
		console.log("\n###### shdWGSL:");
		console.log(shdWGSL);
		return shdWGSL;
	}
}
export { ShadowOccBlurShdConstructor };

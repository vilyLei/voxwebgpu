import shaderSrcCode from "./include/shadowDepthOccBlur.wgsl";
import { WGShdCodeCtor } from "./WGShdCodeCtor";

class ShadowOccBlurShdCtor extends WGShdCodeCtor {
	build(predefine: string): string {

		this.reset();
		
		const preDef = this.predefine;
		preDef.parsePredefineVar(predefine);

		let shdWGSL = shaderSrcCode;
		
		shdWGSL = preDef.applyPredefine(shdWGSL);
		// console.log("\n###### predefine:");
		// console.log(predefine);
		// console.log("\n###### shdWGSL:");
		// console.log(shdWGSL);
		return shdWGSL;
	}
}
export { ShadowOccBlurShdCtor };

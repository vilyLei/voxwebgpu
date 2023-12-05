import shaderSrcCode from "./shadow/shadowReceive2.wgsl";
import { WGShaderPredefine } from "./WGShaderPredefine";

import matrixWGSL from "./include/matrix.wgsl";
import vsmShadowHeadWGSL from "./include/vsmShadowHead.wgsl";
import { WGShdCodeCtor } from "./WGShdCodeCtor";


const shdSrcModules: Map<string, string> = new Map();
function initModules() {
	shdSrcModules.set("matrix", matrixWGSL);
	shdSrcModules.set("vsmShadowHead", vsmShadowHeadWGSL);
}
initModules();
class ShadowReceiveShdCtor extends WGShdCodeCtor {
	constructor() {
		super();
		this.codeModules = shdSrcModules;
	}

	build(predefine: string): string {

		this.reset();

		console.log("ShadowReceiveShdCtor::build() ...");

		let shdWGSL = shaderSrcCode;
		
		shdWGSL = this.parseInclude(shdWGSL);
		// console.log("\n###### predefine:");
		// console.log(predefine);
		// console.log("\n###### shdWGSL:");
		// console.log(shdWGSL);
		return shdWGSL;
	}
}
export { ShadowReceiveShdCtor };

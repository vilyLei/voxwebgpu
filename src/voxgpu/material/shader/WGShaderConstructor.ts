import baseVertWGSL from "./include/base.vert.wgsl";
import baseFragWGSL from "./include/base.frag.wgsl";
import mathDefineWGSL from "./include/mathDefine.wgsl";
import matrixWGSL from "./include/matrix.wgsl";
import pbrFunctionsWGSL from "./include/pbrFunctions.wgsl";
import fogFragHeadWGSL from "./include/fogFragHead.wgsl";
import fragOutputWGSL from "./include/fragOutput.wgsl";
import { WGShaderPredefine } from "./WGShaderPredefine";

const shdSrcModules: Map<string, string> = new Map();
function initModules() {
	shdSrcModules.set("matrix", matrixWGSL);
	shdSrcModules.set("mathDefine", mathDefineWGSL);
	shdSrcModules.set("pbrFunctions", pbrFunctionsWGSL);
	shdSrcModules.set("fogFragHead", fogFragHeadWGSL);
	shdSrcModules.set("fragOutput", fragOutputWGSL);
}
initModules();

// let testStr =
// `
// fn calcColor4(worldPos: vec4<f32>, uv: vec2<f32>, worldNormal: vec3<f32>, worldCamPos: vec3<f32>) -> vec4<f32> {
// 	A#####
// 	#ifdef USE_GLOSSINESS
// 		let colorGlossiness = clamp(1.0 - roughness, 0.0, 1.0);
// 	#else
// 		let colorGlossiness = clamp(roughness, 0.0, 1.0);
// 	#endif
// 	B######
//     #ifdef USE_METALLIC_CORRECTION
// 		let specularColorMetal = mix(F0, albedo.xyz, vec3<f32>(metallic));
// 		let ratio = clamp(metallic, 0.0, 1.0);
// 		specularColor = mix(specularColor, specularColorMetal, ratio);
//     #endif
// 	C######
//     #ifdef USE_TONE_MAPPING
//     color = tonemapReinhard( color, toneParam.x );
//     #endif
// 	D######
// }
// `;
// let testStr2 =
// `//// 	#endif
// `;
let testStr3 =
`
AAAAAAAAAA 01
#ifdef VOX_WOOL
fn FD_BurleyWool(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	let lightScatter = FD_Schlick(NoL, 1.0, f90);
	let viewScatter = FD_Schlick(NoV, 1.0, f90);
	return lightScatter * viewScatter;
}
fn getColorFactorIntensity(NoV: f32, frontScale: f32, sideScale: f32) -> f32 {
	let invNoV = 1.0 - NoV;
	let x2 = invNoV * invNoV;
	let x3 = x2 * invNoV;
	let x4 = x3 * invNoV;
	let x5 = x4 * invNoV;
	let k = clamp(-10.15 * x5 + 20.189 * x4 - 12.811 * x3 + 4.0585 * x2 - 0.2931 * invNoV, 0.0, 1.0);
	// sideFactorIntensity
	return mix(frontScale, sideScale, k);
}
#else
fn FD_Burley(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32, frontScale: f32, sideScale: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	let lightScatter = FD_Schlick(NoL, 1.0, f90);
	let viewScatter = FD_Schlick(NoV, frontScale, sideScale * f90);
	return lightScatter * viewScatter;
}
AAAAAAAAAA 02
#endif
AAAAAAAAAA 03
#ifdef VOX_DOLL
$$$$$$$$$ DOLL 01
#endif
AAAAAAAAAA 04
`;

let testStr4 =
`
AAAAAAAAAA 01 begin
#ifdef VOX_BURLEY
#ifdef VOX_WOOL
fn FD_BurleyWool(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	return lightScatter * viewScatter;
}
fn getColorFactorIntensity(NoV: f32, frontScale: f32, sideScale: f32) -> f32 {
	let invNoV = 1.0 - NoV;
	return mix(frontScale, sideScale, k);
}
#else//#90 VOX_WOOL
fn FD_Burley(linearRoughness: f32, NoV: f32, NoL: f32, LoH: f32, frontScale: f32, sideScale: f32) -> f32 {
	let f90 = 0.5 + 2.0 * linearRoughness * LoH * LoH;
	return lightScatter * viewScatter;
}
AAAAAAAAAA 02A

#ifdef VOX_TT01
AAAAAAAAAA 02B-VOX_TT01
#endif//#101 VOX_TT01

#endif//#201 VOX_WOOL

#endif//#301 VOX_BURLEY

AAAAAAAAAA 03
#ifndef VOX_DOLL
$$$$$$$$$ DOLL 01
#else
$$$$$$$$$ DOLL 02 with else
#endif
AAAAAAAAAA 04
`;

let testStr5 =
`
AAAAAAAAAA 01 begin
AAAAAAAAAA 03
#ifndef VOX_DOLL
$$$$$$$$$ DOLL 01
#else
$$$$$$$$$ DOLL 02
#endif
AAAAAAAAAA 04
`;
class WGShaderConstructor {
	readonly predefine = new WGShaderPredefine();
	private moduleNames: string[] = [];
	constructor() { }
	reset(): void {
		this.predefine.reset();
	}

	testBuild(predefine: string): string {

		predefine =
			`
		#define VOX_BURLEY
		#define VOX_WOOL
		#define VOX_DOLL
		`;
		// let isCommentLine = codeLineCommentTest(testStr2);
		// console.log('isCommentLine: ', isCommentLine);
		// return;
		const preDef = this.predefine;
		preDef.parsePredefineVar(predefine);

		// let clearnSrc = preDef.applyPredefine(testStr3);
		// let clearnSrc = preDef.applyPredefine(fragOutputWGSL);
		// let clearnSrc = preDef.applyPredefine( testStr );
		// console.log("\n###### testStr3:");
		// console.log(testStr3);
		let clearnSrc = preDef.applyPredefine(testStr4);
		// let clearnSrc = preDef.applyPredefine(testStr5);
		console.log("\n###### clearnSrc:");
		console.log(clearnSrc);
		// console.log("\n###### clearnSrc:");
		// console.log(clearnSrc);
		// let codeSrc = `${baseVertWGSL}${baseFragWGSL}`;//baseVertWGSL ;
		// console.log(">>>>> >>>>> >>>>> >>>>> >>>>> >>>>>");
		return
		let vertWGSL = baseVertWGSL;
		vertWGSL = this.parseInclude(vertWGSL);
		// console.log("\n###### vertWGSL:");
		// console.log(vertWGSL);

		let fragWGSL = baseFragWGSL;
		fragWGSL = this.parseInclude(fragWGSL);
		fragWGSL = preDef.applyPredefine(fragWGSL);
		// console.log("\n###### fragWGSL:");
		// console.log(fragWGSL);
		let code = vertWGSL + fragWGSL;
		// console.log("\n###### whole shader:");
		// console.log(code);
		return code;
	}
	build(predefine: string): string {

		const preDef = this.predefine;
		preDef.parsePredefineVar(predefine);

		let vertWGSL = baseVertWGSL;
		
		vertWGSL = preDef.applyPredefine(vertWGSL);
		vertWGSL = this.parseInclude(vertWGSL);
		// console.log("\n###### vertWGSL:");
		// console.log(vertWGSL);

		let fragWGSL = baseFragWGSL;
		fragWGSL = preDef.applyPredefine(fragWGSL);
		console.log("\n###### fragWGSL:");
		console.log(fragWGSL);
		fragWGSL = this.parseInclude(fragWGSL);
		fragWGSL = preDef.applyPredefine(fragWGSL);
		// console.log("\n###### fragWGSL:");
		// console.log(fragWGSL);
		let code = vertWGSL + fragWGSL;
		// console.log("\n###### whole shader:");
		// console.log(code);
		return code;
	}
	parseInclude(src: string): string {
		// 第一步, 去除注释, 然后再接着处理(或者想法子越过注释)
		let dst = src;
		let keyStr = "#include ";
		let index = src.indexOf(keyStr);

		const moduleNames = this.moduleNames;

		for (; index >= 0;) {
			let begin = dst.indexOf("<", index + 1);
			let end = dst.indexOf(">", begin + 1);
			// console.log("parseInclude(), begin, end: ", begin, end);
			if (end > 0) {
				let moduleName = dst.slice(begin + 1, end).trim();
				// console.log("parseInclude(), moduleName: ", moduleName);
				let includeCmd = dst.slice(index, end + 1);
				// 同一个代码块不用载入两次
				if (moduleNames.includes(moduleName)) {
					dst = dst.replace(includeCmd, `\n\r`);
					end = index + 1;
				} else {
					moduleNames.push(moduleName);
					let moduleCode = shdSrcModules.get(moduleName);
					// console.log("parseInclude(), includeCmd: ", includeCmd);
					dst = dst.replace(includeCmd, `\n\r${moduleCode}\n\r`);
				}
				// console.log('parseInclude(), dst:');
				// console.log(dst);
				index = dst.indexOf(keyStr, end);
			} else {
				break;
			}
		}
		return dst;
	}
}
export { WGShaderConstructor };

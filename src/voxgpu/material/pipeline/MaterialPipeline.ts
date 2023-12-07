import { WGRBufferValue } from "../../render/buffer/WGRBufferValue";
import { WGRTexLayoutParam } from "../../render/uniform/IWGRUniformContext";
import { WGRShderSrcType } from "../WGMaterialDescripter";
import { WGRBufferData } from "../mdata/MaterialUniformData";
import { getCodeLine, codeLineCommentTest } from "../shader/utils";

const bufValue = new WGRBufferValue({ shdVarName: 'bufValue' });
class MaterialPipeline {
    constructor(){}
    
	shaderBuild(shdSrc: WGRShderSrcType, uvalues: WGRBufferData[], utexes: WGRTexLayoutParam[]): WGRShderSrcType {
		let shd = shdSrc.shaderSrc;
		if (shd) {

			let code = shd.code;
			let bi = code.indexOf('@binding(');
			for(let i = 0; i < 30; ++i) {
				if(bi >= 0) {
					let codeLine = getCodeLine(code, bi);
					if (!codeLineCommentTest(codeLine)) {
						break;
					}
				}else {
					break;
				}
			}
			if (bi >= 0) {
				let begin = code.indexOf('@group(');
				let end = code.lastIndexOf(' @binding(');
				end = code.indexOf(';', end + 1);
				code = code.slice(0, begin) + code.slice(end + 1);
				// console.log('oooooooooo begin, end: ', begin, end);
			}
			// console.log('oooooooooo code: ', code);
			// console.log(`code.indexOf('@binding(') < 0: `, code.indexOf('@binding(') < 0);
			if (bi < 0) {
				let codeStr = '';
				let index = 0;
				if (uvalues && uvalues.length > 0) {
					// @group(0) @binding(0) var<uniform> objMat : mat4x4<f32>;
					for (let i = 0; i < uvalues.length; ++i) {
						bufValue.usage = uvalues[i].usage;
						let varType = bufValue.isStorage() ? 'storage' : 'uniform';
						let str = `@group(0) @binding(${index++}) var<${varType}> ${uvalues[i].shdVarName} : ${uvalues[i].shdVarFormat};\n`;
						codeStr += str;
					}
				}
				if (utexes && utexes.length > 0) {
					// console.log('utexes: ', utexes);
					for (let i = 0; i < utexes.length; ++i) {
						let tex = utexes[i];
						let varType = 'texture_2d';
						switch (tex.viewDimension) {
							case 'cube':
								varType = 'texture_cube';
								break;
							default:
								break;
						}
						let str = `@group(0) @binding(${index++}) var ${tex.shdVarName}Sampler: sampler;\n`;
						str += `@group(0) @binding(${index++}) var ${tex.shdVarName}Texture: ${varType}<f32>;\n`;
						codeStr += str;
					}
				}
				// console.log("shaderBuild(), codeStr:");
				// console.log(codeStr);
				if (codeStr !== '') {
					codeStr = codeStr + code;
					let shaderSrc = {
						// shaderSrc: { code: basePBRVertWGSL + basePBRFragWGSL, uuid: "wholeBasePBRShdCode" },
						shaderSrc: { code: codeStr, uuid: shd.uuid },
						// shaderSrc: { code: basePBRWholeInitWGSL, uuid: "wholeBasePBRShdCode" },
					};
					// console.log("shaderBuild() VVVVVVVVVVVVVVVVVVVVVVVV, codeStr: ");
					// console.log( codeStr );
					return shaderSrc;
				}
			}
		}
		return shdSrc;
	}
}
export { MaterialPipeline };
import { GPUBlendComponent } from "../../gpu/GPUBlendComponent";

interface WGRShadeSrcParam {
	code: string;
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string
}
interface WGRShderSrcType {
	shaderSrc?: WGRShadeSrcParam;
	vertShaderSrc?: WGRShadeSrcParam;
	fragShaderSrc?: WGRShadeSrcParam;
	compShaderSrc?: WGRShadeSrcParam;
}
export { WGRShderSrcType, WGRShadeSrcParam };

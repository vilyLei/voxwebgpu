import { WGRBufferData } from "../buffer/WGRBufferData";
import { WGRTexLayoutParam } from "../uniform/IWGRUniformContext";

interface WGRShadeSrcParam {
	code?: string;
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string

	uvalues?: WGRBufferData[];
	utexes?: WGRTexLayoutParam[];
}
interface WGRShderSrcType extends WGRShadeSrcParam {
	shaderSrc?: WGRShadeSrcParam;
	vertShaderSrc?: WGRShadeSrcParam;
	fragShaderSrc?: WGRShadeSrcParam;
	compShaderSrc?: WGRShadeSrcParam;

	vert?: WGRShadeSrcParam;
	frag?: WGRShadeSrcParam;
	comp?: WGRShadeSrcParam;
}


export { WGRShderSrcType, WGRShadeSrcParam };

interface WGRShadeSrcParam {
	code?: string;
	uuid?: string;
	vertEntryPoint?: string;
	fragEntryPoint?: string;
	compEntryPoint?: string
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

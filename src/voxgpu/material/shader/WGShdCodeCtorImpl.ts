export interface WGShdCodeCtorImpl {
	
	reset(): void;
	destroy(): void;
	build(predefine: string): string;
	parseInclude(src: string): string;
}

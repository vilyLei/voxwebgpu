import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { GPUCanvasConfiguration } from "../gpu/GPUCanvasConfiguration";
import { WGRPassWrapperImpl } from "../render/pipeline/WGRPassWrapperImpl";
import { MtPlDescriptor } from "../material/pipeline/MtPlDescriptor";

interface WGCameraParam {
	eye?: Vector3DataType;
	origin?: Vector3DataType;
	up?: Vector3DataType;
	near?: number;
	far?: number;
	perspective?: boolean;
	fovDegree?: number;
	viewX?: number;
	viewY?: number;
	viewWidth?: number;
	viewHeight?: number;
	enabled?: boolean;
}
interface WGRendererConfig {
	gpuCanvasCfg?: GPUCanvasConfiguration;
	ctx?: WebGPUContext;
	canvas?: HTMLCanvasElement;
	canvasWith?: number;
	canvasHeight?: number;
	div?: HTMLDivElement;
	rpassparam?: WGRPassParam;
	camera?: WGCameraParam;
	mtplEnabled?: boolean;
	mtpl?: MtPlDescriptor;
	/**
	 * Possible values are: "#000000", "#335533" 
	 */
	webBodyBackground?: string;
	callback?: (type?: string) => void;
}
class RPassInfoParam {
	blockIndex = 0;
	rparam: WGRPassParam;
	ref: WGRPassWrapperImpl;
}

function checkConfig(config?: WGRendererConfig): WGRendererConfig {
	let canvasCFG: GPUCanvasConfiguration = { alphaMode: "premultiplied" };
	let canvas: HTMLCanvasElement;
	let div: HTMLDivElement;
	if (config) {
		canvas = config.canvas;
		div = config.div;
		if (config.gpuCanvasCfg) {
			canvasCFG = config.gpuCanvasCfg;
		}
	} else {
		config = { canvas: null };
	}
	
	if(config.webBodyBackground !== undefined) {
		const body = document.body;
		body.style.background = config.webBodyBackground;
	}
	let width = config.canvasWith !== undefined ? config.canvasWith : 512;
	let height = config.canvasHeight !== undefined ? config.canvasHeight : 512;
	if (!div) {
		div = document.createElement("div");
		document.body.appendChild(div);

		const style = div.style;
		style.display = "bolck";
		style.position = "absolute";

		if (style.left == "") {
			style.left = "0px";
			style.top = "0px";
		}
		div.style.width = width + "px";
		div.style.height = height + "px";
	}
	if (!canvas) {
		canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		div.appendChild(canvas);
	}
	config.canvas = canvas;
	config.div = div;
	config.gpuCanvasCfg = canvasCFG;
	return config;
}
export { WGCameraParam, RPassInfoParam, WGRendererConfig, WGRPipelineContextDefParam, checkConfig };

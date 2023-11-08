import { WebGPUContext } from "../gpu/WebGPUContext";
import { WGRPipelineContextDefParam, WGRPassParam, WGRenderPassBlock } from "../render/WGRenderPassBlock";
import { GPUCanvasConfiguration } from "../gpu/GPUCanvasConfiguration";
import { IWGRPassRef } from "../render/pipeline/IWGRPassRef";
import Vector3 from "../math/Vector3";

interface WGCameraParam {
	position?: Vector3;
	look?: Vector3;
	up?: Vector3;
	near?: number;
	far?: number;
	perspective?: boolean;
	fovDegree?: number;
}
interface WGRendererConfig {
	gpuCanvasCfg?: GPUCanvasConfiguration;
	ctx?: WebGPUContext;
	canvas?: HTMLCanvasElement;
	div?: HTMLDivElement;
	rpassparam?: WGRPassParam;
	camera?: WGCameraParam;
	callback?: (type?: string) => void;
}
class RPassInfoParam {
	blockIndex = 0;
	rparam: WGRPassParam;
	ref: IWGRPassRef;
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
	let width = 512;
	let height = 512;
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

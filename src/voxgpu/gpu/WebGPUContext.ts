import { GPU } from "./GPU";
import { GPUDevice } from "./GPUDevice";
import { GPUAdapter } from "./GPUAdapter";
import { GPUQueue } from "./GPUQueue";
import { GPUCanvasContext } from "./GPUCanvasContext";
import { GPUCanvasConfiguration } from "./GPUCanvasConfiguration";
import { GPUDeviceDescriptor } from "./GPUDeviceDescriptor";
import { GPUTextureView } from "./GPUTextureView";
import { checkGPUTextureFormat } from "./GPUTextureFormat";
import { calculateMipLevels, GPUMipmapGenerator } from "../texture/GPUMipmapGenerator";
import { WebGPUContextImpl } from "./WebGPUContextImpl";
import { WebGPUTextureContext } from "./WebGPUTextureContext";
import { WebGPUBufferContext } from "./WebGPUBufferContext";

class WebGPUContext implements WebGPUContextImpl {

	private static sUid = 0;
	private mUid = WebGPUContext.sUid++;

	readonly canvas: HTMLCanvasElement;
	readonly context: GPUCanvasContext;
	readonly device: GPUDevice;
	readonly queue: GPUQueue;
	readonly canvasFormat: string;
	readonly presentationFormat = 'bgra8unorm';
	readonly gpu: GPU;
	readonly gpuAdapter: GPUAdapter;
	readonly enabled = false;

	readonly mipmapGenerator = new GPUMipmapGenerator();
	readonly texture = new WebGPUTextureContext();
	readonly buffer = new WebGPUBufferContext();
	constructor(){}
	/**
	 * @param format GPU texture format string.
	 * @param error The default value is true.
	 * @returns GPU texture format is correct or wrong.
	 */
	checkGPUTextureFormat(format: string, error: boolean = true): boolean {
		return checkGPUTextureFormat(format, error);
	}

	get uid(): number {
		return this.mUid;
	}
	get canvasWidth(): number {
		return this.canvas.width;
	}
	get canvasHeight(): number {
		return this.canvas.height;
	}
	async initialize(canvas: HTMLCanvasElement, wgConfig?: GPUCanvasConfiguration, deviceDescriptor?: GPUDeviceDescriptor) {

		const selfT = this as any;
		selfT.canvas = canvas;

		const gpu: GPU = (navigator as any).gpu;
		if (gpu) {
			console.log("WebGPU is supported on this browser.");
			selfT.gpu = gpu;
			if(!deviceDescriptor) deviceDescriptor = {};
			const adapter = await gpu.requestAdapter();
			if (adapter) {
				selfT.gpuAdapter = adapter;
				console.log("Appropriate GPUAdapter found, adapter: ", adapter);
				if(deviceDescriptor.requiredFeatures === undefined) {
					deviceDescriptor.requiredFeatures = [
						// 'texture-compression-bc',
						// 'texture-compression-etc2',
						// 'texture-compression-astc'
					];
				}
				const device = await adapter.requestDevice(deviceDescriptor);
				if (device) {

					this.mipmapGenerator.initialize(device);

					selfT.device = device;
					selfT.queue = device.queue;
					console.log("Appropriate GPUDevice found.");
					let canvasFormat = gpu.getPreferredCanvasFormat();
					selfT.canvasFormat = canvasFormat;

					selfT.context = canvas.getContext("webgpu") as any;
					const context = this.context;

					const format = canvasFormat;
					if(checkGPUTextureFormat(format)) {
						console.log("Given canvasFormat('"+format+"') is a valid gpu texture format.");
					}else {
						console.error("Given canvasFormat('"+format+"') is an invalid gpu texture format.");
						canvasFormat = "bgra8unorm";
					}

					if(wgConfig) {
						wgConfig.device = device;
						if(wgConfig.format) {
							canvasFormat = wgConfig.format;
						}else {
							wgConfig.format = canvasFormat;
						}
					}
					selfT.presentationFormat = wgConfig.format;

					context.configure(wgConfig ? wgConfig : {
						device: device,
						format: canvasFormat,
						// usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
						alphaMode: "premultiplied"
					});
					selfT.texture.initialize( this );
					selfT.buffer.initialize( this );
					selfT.enabled = true;
					console.log("WebGPUContext instance initialization success ...");
				} else {
					throw new Error("No appropriate GPUDevice found.");
				}
			} else {
				throw new Error("No appropriate GPUAdapter found.");
			}
		} else {
			throw new Error("WebGPU is not supported on this browser.");
		}
	}
	getPreferredCanvasFormat(): string {
		return this.gpu.getPreferredCanvasFormat();
	}
	createCurrentView(): GPUTextureView {
		return this.context.getCurrentTexture().createView();
	}
}
export { calculateMipLevels, WebGPUContext };

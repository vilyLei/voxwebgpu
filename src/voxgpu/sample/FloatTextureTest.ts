import MouseEvent from "../event/MouseEvent";
import { RendererScene } from "../rscene/RendererScene";
import { MouseInteraction } from "../ui/MouseInteraction";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { GPUTexture } from "../gpu/GPUTexture";
import { toFloat16 } from "../utils/CommonUtils";
import { CubeEntity } from "../entity/CubeEntity";


export class FloatTextureTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FloatTextureTest::initialize() ...");
		let callback = (): void => {
			this.initEvent();
			this.initScene();
		};
		this.mRscene.initialize({ callback });
	}
	private initEvent(): void {
		const rc = this.mRscene;
		rc.addEventListener(MouseEvent.MOUSE_DOWN, this.mouseDown);
		new MouseInteraction().initialize(rc, 0, false).setAutoRunning(true);
	}
	private createSolidColorTexture(r: number, g: number, b: number, a: number): GPUTexture {
		let rc = this.mRscene;
		let wgctx = rc.getWGCtx();
		const data = new Uint8Array([r * 255, g * 255, b * 255, a * 255]);
		const texture = wgctx.device.createTexture({
			size: { width: 1, height: 1 },
			format: "rgba8unorm",
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
		});
		wgctx.device.queue.writeTexture({ texture }, data, {}, { width: 1, height: 1 });
		return texture;
	}
	private createFloat16Texture(width: number, height: number): GPUTexture {
		let rc = this.mRscene;
		let wgctx = rc.getWGCtx();

		let data = new Uint16Array(width * height * 4);
		let scale = 10.0;
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * 4;
				data[k] = toFloat16(scale * (j/width));
				data[k+1] = toFloat16(scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j/width))));
				data[k+2] = toFloat16(scale * (1.0 - (i * j)/(width * height)));
				data[k+3] = toFloat16(scale * 1.0);
			}
		}

		const texture = wgctx.device.createTexture({
			size: { width, height },
			format: "rgba16float",
			usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
		});
		wgctx.device.queue.writeTexture({ texture }, data, {bytesPerRow: width * 8, rowsPerImage: height}, { width, height });
		return texture;
	}

	private createFloatColorTexture(width: number, height: number): GPUTexture {

		let rc = this.mRscene;
		let wgctx = rc.getWGCtx();

		let data = new Float32Array(width * height * 4);
		let scale = 10.0;
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * 4;
				data[k] = scale * (j/width);
				data[k+1] = (scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j/width))));
				data[k+2] = (scale * (1.0 - (i * j)/(width * height)));
				data[k+3] = (scale * 1.0);
			}
		}

		let texture = wgctx.texture.createFloat16Texture(data, width, height);
		return texture;
	}
	private applyFloatTex(): void {
		let rc = this.mRscene;

		// let solidColorTex = this.createSolidColorTexture(1.0, 0.0, 0.0, 1.0);
		let f32Tex0 = this.createFloatColorTexture(16, 16);

		let width = 128;
		let height = 128;

		const floatTex = {
			diffuse: { uuid: "rtt0", dataTexture: { texture: f32Tex0, width, height }, format: "rgba16float" }
		};

		let entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [floatTex] });
		entity.color = [0.1, 0.1, 0.1, 0.1];
		rc.addEntity(entity);
		// let cube = new CubeEntity({textures:[floatTex]});
		// rc.addEntity(cube);
	}
	private mouseDown = (evt: MouseEvent): void => {};
	private initScene(): void {
		this.applyFloatTex();
	}

	run(): void {
		this.mRscene.run();
	}
}

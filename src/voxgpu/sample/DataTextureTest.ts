import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";

export class DataTextureTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("DataTextureTest::initialize() ...");

		this.initScene();
	}
	private applyRGBAFloat16Tex(): void {
		let rc = this.mRscene;

		let width = 256;
		let height = 256;

		let dataFs32 = new Float32Array(width * height * 4);
		let scale = 10.0;
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * 4;
				dataFs32[k] = scale * (j / width);
				dataFs32[k + 1] = scale * (0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width)));
				dataFs32[k + 2] = scale * (1.0 - (i * j) / (width * height));
				dataFs32[k + 3] = scale * 1.0;
			}
		}
		const tex = {
			diffuse: { uuid: "rtt0", dataTexture: { data: dataFs32, width, height }, format: "rgba16float", generateMipmaps: true }
		};

		let entity = new FixScreenPlaneEntity({ extent: [-0.8, -0.8, 0.8, 0.8], textures: [tex] });
		entity.color = [0.1, 0.1, 0.1, 0.1];
		rc.addEntity(entity);
	}

	private applyRGBA8Tex(): void {
		let rc = this.mRscene;

		let width = 256;
		let height = 256;

		let dataU8 = new Uint8Array(width * height * 4);
		let k = 0;
		for (let i = 0; i < height; ++i) {
			for (let j = 0; j < width; ++j) {
				k = (width * i + j) * 4;
				dataU8[k] = ((j / width) * 255) | 0;
				dataU8[k + 1] = ((0.5 + 0.5 * Math.sin(10.0 * (1.0 - j / width))) * 255) | 0;
				dataU8[k + 2] = ((1.0 - (i * j) / (width * height)) * 255) | 0;
				dataU8[k + 3] = 255;
			}
		}

		let tex = {
			diffuse: { uuid: "rtt1", dataTexture: { data: dataU8, width, height }, format: "rgba8unorm", generateMipmaps: true }
		};

		let entity = new FixScreenPlaneEntity({ extent: [0.0, 0.0, 0.8, 0.8], textures: [tex] });
		rc.addEntity(entity);
	}
	private initScene(): void {
		this.applyRGBAFloat16Tex();
		this.applyRGBA8Tex();
	}

	run(): void {
		this.mRscene.run();
	}
}

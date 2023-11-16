import { RendererScene } from "../rscene/RendererScene";
import { FixScreenPlaneEntity } from "../entity/FixScreenPlaneEntity";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";
import { calculateMipLevels } from "../utils/CommonUtils";

import vertWGSL from "../material/shader/wgsl/fixScreenPlane.vert.wgsl";
import rgbTexWGSL from "./shaders/fixScreenPlaneRGBTex.frag.wgsl";

export class FloatTextureTest {
	private mRscene = new RendererScene();

	initialize(): void {
		console.log("FloatTextureTest::initialize() ...");
		let callback = (): void => {
			this.initScene();
			this.initAssets();
		};
		this.mRscene.initialize({ callback });

	}
	private initAssets(): void {
		let hdrBrnEnabled = false;
		let envMapUrl = "static/bytes/spe.mdf";
		if (hdrBrnEnabled) {
			envMapUrl = "static/bytes/spb.bin";
		}
		new HttpFileLoader().load(envMapUrl, (buf: ArrayBuffer, url: string): void => {
			console.log("buf: ", buf);
			this.buildFloatTex(hdrBrnEnabled, buf);
		});
	}
	private buildFloatTex(hdrBrnEnabled: boolean, buf: ArrayBuffer): void {
		if(hdrBrnEnabled) {
			this.parseHdrBrn( buf );
		}else {
			this.parseFloat( buf );
		}
	}
	private parseFloat(buffer: ArrayBuffer): void {

        let begin = 0;
        let width = 128;
        let height = 128;

        let component:number = 3;

        let fs32 = new Float32Array(buffer);
        let subArr: Float32Array;
		let mipLevelCount = calculateMipLevels( width, height );
		console.log("mipLevelCount: ", mipLevelCount);

        // let tex: IFloatCubeTexture = this.texture as IFloatCubeTexture;
        // tex.toRGBFormat();
        // tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        // tex.magFilter = TextureConst.LINEAR;

        for (let j = 0; j < mipLevelCount; j++) {
            for (let i = 0; i < 6; i++) {
                const size = width * height * component;
                subArr = fs32.subarray(begin, begin + size);
				if(i == 0) {
					console.log("width: ", width, ', subArr.length: ', subArr.length);
				}
                // tex.setDataFromBytesToFaceAt(i, subArr, width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
    private parseHdrBrn(buffer: ArrayBuffer): void {

        let data16 = new Uint16Array(buffer);
        let currBytes = new Uint8Array(buffer);
        let begin = 0;
        let width = data16[4];
        let height = data16[5];
        let mipMapMaxLv = data16[6];
        console.log("parseHdrBrn, width: ",width, "height: ",height,"mipMapMaxLv: ",mipMapMaxLv);
        let size = 0;
        let bytes = currBytes.subarray(32);
        // let tex: IBytesCubeTexture = this.texture as IBytesCubeTexture;
        // tex.mipmapEnabled = mipMapMaxLv <= 1;
        // tex.minFilter = TextureConst.LINEAR_MIPMAP_LINEAR;
        // tex.magFilter = TextureConst.LINEAR;
        for (let j = 0; j < mipMapMaxLv; j++) {
            for (let i = 0; i < 6; i++) {
                size = width * height * 4;
                // tex.setDataFromBytesToFaceAt(i, bytes.subarray(begin, begin + size), width, height, j);
                begin += size;
            }
            width >>= 1;
            height >>= 1;
        }
    }
	private applyRGBAFloat16Tex(): void {
		let rc = this.mRscene;

		let width = 256;
		let height = 256;

		let dataFs32 = new Float32Array(width * height * 4);
		let scale = 1.0;
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
			diffuse: { uuid: "tex0", dataTexture: { data: dataFs32, width, height }, format: "rgba16float", generateMipmaps: true }
		};

		let shaderSrc = {
			vert:{code: vertWGSL, uuid: 'vert'},
			frag:{code: rgbTexWGSL, uuid: 'frag'},
		}
		let entity = new FixScreenPlaneEntity({ shaderSrc, extent: [-0.8, -0.8, 0.8, 0.8], textures: [tex] });
		// entity.color = [0.1, 0.1, 0.1, 0.1];
		rc.addEntity(entity);
	}

	private initScene(): void {
		this.applyRGBAFloat16Tex();
	}

	run(): void {
		this.mRscene.run();
	}
}

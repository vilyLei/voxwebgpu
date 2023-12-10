import { TextureDataDescriptor, WGTextureDataDescriptor } from "../texture/WGTextureDataDescriptor";
import { HttpFileLoader } from "../asset/loader/HttpFileLoader";

class SpecularEnvBrnTexture implements WGTextureDataDescriptor {
	private mUrl = "static/bytes/spb.bin";
	private mLoadInit = true;
	constructor(url?: string) {
		if (url !== undefined && url !== "") {
			this.mUrl = url;
		}
	}
	specularEnv: TextureDataDescriptor = {
		uuid: "SpecularEnvBrnTexture",
		dataTexture: { datas: [] as Uint8Array[], width: 128, height: 128 },
		viewDimension: "cube",
		format: "rgba8unorm",
		generateMipmaps: false
	};
	set datas(datas: Uint8Array[]) {
		this.specularEnv.dataTexture.datas = datas;
	}
	set width(w: number) {
		this.specularEnv.dataTexture.width = w;
	}
	set height(h: number) {
		this.specularEnv.dataTexture.width = h;
	}
	load(url?: string): SpecularEnvBrnTexture {
		if (this.mLoadInit) {
			this.mLoadInit = false;
			if (!url) {
				url = this.mUrl;
			}
			this.specularEnv.uuid = "SpecularEnvBrnTexture-" + url;
			new HttpFileLoader().load(url, (buf: ArrayBuffer, url: string): void => {
				this.parse(buf);
			});
		}
		return this;
	}
	update(): void {
		this.load();
	}
	private parse(buffer: ArrayBuffer): void {
		let data16 = new Uint16Array(buffer);
		let currBytes = new Uint8Array(buffer);
		let begin = 0;
		let width = data16[4];
		let height = data16[5];
		let mipMapMaxLv = data16[6];
		// console.log("SpecularEnvBrnTexture, width: ", width, "height: ", height, "mipMapMaxLv: ", mipMapMaxLv);
		let size = 0;
		let bytes = currBytes.subarray(32);
		let dataU8: Uint8Array;
		let datas: Uint8Array[] = [];

		let tex = this.specularEnv.dataTexture;
		tex.width = width;
		tex.height = height;

		let currW = width;
		let currH = height;
		for (let j = 0; j < mipMapMaxLv; j++) {
			for (let i = 0; i < 6; i++) {
				size = currW * currW * 4;
				// console.log("parseMultiHdrBrn, j: ", j, ", currW: ", currW, ", currH: ", currH);
				dataU8 = bytes.subarray(begin, begin + size);
				datas.push(dataU8);
				begin += size;
			}
			currW >>= 1;
			currH >>= 1;
		}
		tex.datas = datas;
	}
}
export { SpecularEnvBrnTexture };

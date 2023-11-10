import { GeomDataBuilder } from "../geometry/GeomDataBuilder";

import vertWGSL from "./shaders/vertEntityOnlyVtx.vert.wgsl";
import fragWGSL from "./shaders/vertEntityOnlyVtx.frag.wgsl";

import { WGMaterial } from "../material/WGMaterial";
import { WGGeometry } from "../geometry/WGGeometry";
import { Entity3D } from "../entity/Entity3D";
import { WGRenderer } from "../rscene/WGRenderer";

export class VertColorCube {

	geomData = new GeomDataBuilder();
	renderer = new WGRenderer();

	initialize(): void {
		console.log("VertColorCube::initialize() ...");

		const renderer = this.renderer;
		const rgd = this.geomData.createCube(200);

		const shaderCodeSrc = {
			vert: { code: vertWGSL },
			frag: { code: fragWGSL }
		};

		const materials = [new WGMaterial({
			shadinguuid: "shapeMaterial",
			shaderCodeSrc
		})];

		const geometry = new WGGeometry()
			.addAttribute({ position: rgd.vs })
			.setIndices( rgd.ivs );

		renderer.addEntity( new Entity3D({geometry, materials}) );
	}

	run(): void {
		this.renderer.run();
	}
}

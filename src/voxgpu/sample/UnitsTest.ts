import { VertColorTriangle } from "./VertColorTriangle";
import { VertColorCube } from "./VertColorCube";
import { VertEntityTest } from "./VertEntityTest";
import { DefaultEntityTest } from "./DefaultEntityTest";
import { ImgTexturedCube } from "./ImgTexturedCube";
import { ImgCubeMap } from "./ImgCubeMap";
import { MultiTexturedCube } from "./MultiTexturedCube";
import { BlendTest } from "./BlendTest";
import { MultiMaterialPass } from "./MultiMaterialPass";
import { MultiUniformTest } from "./MultiUniformTest";
import { UniformTest } from "./UniformTest";
import { StorageTest } from "./StorageTest";

import { RSceneTest } from "./RSceneTest";
import { SimpleLightTest } from "./SimpleLightTest";
import { REntity3DContainerTest } from "./REntity3DContainerTest";

function mainFunc(demoIns: any): void {
	demoIns.initialize();
	function mainLoop(now: any): void {
		demoIns.run();
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
}

export class UnitsTest {

	initialize(): void {
		console.log("DataDrivenTest::initialize() ...");
		let ns = 'SimpleLightTest';
		switch(ns) {
			case 'VertColorTriangle':
				mainFunc( new VertColorTriangle() );
				break;
			case 'VertColorCube':
				mainFunc( new VertColorCube() );
				break;
			case 'VertEntityTest':
				mainFunc( new VertEntityTest() );
				break;
			case 'DefaultEntityTest':
				mainFunc( new DefaultEntityTest() );
				break;
			case 'ImgTexturedCube':
				mainFunc( new ImgTexturedCube() );
				break;
			case 'ImgCubeMap':
				mainFunc( new ImgCubeMap() );
				break;
			case 'MultiTexturedCube':
				mainFunc( new MultiTexturedCube() );
				break;
			case 'BlendTest':
				mainFunc( new BlendTest() );
				break;
			case 'BlendTest':
				mainFunc( new BlendTest() );
				break;
			case 'MultiMaterialPass':
				mainFunc( new MultiMaterialPass() );
				break;
			case 'MultiUniformTest':
				mainFunc( new MultiUniformTest() );
				break;
			case 'UniformTest':
				mainFunc( new UniformTest() );
				break;
			case 'StorageTest':
				mainFunc( new StorageTest() );
				break;
			case 'RSceneTest':
				mainFunc( new RSceneTest() );
				break;
			case 'SimpleLightTest':
				mainFunc( new SimpleLightTest() );
				break;
			case 'REntity3DContainerTest':
				mainFunc( new REntity3DContainerTest() );
				break;
			default:
				break;

		}
	}
}

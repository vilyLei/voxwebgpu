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

import { Entity3DVisibilityTest } from "./Entity3DVisibilityTest";
import { RSceneEntityManagement } from "./RSceneEntityManagement";
import { SimplePBRTest } from "./SimplePBRTest";
import { FixScreenPlaneTest } from "./FixScreenPlaneTest";
import { PrimitiveEntityTest } from "./PrimitiveEntityTest";
import { ScreenPostEffect } from "./ScreenPostEffect";

import { ModelLoadTest } from "./ModelLoadTest";
import { DrawInstanceTest } from "./DrawInstanceTest";
import { ComputeEntityTest } from "./ComputeEntityTest";
import { GameOfLifeTest } from "./GameOfLifeTest";
import { ComputeMaterialTest } from "./ComputeMaterialTest";
import { GameOfLifeMultiMaterialPass } from "./GameOfLifeMultiMaterialPass";

import { GameOfLifePretty } from "./GameOfLifePretty";
import { GameOfLifeSphere } from "./GameOfLifeSphere";
import { GameOfLifeSpherePBR } from "./GameOfLifeSpherePBR";
import { GameOfLife3DPBR } from "./GameOfLife3DPBR";
import { MultiGPUPassTest } from "./MultiGPUPassTest";
import { RTTFixScreenTest } from "./RTTFixScreenTest";
import { RTTTest } from "./RTTTest";

import { AddEntityIntoMultiRPasses } from "./AddEntityIntoMultiRPasses";
import { PassNodeGraphTest } from "./PassNodeGraphTest";
import { ColorAttachmentReplace } from "./ColorAttachmentReplace";
import { PingpongBlur } from "./PingpongBlur";
import { FloatRTT } from "./FloatRTT";
import { MRT } from "./MRT";
import { DepthBlur } from "./DepthBlur";

import { LineEntityTest } from "./LineEntityTest";
import { LineObjectTest } from "./LineObjectTest";
import { WireframeEntityTest } from "./WireframeEntityTest";
import { EntityCloneTest } from "./EntityCloneTest";
import { ModelEntityTest } from "./ModelEntityTest";

import { DataDrivenTest } from "./DataDrivenTest";
import { DataTextureTest } from "./DataTextureTest";
import { FloatTextureTest } from "./FloatTextureTest";
import { Set32BitsTexMipmapData } from "./Set32BitsTexMipmapData";



const demoNames = [
	'VertColorTriangle',
	'VertColorCube',
	'VertEntityTest',
	'DefaultEntityTest',
	'ImgTexturedCube',
	'ImgCubeMap',
	'MultiTexturedCube',
	'BlendTest',
	'MultiMaterialPass',
	'MultiUniformTest',
	'UniformTest',
	'StorageTest',

	'RSceneTest',
	'SimpleLightTest',
	'REntity3DContainerTest',

	'Entity3DVisibilityTest',
	'RSceneEntityManagement',
	'SimplePBRTest',
	'FixScreenPlaneTest',
	'PrimitiveEntityTest',
	'ScreenPostEffect',

	'ModelLoadTest',
	'DrawInstanceTest',
	'ComputeEntityTest',
	'GameOfLifeTest',
	'ComputeMaterialTest',
	'GameOfLifeMultiMaterialPass',

	'GameOfLifePretty',
	'GameOfLifeSphere',
	'GameOfLifeSpherePBR',
	'GameOfLife3DPBR',
	'MultiGPUPassTest',
	'RTTFixScreenTest',
	'RTTTest',

	'AddEntityIntoMultiRPasses',
	'PassNodeGraphTest',
	'ColorAttachmentReplace',
	'PingpongBlur',
	'FloatRTT',
	'MRT',
	'DepthBlur',

	'LineEntityTest',
	'LineObjectTest',
	'WireframeEntityTest',
	'EntityCloneTest',
	'ModelEntityTest',

	'DataDrivenTest',
	'DataTextureTest',
	'FloatTextureTest',
	'Set32BitsTexMipmapData',
];

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

		let ns = 'SimpleLightTest';
		switch (ns) {
			case 'VertColorTriangle':
				mainFunc(new VertColorTriangle());
				break;
			case 'VertColorCube':
				mainFunc(new VertColorCube());
				break;
			case 'VertEntityTest':
				mainFunc(new VertEntityTest());
				break;
			case 'DefaultEntityTest':
				mainFunc(new DefaultEntityTest());
				break;
			case 'ImgTexturedCube':
				mainFunc(new ImgTexturedCube());
				break;
			case 'ImgCubeMap':
				mainFunc(new ImgCubeMap());
				break;
			case 'MultiTexturedCube':
				mainFunc(new MultiTexturedCube());
				break;
			case 'BlendTest':
				mainFunc(new BlendTest());
				break;
			case 'BlendTest':
				mainFunc(new BlendTest());
				break;
			case 'MultiMaterialPass':
				mainFunc(new MultiMaterialPass());
				break;
			case 'MultiUniformTest':
				mainFunc(new MultiUniformTest());
				break;
			case 'UniformTest':
				mainFunc(new UniformTest());
				break;
			case 'StorageTest':
				mainFunc(new StorageTest());
				break;
			case 'RSceneTest':
				mainFunc(new RSceneTest());
				break;
			case 'SimpleLightTest':
				mainFunc(new SimpleLightTest());
				break;
			case 'REntity3DContainerTest':
				mainFunc(new REntity3DContainerTest());
				break;

			case 'Entity3DVisibilityTest':
				mainFunc(new Entity3DVisibilityTest());
				break;
			case 'RSceneEntityManagement':
				mainFunc(new RSceneEntityManagement());
				break;
			case 'SimplePBRTest':
				mainFunc(new SimplePBRTest());
				break;
			case 'FixScreenPlaneTest':
				mainFunc(new FixScreenPlaneTest());
				break;
			case 'PrimitiveEntityTest':
				mainFunc(new PrimitiveEntityTest());
				break;
			case 'ScreenPostEffect':
				mainFunc(new ScreenPostEffect());
				break;
			
			case 'ModelLoadTest':
				mainFunc(new ModelLoadTest());
				break;
			case 'DrawInstanceTest':
				mainFunc(new DrawInstanceTest());
				break;
			case 'ComputeEntityTest':
				mainFunc(new ComputeEntityTest());
				break;
			case 'GameOfLifeTest':
				mainFunc(new GameOfLifeTest());
				break;
			case 'ComputeMaterialTest':
				mainFunc(new ComputeMaterialTest());
				break;
			case 'GameOfLifeMultiMaterialPass':
				mainFunc(new GameOfLifeMultiMaterialPass());
				break;
			
			case 'GameOfLifePretty':
				mainFunc(new GameOfLifePretty());
				break;
			case 'GameOfLifeSphere':
				mainFunc(new GameOfLifeSphere());
				break;
			case 'GameOfLifeSpherePBR':
				mainFunc(new GameOfLifeSpherePBR());
				break;
			case 'GameOfLife3DPBR':
				mainFunc(new GameOfLife3DPBR());
				break;
			case 'MultiGPUPassTest':
				mainFunc(new MultiGPUPassTest());
				break;
			case 'RTTFixScreenTest':
				mainFunc(new RTTFixScreenTest());
				break;
			case 'RTTTest':
				mainFunc(new RTTTest());
				break;
			case 'AddEntityIntoMultiRPasses':
				mainFunc(new AddEntityIntoMultiRPasses());
				break;
			case 'PassNodeGraphTest':
				mainFunc(new PassNodeGraphTest());
				break;
			case 'ColorAttachmentReplace':
				mainFunc(new ColorAttachmentReplace());
				break;
			case 'PingpongBlur':
				mainFunc(new PingpongBlur());
				break;
			case 'FloatRTT':
				mainFunc(new FloatRTT());
				break;
			case 'MRT':
				mainFunc(new MRT());
				break;
			case 'DepthBlur':
				mainFunc(new DepthBlur());
				break;
				
			case 'LineEntityTest':
				mainFunc(new LineEntityTest());
				break;			
			case 'LineObjectTest':
				mainFunc(new LineObjectTest());
				break;
			case 'WireframeEntityTest':
				mainFunc(new WireframeEntityTest());
				break;
			case 'EntityCloneTest':
				mainFunc(new EntityCloneTest());
				break;
			case 'ModelEntityTest':
				mainFunc(new ModelEntityTest());
				break;
			
			case 'DataDrivenTest':
				mainFunc(new DataDrivenTest());
				break;
			case 'DataTextureTest':
				mainFunc(new DataTextureTest());
				break;
			case 'FloatTextureTest':
				mainFunc(new FloatTextureTest());
				break;
			case 'Set32BitsTexMipmapData':
				mainFunc(new Set32BitsTexMipmapData());
				break;
			default:
				break;

		}
	}
}

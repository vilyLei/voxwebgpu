import { VertColorTriangle } from "../../voxgpu/sample/VertColorTriangle";
import { VertColorCube } from "../../voxgpu/sample/VertColorCube";
import { VertEntityTest } from "../../voxgpu/sample/VertEntityTest";
import { DefaultEntityTest } from "../../voxgpu/sample/DefaultEntityTest";
import { ImgTexturedCube } from "../../voxgpu/sample/ImgTexturedCube";
import { ImgCubeMap } from "../../voxgpu/sample/ImgCubeMap";
import { MultiTexturedCube } from "../../voxgpu/sample/MultiTexturedCube";
import { BlendTest } from "../../voxgpu/sample/BlendTest";
import { MultiMaterialPass } from "../../voxgpu/sample/MultiMaterialPass";
import { MultiUniformTest } from "../../voxgpu/sample/MultiUniformTest";
import { UniformTest } from "../../voxgpu/sample/UniformTest";
import { StorageTest } from "../../voxgpu/sample/StorageTest";

import { RSceneTest } from "../../voxgpu/sample/RSceneTest";
import { SimpleLightTest } from "../../voxgpu/sample/SimpleLightTest";
import { REntity3DContainerTest } from "../../voxgpu/sample/REntity3DContainerTest";

import { Entity3DVisibilityTest } from "../../voxgpu/sample/Entity3DVisibilityTest";
import { RSceneEntityManagement } from "../../voxgpu/sample/RSceneEntityManagement";
import { SimplePBRTest } from "../../voxgpu/sample/SimplePBRTest";
import { FixScreenPlaneTest } from "../../voxgpu/sample/FixScreenPlaneTest";
import { PrimitiveEntityTest } from "../../voxgpu/sample/PrimitiveEntityTest";
import { ScreenPostEffect } from "../../voxgpu/sample/ScreenPostEffect";

import { ModelLoadTest } from "../../voxgpu/sample/ModelLoadTest";
import { DrawInstanceTest } from "../../voxgpu/sample/DrawInstanceTest";
import { ComputeEntityTest } from "../../voxgpu/sample/ComputeEntityTest";
import { GameOfLifeTest } from "../../voxgpu/sample/GameOfLifeTest";
import { ComputeMaterialTest } from "../../voxgpu/sample/ComputeMaterialTest";
import { GameOfLifeMultiMaterialPass } from "../../voxgpu/sample/GameOfLifeMultiMaterialPass";

import { GameOfLifePretty } from "../../voxgpu/sample/GameOfLifePretty";
import { GameOfLifeSphere } from "../../voxgpu/sample/GameOfLifeSphere";
import { GameOfLifeSpherePBR } from "../../voxgpu/sample/GameOfLifeSpherePBR";
import { GameOfLife3DPBR } from "../../voxgpu/sample/GameOfLife3DPBR";
import { MultiGPUPassTest } from "../../voxgpu/sample/MultiGPUPassTest";
import { RTTFixScreenTest } from "../../voxgpu/sample/RTTFixScreenTest";
import { RTTTest } from "../../voxgpu/sample/RTTTest";

import { AddEntityIntoMultiRPasses } from "../../voxgpu/sample/AddEntityIntoMultiRPasses";
import { PassNodeGraphTest } from "../../voxgpu/sample/PassNodeGraphTest";
import { ColorAttachmentReplace } from "../../voxgpu/sample/ColorAttachmentReplace";
import { PingpongBlur } from "../../voxgpu/sample/PingpongBlur";
import { FloatRTT } from "../../voxgpu/sample/FloatRTT";
import { MRT } from "../../voxgpu/sample/MRT";
import { DepthBlur } from "../../voxgpu/sample/DepthBlur";

import { LineEntityTest } from "../../voxgpu/sample/LineEntityTest";
import { LineObjectTest } from "../../voxgpu/sample/LineObjectTest";
import { WireframeEntityTest } from "../../voxgpu/sample/WireframeEntityTest";
import { EntityCloneTest } from "../../voxgpu/sample/EntityCloneTest";
import { ModelEntityTest } from "../../voxgpu/sample/ModelEntityTest";

import { DataDrivenTest } from "../../voxgpu/sample/DataDrivenTest";
import { DataTextureTest } from "../../voxgpu/sample/DataTextureTest";
import { FloatTextureTest } from "../../voxgpu/sample/FloatTextureTest";
import { Set32BitsTexMipmapData } from "../../voxgpu/sample/Set32BitsTexMipmapData";


import { UnitsTestMana } from './manage/manager';
import { UISystem } from "./ui/UISystem";


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
	private mMana = new UnitsTestMana(demoNames);
	private mUISys = new UISystem();

	initialize(): void {
		//
		let href = window.location.href;
		let k = href.indexOf('?');
		let demoName = '';
		if (k > 0) {
			href = href.slice(k + 1);
			let hrefs = href.split('&');
			console.log('hrefs: ', hrefs);
			if (hrefs && hrefs.length > 0) {
				for (let i = 0; i < hrefs.length; ++i) {
					const str = hrefs[i];
					if(str) {
						const items = str.split('=');
						if(items.length == 2) {
							if(items[0] == 'webgpudemounit') {
								demoName = items[1].toLocaleLowerCase();
							}
						}
					}
				}
			}
		}
		console.log('href: ', href);
		//
		let index = this.mMana.getIndex();
		let ns = 'MRT';
		if(demoName.length > 0) {
			let ls = new Array(demoNames.length);
			for(let i = 0; i < ls.length; ++i) {
				ls[i] = demoNames[i].toLocaleLowerCase();
			}
			let i = ls.indexOf(demoName);
			if(i >= 0) {
				index = i;
			}
		}
		console.log("######## index: ", index, ", demoName: ", demoName);
		ns = demoNames[index];

		let param = { name: ns, index, demoNames };
		this.mUISys.mana = this.mMana;
		this.mUISys.initialize(param);

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

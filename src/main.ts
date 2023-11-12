//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WebGPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

// import { VertColorTriangle as Demo } from "./voxgpu/sample/VertColorTriangle";
// import { VertColorCube as Demo } from "./voxgpu/sample/VertColorCube";
// import { VertEntityTest as Demo } from "./voxgpu/sample/VertEntityTest";

// import { DefaultEntityTest as Demo } from "./voxgpu/sample/DefaultEntityTest";
// import { ImgTexturedCube as Demo } from "./voxgpu/sample/ImgTexturedCube";
// import { ImgCubeMap as Demo } from "./voxgpu/sample/ImgCubeMap";

// import { MultiTexturedCube as Demo } from "./voxgpu/sample/MultiTexturedCube";
// import { BlendTest as Demo } from "./voxgpu/sample/BlendTest";
// import { MultiMaterialPass as Demo } from "./voxgpu/sample/MultiMaterialPass";

// import { MultiUniformTest as Demo } from "./voxgpu/sample/MultiUniformTest";
// import { UniformTest as Demo } from "./voxgpu/sample/UniformTest";
// import { StorageTest as Demo } from "./voxgpu/sample/StorageTest";

// import { RSceneTest as Demo } from "./voxgpu/sample/RSceneTest";
// import { SimpleLightTest as Demo } from "./voxgpu/sample/SimpleLightTest";
// import { REntity3DContainerTest as Demo } from "./voxgpu/sample/REntity3DContainerTest";

// import { Entity3DVisibilityTest as Demo } from "./voxgpu/sample/Entity3DVisibilityTest";
// import { RSceneEntityManagement as Demo } from "./voxgpu/sample/RSceneEntityManagement";
// import { SimplePBRTest as Demo } from "./voxgpu/sample/SimplePBRTest";
// import { FixScreenPlaneTest as Demo } from "./voxgpu/sample/FixScreenPlaneTest";
// import { PrimitiveEntityTest as Demo } from "./voxgpu/sample/PrimitiveEntityTest";

// import { ScreenPostEffect as Demo } from "./voxgpu/sample/ScreenPostEffect";
// import { ModelLoadTest as Demo } from "./voxgpu/sample/ModelLoadTest";
// import { DrawInstanceTest as Demo } from "./voxgpu/sample/DrawInstanceTest";

// import { ComputeEntityTest as Demo } from "./voxgpu/sample/ComputeEntityTest";
// import { GameOfLifeTest as Demo } from "./voxgpu/sample/GameOfLifeTest";
// import { ComputeMaterialTest as Demo } from "./voxgpu/sample/ComputeMaterialTest";
// import { GameOfLifeMultiMaterialPass as Demo } from "./voxgpu/sample/GameOfLifeMultiMaterialPass";
// import { GameOfLifePretty as Demo } from "./voxgpu/sample/GameOfLifePretty";
// import { GameOfLifeSphere as Demo } from "./voxgpu/sample/GameOfLifeSphere";
// import { GameOfLifeSpherePBR as Demo } from "./voxgpu/sample/GameOfLifeSpherePBR";
// import { GameOfLife3DPBR as Demo } from "./voxgpu/sample/GameOfLife3DPBR";

// import { MultiGPUPassTest as Demo } from "./voxgpu/sample/MultiGPUPassTest";
// import { RTTFixScreenTest as Demo } from "./voxgpu/sample/RTTFixScreenTest";
// import { AddEntityIntoMultiRPasses as Demo } from "./voxgpu/sample/AddEntityIntoMultiRPasses";
import { PassNodeGraphTest as Demo } from "./voxgpu/sample/PassNodeGraphTest";
// import { RTTTest as Demo } from "./voxgpu/sample/RTTTest";


let demoIns = new Demo();
function main(): void {
	console.log("------ demo --- init ------");
	demoIns.initialize();
	function mainLoop(now: any): void {
		demoIns.run();
		window.requestAnimationFrame(mainLoop);
	}
	window.requestAnimationFrame(mainLoop);
	console.log("------ demo --- running ------");
}
main();

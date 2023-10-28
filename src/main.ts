//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////           WEB-GPU               /////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


// import { VertColorTriangle as Demo } from "./voxgpu/sample/VertColorTriangle";
// import { VertColorCube as Demo } from "./voxgpu/sample/VertColorCube";
// import { ImgTexturedCube as Demo } from "./voxgpu/sample/ImgTexturedCube";
// import { ImgCubeMap as Demo } from "./voxgpu/sample/ImgCubeMap";

// import { MultiTexturedCube as Demo } from "./voxgpu/sample/MultiTexturedCube";
// import { BlendTest as Demo } from "./voxgpu/sample/BlendTest";
// import { MultiMaterialPass as Demo } from "./voxgpu/sample/MultiMaterialPass";

import { StorageTest as Demo } from "./voxgpu/sample/StorageTest";

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

import { VertColorTriangle } from "./VertColorTriangle";

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
		let ns = 'VertColorTriangle';
		switch(ns) {
			case 'VertColorTriangle':
				mainFunc( new VertColorTriangle() );
				break;
			default:
				break;

		}
	}
}

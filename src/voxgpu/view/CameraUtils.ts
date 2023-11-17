import Vector3 from "../math/Vector3";
import { IRenderCamera } from "../render/IRenderCamera";
import { WGCameraParam } from "../rscene/WGRendererParam";

function initializeCamera(param: WGCameraParam, cam: IRenderCamera): IRenderCamera {

	let p = param;
	if (!p) p = {};

	let eye = p.eye ? new Vector3().toZero().setVector3(p.eye) : new Vector3(1100.0, 1100.0, 1100.0);
	let up = p.up ? new Vector3().toZero().setVector3(p.up) : new Vector3(0, 1, 0);
	let origin = p.origin ? new Vector3().toZero().setVector3(p.origin) : new Vector3();

	if (p.fovDegree === undefined) p.fovDegree = 45;
	if (p.near === undefined) p.near = 0.1;
	if (p.far === undefined) p.far = 8000;
	if (p.viewWidth === undefined) p.viewWidth = 512;
	if (p.viewHeight === undefined) p.viewHeight = 512;
	if (p.viewX === undefined) p.viewX = 0;
	if (p.viewY === undefined) p.viewY = 0;

	p.perspective = (p.perspective === false || Number(p.perspective) === 0) ? false : true;

	const width = p.viewWidth;
	const height = p.viewHeight;

	if (p.perspective) {
		cam.perspectiveRH((Math.PI * p.fovDegree) / 180.0, width / height, p.near, p.far);
	} else {
		cam.inversePerspectiveZ = true;
		cam.orthoRH(p.near, p.far, -0.5 * height, 0.5 * height, -0.5 * width, 0.5 * width);
	}
	cam.lookAtRH(eye, origin, up);
	cam.setViewXY(p.viewX, p.viewY);
	cam.setViewSize(width, height);
	cam.update();

	return cam;
}
export { initializeCamera };

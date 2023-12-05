import Extent2 from "../../cgeom/Extent2";

export class WGRPassViewport {
	extent = new Extent2([0, 0, 512, 512]);
	minDepth = 0;
	maxDepth = 1;
}
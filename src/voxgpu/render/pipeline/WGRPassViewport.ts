import Extent2 from "../../cgeom/Extent2";

export class WGRPassViewport {
	extent = new Extent2([0, 0, 512, 512]);
	minDepth = 0;
	maxDepth = 1;
	constructor(vp?: ViewportDataType) {
		if(vp) {
			this.setViewport(vp);
		}
	}
	setViewport(vp: ViewportDataType): void {
		if(vp) {
			this.extent.setExtent(vp.extent);
			let ls = vp.depths;
			if(ls) {
				if(ls.length > 0) {
					this.minDepth = ls[0];
				}
				if(ls.length > 1) {
					this.maxDepth = ls[1];
				}
			}
			if(vp.minDepth !== undefined){
				this.minDepth = vp.minDepth;
			}
			if(vp.maxDepth !== undefined){
				this.maxDepth = vp.maxDepth;
			}
		}
	}
}
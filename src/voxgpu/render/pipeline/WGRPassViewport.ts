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
			this.extent.setExtent(vp);
			let ls = vp as number[];
			let minI = 4;
			let maxI = 5;
			if(ls.length === undefined) {
				let p = vp as ViewportDataParamType;
				this.extent.setExtent(p.extent);
				ls = p.depths;
				minI = 0;
				maxI = 1;
				if(p.x !== undefined){
					this.minDepth = p.minDepth;
				}
				if(p.minDepth !== undefined){
					this.minDepth = p.minDepth;
				}
				if(p.maxDepth !== undefined){
					this.maxDepth = p.maxDepth;
				}
			}
			
			if(ls) {
				if(ls.length > minI) {
					this.minDepth = ls[minI];
				}
				if(ls.length > maxI) {
					this.maxDepth = ls[maxI];
				}
			}
		}
	}
}
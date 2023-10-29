/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderStage3D from "../../render/IRenderStage3D";
import RViewElement from "./RViewElement";
import ContextMouseEvtDispatcher from "./ContextMouseEvtDispatcher";

class RAdapterContext {

	private mSysEvt = new ContextMouseEvtDispatcher();
	private mDiv: HTMLDivElement = null;
	private mCanvas: HTMLCanvasElement = null;
	private m_offcanvas: HTMLCanvasElement = null;
	private mStage: IRenderStage3D = null;

	private m_dpr = 1.0;

	private m_viewEle = new RViewElement();

	constructor() { }

	getDiv(): HTMLDivElement {
		return this.mDiv;
	}
	getCanvas(): HTMLCanvasElement {
		return this.m_offcanvas ? this.m_offcanvas : this.mCanvas;
	}
	setDivStyleLeftAndTop(px: number, py: number): void {
		this.m_viewEle.setDivStyleLeftAndTop(px, py);
	}
	setDivStyleSize(pw: number, ph: number): void {
		this.m_viewEle.setDivStyleSize(pw, ph);
	}
	private m_resizeFlag = true;
	initialize(param: {stage: IRenderStage3D, canvas: HTMLCanvasElement, div: HTMLDivElement}): void {
		this.mStage = param.stage;
		this.mDiv = param.div;
		this.m_viewEle.setDiv(param.div);
		this.setCanvas(param.canvas);
	}
	private setCanvas(canvas: HTMLCanvasElement): boolean {
		let c0 = this.mCanvas;
		this.m_viewEle.setCanvas(canvas);
		let c1 = this.m_viewEle.getCanvas();
		if (c0 != c1) {
			this.m_offcanvas = null;
			this.mCanvas = c1;

			this.initEvt();
		}
		return c0 != c1;
	}
	private initEvt(): void {
		this.mSysEvt.initialize(this.mCanvas, this.mDiv, this.mStage);
	}
	getStage(): IRenderStage3D {
		return this.mStage;
	}
	getStageWidth(): number {
		return this.mStage.stageWidth;
	}
	getStageHeight(): number {
		return this.mStage.stageHeight;
	}
}
export { RAdapterContext };

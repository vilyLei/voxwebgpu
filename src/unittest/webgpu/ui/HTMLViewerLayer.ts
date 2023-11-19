import { DivTool } from "../utils/HtmlDivUtils";

class HTMLViewerLayer {
	protected m_viewer: HTMLDivElement | HTMLCanvasElement;
	protected mStyle: CSSStyleDeclaration;
	// protected m_rect = new AABB2D();
	unit = "px";
	constructor(viewer: HTMLDivElement | HTMLCanvasElement = null) {
		this.m_viewer = viewer;
		if (viewer) {
			this.mStyle = viewer.style;
		}
	}
	getDiv(): HTMLDivElement {
		return this.m_viewer as HTMLDivElement;
	}
	getStyle(): CSSStyleDeclaration {
		return this.m_viewer.style;
	}
	setViewer(viewer: HTMLDivElement | HTMLCanvasElement): void {
		this.m_viewer = viewer;
		if (viewer) {
			this.mStyle = viewer.style;
		}
	}
	setInnerHTML(html: string): void {
		(this.m_viewer as HTMLDivElement).innerHTML = html;
	}
	clearInnerHTML(): void {
		(this.m_viewer as HTMLDivElement).innerHTML = "";
	}
	setDisplayMode(display = "block"): void {
		if (display != "") {
			this.mStyle.display = display;
		}
	}
	setPositionMode(position = "relative"): void {
		if (position != "") {
			this.mStyle.position = position;
		}
	}
	setTextSize(fontSize: string): void {
		this.mStyle.fontSize = fontSize;
	}
	setTextAlign(align: string): void {
		this.mStyle.textAlign = align;
	}
	contentAlignToCenter(): void {
		let s = this.mStyle;
		s.textAlign = "center";
		s.alignItems = "center";
		s.justifyContent = "center";
	}
	layoutToCenter(offsetX: number = 0, offsetY: number = 0): void {
		let rect = this.m_viewer.getBoundingClientRect();
		let parent_rect = this.m_viewer.parentElement.getBoundingClientRect();
		console.log("layoutToCenter(), rect: ", rect);
		console.log("layoutToCenter(), parent_rect: ", parent_rect);
		let px = (parent_rect.width - rect.width) * 0.5 + offsetX;
		let py = (parent_rect.height - rect.height) * 0.5 + offsetY;
		this.setXY(px, py);
	}
	setXY(px: number, py: number): void {
		// this.m_rect.x = px;
		// this.m_rect.y = py;
		this.mStyle.left = px + this.unit;
		this.mStyle.top = py + this.unit;
	}

	setX(px: number): void {
		// this.m_rect.x = px;
		this.mStyle.left = px + this.unit;
	}
	setY(py: number): void {
		// this.m_rect.y = py;
		this.mStyle.top = py + this.unit;
	}
	setSize(pw: number, ph: number): void {
		if (pw > 0 && ph > 0) {
			// this.m_rect.width = pw;
			// this.m_rect.height = ph;
			this.mStyle.width = pw + this.unit;
			this.mStyle.height = ph + this.unit;
		}
	}
	setWidth(pw: number): void {
		if (pw > 0) {
			// this.m_rect.width = pw;
			this.mStyle.width = pw + this.unit;
		}
	}
	setHeight(ph: number): void {
		if (ph > 0) {
			// this.m_rect.height = ph;
			this.mStyle.height = ph + this.unit;
		}
	}
	uint24ToHtmlColor(uint24: number): string {
		let color = uint24.toString(16);
		let len = 6 - color.length;
		for(let i = 0; i < len; ++i) {
			color = '0'+color;
		}
		color = '#' + color;
		return color;
	}
	setTextColor(uint24: number, alpha = 1.0): void {
		this.mStyle.color = this.uint24ToHtmlColor(uint24);
	}
	setBackgroundColor(uint24: number, alpha = 1.0): void {
		
		this.mStyle.backgroundColor = this.uint24ToHtmlColor(uint24);
	}
	setVisible(v: boolean): void {
		DivTool.setVisible(this.m_viewer as HTMLDivElement, v);
	}
	isVisible(): boolean {
		return DivTool.isVisible(this.m_viewer as HTMLDivElement);
	}
	show(): void {
		this.setVisible(true);
	}
	hide(): void {
		this.setVisible(false);
	}
	clearDivAllEles(): void {
		DivTool.clearDivAllEles(this.m_viewer as HTMLDivElement);
	}
	getRect(): DOMRect {
		return (this.m_viewer as HTMLDivElement).getBoundingClientRect() as DOMRect;
	}
}
export { HTMLViewerLayer };

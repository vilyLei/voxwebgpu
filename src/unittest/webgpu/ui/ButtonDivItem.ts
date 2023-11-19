import { HTMLViewerLayer } from "./HTMLViewerLayer";

class ButtonDivItem extends HTMLViewerLayer {
	private mBtnName = "";
	private mBtnIdns = "";
	private mSelected = false;
	private mSelectColors = [0xbdd9e1, 0xaed4df, 0x83c4d7];
	private mDeselectColors = [0x7aacda, 0x4a93d5, 0x3b7bb5];
	group: ButtonDivItem[] = null;
	onmousedown: (evt: any) => void = null;
	onmouseup: (evt: any) => void = null;
	constructor() {super();}
	initialize(viewerLayer: HTMLDivElement, btn_name: string, btn_idns: string): void {

		console.log("ButtonDivItem::initialize()......");
		let style = viewerLayer.style;
		style.cursor = "pointer";
		style.userSelect = "none";
		// style.color = "#eeeeee";
		this.setViewer(viewerLayer);

		this.mBtnName = btn_name;
		this.mBtnIdns = btn_idns;
		viewerLayer.innerHTML = btn_name;
		this.initEvent(viewerLayer);
		this.applyColorAt(0);
	}
	toRoundedRectangleStyle(style: CSSStyleDeclaration = null): void {
		if(!style) {
			style = this.getStyle();
		}
		style.borderRadius = "10px"
		// style.outline = "10px solid #00ff"
		style.outline = "none"
		style.boxShadow = "0 0 0 5px #7aacda"
	}
	setSelectColors(colors: number[]): void {
		this.mSelectColors = colors;
	}
	setDeselectColors(colors: number[]): void {
		this.mDeselectColors = colors;
	}
	getName(): string {
		return this.mBtnName;
	}
	getIdns(): string {
		return this.mBtnIdns;
	}
	applyColorAt(i: number): void {
		let colors = this.mSelected ? this.mSelectColors : this.mDeselectColors;
		// this.m_viewerLayer.style.backgroundColor = "#" + colors[i].toString(16);
		this.setBackgroundColor(colors[i]);
	}
	private initEvent(viewerLayer: HTMLDivElement): void {
		viewerLayer.onmouseover = evt => {
			// console.log("mouse over, name: ", this.m_itemData.name);
			this.applyColorAt(1);
		};
		viewerLayer.onmouseout = evt => {
			// console.log("mouse out, name: ", this.m_itemData.name);
			this.applyColorAt(0);
		};
		viewerLayer.onmouseup = evt => {
			// console.log("mouse up, name: ", this.m_itemData.name);
			this.select();
			this.applyColorAt(1);
			if (this.onmouseup) {
				(evt as any).buttonTarget = this;
				(evt as any).button_idns = this.mBtnIdns;
				this.onmouseup(evt);
			}
		};
		viewerLayer.onmousedown = evt => {
			// console.log("mouse down, name: ", this.m_itemData.name);
			this.applyColorAt(2);
			if (this.onmousedown) {
				(evt as any).buttonTarget = this;
				(evt as any).button_idns = this.mBtnIdns;
				this.onmousedown(evt);
			}
		};
	}
	isSelected(): boolean {
		return this.mSelected;
	}
	select(): void {
		if (this.group != null) {
			let ls = this.group;
			let len = ls.length;
			for (let i = 0; i < len; ++i) {
				if (ls[i].isSelected()) {
					ls[i].deselect();
					break;
				}
			}
			this.mSelected = true;
			this.applyColorAt(0);
		} else {
			// this.mSelected = true;
		}
	}
	deselect(): void {
		if (this.group != null) {
			this.mSelected = false;
			this.applyColorAt(0);
		} else {
			// this.mSelected = false;
		}
	}
}
export { ButtonDivItem };

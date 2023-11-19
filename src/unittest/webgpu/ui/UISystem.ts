import { createDiv } from "../utils/util";

import { UnitsTestMana } from '../manage/manager';
import { ButtonDivItem } from "./ButtonDivItem";
import { DemoTagGroup } from "./DemoTagGroup";
import { DemoParam } from "./define";

export class UISystem {

	mana: UnitsTestMana;
	private mPrevBtn = new ButtonDivItem();
	private mNextBtn = new ButtonDivItem();
	private mTagGroup = new DemoTagGroup();
	constructor() {

	}
	private initEvent(): void {
		console.log('initEvent() ....');
		window.onkeydown = (evt: any): void => {
			console.log('evt: ', evt);
			switch(evt.key) {
				case 'ArrowLeft':
				case 'ArrowUp':
				case 'PageUp':
					this.toPrevDemo();
					break;
				case 'ArrowDown':
				case 'ArrowRight':
				case 'PageDown':
					this.toNextDemo();
					break;
				default:
					break;

			}
		}
	}
	private toPrevDemo(): void {
		this.mana.downIndex();
		window.location.reload();
	}
	private toNextDemo(): void {
		this.mana.upIndex();
		window.location.reload();
	}
	initialize(param: DemoParam): void {
		this.initDemoNameBar(param);
		let div = this.initTagGroupDiv(param);
		this.initEvent();
		this.mTagGroup.mana = this.mana;
		this.mTagGroup.initialize(div, param );

		// document.body.style.backgroundImage = `linear-gradient(to right bottom, #159957, #155799)`;
		document.body.style.background = `#333333`;
	}
	private initDemoNameBar(param: DemoParam): void {
		let div = createDiv(0, 513, 512, 37);
		document.body.appendChild(div);
		div.innerHTML = param.name + "(" + (param.index + 1) + "/" + param.demoNames.length + ")";
		let style = div.style;
		style.textAlign = 'center';
		style.backgroundColor = '#403b54';
		style.color = '#eeeeee';
		style.fontSize = "25px";
	}
	private initRightInfoNameBar(param: DemoParam): void {

		let btn = this.mPrevBtn;
		let div = createDiv(513, 513, 255, 37);
		document.body.appendChild(div);
		btn.setDeselectColors([0x008CBA, 0x0094D9, 0x00B4F4]);
		btn.initialize(div, 'Prev Demo', 'prevDemo');
		
		btn.setTextSize("25px");
		btn.setTextColor(0xffffff);
		btn.setTextAlign('center');
		btn.onmouseup = (): void => {
			this.toPrevDemo();
		}

		btn = this.mNextBtn;
		div = createDiv(513 + 257, 513, 255, 37);
		document.body.appendChild(div);
		btn.setDeselectColors([0x008CBA, 0x0094D9, 0x00B4F4]);
		btn.initialize(div, 'Next Demo', 'nextDemo');

		btn.setTextSize("25px");
		btn.setTextColor(0xffffff);
		btn.setTextAlign('center');
		btn.onmouseup = (): void => {
			this.toNextDemo();
		}
	}
	private initTagGroupDiv(param: DemoParam): HTMLDivElement {
		let div = createDiv(513, 0, 512, 512);
		document.body.appendChild(div);
		let style = div.style;
		style.backgroundColor = '#272637';
		this.initRightInfoNameBar(param);
		return div;
	}
}
export { DemoParam }
import { createDiv } from "../utils/util";
type DemoParam = {name: string, index: number, demoNames: string[]};
export class UISystem {

    constructor(){

    }
    initialize(param: DemoParam): void {
        this.initDemoNameBar(param);
        this.initRightLabeArea(param);
    }
    private initDemoNameBar(param: DemoParam): void {
        let div = createDiv(0, 513, 512, 37);
        document.body.appendChild(div);
		div.innerHTML = param.name + "("+ param.index + "/" + param.demoNames.length + ")";
		let style = div.style;
		style.textAlign = 'center';
		// style.backgroundColor = '#ffbe22';
		// style.backgroundColor = '#543094';
		// style.backgroundColor = '#706dce';
		style.backgroundColor = '#403b54';
		style.color = '#eeeeee';
		style.fontSize = "25px";
    }
    private initRightInfoNameBar(param: DemoParam): void {
        let div = createDiv(513, 513, 255, 37);
        document.body.appendChild(div);
		div.innerHTML = "Prev";
		let style = div.style;
		style.textAlign = 'center';
		style.backgroundColor = '#0b4741';
		style.color = '#eeeeee';
		style.fontSize = "25px";

        div = createDiv(513 + 257, 513, 255, 37);
        document.body.appendChild(div);
		div.innerHTML = "Next";
		 style = div.style;
		style.textAlign = 'center';
		style.backgroundColor = '#0b4741';
		style.color = '#eeeeee';
		style.fontSize = "25px";
    }
    private initRightLabeArea(param: DemoParam): void {
        let div = createDiv(513, 0, 512, 512);
        document.body.appendChild(div);
		// div.innerHTML = param.name + "("+ param.index + "/" + param.demoNames.length + ")";
		let style = div.style;
		// style.textAlign = 'center';
		// style.backgroundColor = '#ffbe22';
		// style.backgroundColor = '#543094';
		// style.backgroundColor = '#272637';
		style.backgroundColor = '#272637';
		// style.color = '#eeeeee';
		// style.fontSize = "25px";
        this.initRightInfoNameBar(param);
    }
}
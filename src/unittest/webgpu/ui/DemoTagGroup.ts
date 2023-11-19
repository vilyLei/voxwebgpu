
import { DemoTagArea, DemoParam } from "./define";
import { ButtonDivItem } from "./ButtonDivItem";
import { createDiv } from "../utils/util";
import Color4 from "../../../voxgpu/material/Color4";
import { UnitsTestMana } from '../manage/manager';

class DemoTagGroup {
	mana: UnitsTestMana;
    constructor() { }
    initialize(div: HTMLDivElement, param: DemoParam): void {
        this.createTags(div, param);
    }
    private createTags(div: HTMLDivElement, param: DemoParam): void {

        let fontSize = 12;
        let demoNames = param.demoNames;
        let px = 10;
        let py = 10;
        let len = demoNames.length;
        // len = 0;

        let areaSize = { x: 0, y: 10, width: 0, height: 0 } as DemoTagArea;

        for (let i = 0; i < len; ++i) {

            let name = demoNames[i];
            areaSize = this.getTextSize(name, fontSize + 4);

            let tx = px + areaSize.x + areaSize.width + 10;
            if (tx > 512) {
                py += areaSize.height + 10;
                px = 10;
            }

            areaSize.x = px;
            areaSize.y = py;
            areaSize.height -= 4;
            // console.log("areaSize: ", areaSize);

            this.createTag(div, i, fontSize + 'px', name, areaSize);

            px = areaSize.x + areaSize.width + 10;
        }
        // let c = new Color4(0.9478580831418233,0.9789360746399547,0.6743519901760193).ceil();
        // console.log("### ### ### color: ", c);
        // console.log("c: ", c.r, c.g, c.b);
    }
    private createTag(parentDiv: HTMLDivElement, index: number, fontSize: string, name: string, area: DemoTagArea): void {

        let cb = new Color4();
        cb.randomRGB(0.5, 0.2);
        let btn = new ButtonDivItem();
        // console.log("           >>> >>> area.x, area.y: ", area.x, area.y);
        let div = createDiv(area.x, area.y, area.width, area.height);
        parentDiv.appendChild(div);
        btn.setDeselectColors([cb.clone().scaleBy(0.7).getRGBUint24(), cb.clone().scaleBy(0.8).getRGBUint24(), cb.clone().getRGBUint24()]);
        btn.initialize(div, name, name);
        // div.style.cursor = "none";

        btn.setTextSize(fontSize);
        let c = new Color4().randomRGB(1.0, 0.4).clamp().ceil().clamp();
        btn.setTextColor(c.getRGBUint24());
        btn.setTextAlign('center');
        btn.onmouseup = (): void => {
            this.mana.gotoIndex( index );
            window.location.reload();
        }
    }

    getTextSize(
        chars: string,
        fontSize = 20,
        fixWidth = 0
    ): DemoTagArea {
        if (chars == null || chars == "" || fontSize < 8) {
            return null;
        }
        let width: number = fontSize + 4;
        let height: number = fontSize + 6;
        if (chars.length > 1) {
            width = fontSize * chars.length;
        }

        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        // canvas.style.display = "bolck";
        // canvas.style.left = "0px";
        // canvas.style.top = "0px";
        // canvas.style.position = "absolute";
        canvas.style.backgroundColor = "transparent";
        //canvas.style.pointerEvents = 'none';

        let ctx2D = canvas.getContext("2d");
        ctx2D.font = fontSize - 4 + "px Verdana";
        //ctx2D.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
        ctx2D.textBaseline = "top";

        var metrics: any = ctx2D.measureText(chars);
        let texWidth = metrics.width;

        if (chars.length > 1 || fixWidth > 0) {
            width = Math.round(texWidth + 8);
            if (fixWidth > 0 && width < fixWidth) {
                width = fixWidth;
            }
            canvas.width = width;
            ctx2D = canvas.getContext("2d");
            ctx2D.font = fontSize - 4 + "px Verdana";
            ctx2D.textBaseline = "top";
        }

        /*
        ctx2D.fillStyle = bgStyle;
        ctx2D.fillRect(0, 0, width, height);
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = frontStyle;

        ctx2D.fillText(chars, Math.round((width - texWidth) * 0.5), 6);
        //*/

        return { x: 0, y: 0, width, height };
    }
}
export { DemoTagGroup };
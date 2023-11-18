export function createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
	let div: HTMLDivElement = document.createElement("div");
	let style = div.style;
	style.width = pw + "px";
	style.height = ph + "px";
	style.display = "bolck";
	style.left = px + "px";
	style.top = py + "px";
	style.position = "absolute";
	style.display = "bolck";
	style.position = "absolute";
	return div;
}
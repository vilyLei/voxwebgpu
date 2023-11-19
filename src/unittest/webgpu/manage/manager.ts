export function getCookieByName(cname: string) {
	let ckInfo = document.cookie + ""
	let index0 = ckInfo.indexOf(cname + "=");
	if (index0 >= 0) {
		let index1 = ckInfo.indexOf(";", index0 + 1)
		if (index1 < 0) {
			index1 = ckInfo.length
		}
		let kvalue = ckInfo.slice(index0, index1);
		kvalue = kvalue.split("=")[1]
		return kvalue;
	}
	return "";
}
export function setCookieByName(cname: string, value: string) {
	let pvalue = cname + "=" + value + ";";
	console.log('setCookieByName(), pvalue: ', pvalue);
	document.cookie = pvalue;
}
export class UnitsTestMana {
	private mKeyName = 'unit_test-index';
	private mUnitIndex = -1;
    private mdDemoNames: string[];
	constructor(demoNames: string[]){
        this.mdDemoNames = demoNames;
    }
	downIndex(): void {
		this.mUnitIndex--;
		if(this.mUnitIndex < 0) {
			this.mUnitIndex += this.mdDemoNames.length;
		}
		this.setIndex();
	}
	upIndex(): void {
		this.mUnitIndex++;
		if(this.mUnitIndex >= this.mdDemoNames.length) {
			this.mUnitIndex -= this.mdDemoNames.length;
		}
		this.setIndex();
	}
	gotoIndex(i: number): void {
		this.mUnitIndex = i;
		this.setIndex();
	}
	getIndex(): number {
		if(this.mUnitIndex >= 0) {
			return this.mUnitIndex;
		}
		let sv = getCookieByName(this.mKeyName);
		let index = 0;
		if(sv.length > 0) {
			index = parseInt(sv);
		}
		this.mUnitIndex = index;
		return this.mUnitIndex;
	}
	setIndex(): void {
		setCookieByName(this.mKeyName, this.mUnitIndex + '');
	}
}

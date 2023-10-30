import { Entity3D } from "../../entity/Entity3D";
import Vector3 from "../../math/Vector3";

class TransObject {

	entity: Entity3D;

	position	= 	new Vector3();
	scale		=	new Vector3(1.0, 1.0, 1.0);
	rotation	=	new Vector3();

	rotationSpdv = new Vector3(0.1, 1.0);

	constructor(){}

	initialize(range = 1000): void {

		// let range = 1000.0;
		let rangeHalf = 0.5 * range;

		const pos = this.position;
		pos.setXYZ(
			Math.random() * range - rangeHalf,
			Math.random() * range - rangeHalf,
			Math.random() * range - rangeHalf
		);
	}

	run(): void {

		const et = this.entity;
		if(et) {
			const trans = et.transform;
			trans.setPosition( this.position );
			trans.setScale( this.scale );
			trans.setRotation( this.rotation );
			this.rotation.addBy( this.rotationSpdv );
			et.update();
		}
	}
}

export { TransObject }

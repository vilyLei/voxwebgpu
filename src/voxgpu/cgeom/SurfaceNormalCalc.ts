/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3 from "../math/Vector3";
class SurfaceNormalCalc {
	static s_temp_va = new Vector3();
	static s_temp_vb = new Vector3();
	static s_temp_vc = new Vector3();
	static s_temp_vd = new Vector3();
	static s_temp_ve = new Vector3();
	static s_temp_vf = new Vector3();
	static s_temp_vg = new Vector3();
	/**
	* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
	*/
	static ClacTriNormal(va: Vector3, vb: Vector3, vc: Vector3, resultNormal: Vector3): void {
		let calc = SurfaceNormalCalc;
		Vector3.Subtract(vb, va, calc.s_temp_vb);
		Vector3.Subtract(vc, vb, calc.s_temp_vc);
		Vector3.Cross(calc.s_temp_vb, calc.s_temp_vc, resultNormal);
		resultNormal.normalize();
	}
	/**
	* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
	* @param verteies			verteies's length is N multiple 9
	* @param triangleIndex		triangle index of triangles
	* @param resultNormal		result normalize Vector3 normal
	*/
	static ClacTriNormalByVS(verteies: Float32Array, triangleIndex: number, resultNormal: Vector3): void {
		let calc = SurfaceNormalCalc;
		let i: number = triangleIndex * 9;
		calc.s_temp_va.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		resultNormal.setXYZ(verteies[i + 3], verteies[i + 4], verteies[i + 5]);
		calc.s_temp_vc.setXYZ(verteies[i + 6], verteies[i + 7], verteies[i + 8]);
		resultNormal.subtractBy(calc.s_temp_va);
		calc.s_temp_vc.subtractBy(calc.s_temp_va);
		//vox::kernel::geom::Vector3::cross(vb, vc, resultNormal);
		resultNormal.crossBy(calc.s_temp_vc);
		resultNormal.normalize();
	}
	static ClacTriNormalByIVS(verteies: Float32Array, triangleIndex: number, indices: Uint16Array | Uint32Array, resultNormal: Vector3): void {

		let calc = SurfaceNormalCalc;
		let j: number = triangleIndex * 3;
		let i: number = indices[j] * 3;
		calc.s_temp_va.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 1] * 3;
		resultNormal.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 2] * 3;
		calc.s_temp_vc.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		//trace(triangleIndex, ", v3a: ", SurfaceNormalCalc.s_temp_va, ", v3b: ", resultNormal, ", v3c: ", SurfaceNormalCalc.s_temp_vc);
		resultNormal.subtractBy(calc.s_temp_va);
		calc.s_temp_vc.subtractBy(calc.s_temp_va);
		resultNormal.crossBy(calc.s_temp_vc);
		resultNormal.normalize();
		//trace("						normal: ", resultNormal);
	}
	static ClacTrisNormal(verteies: Float32Array, verteiesLength: number, numTriangles: number, indices: Uint16Array | Uint32Array, normals: Float32Array): void {

		let calc = SurfaceNormalCalc;
		let v3: Vector3 = new Vector3();
		let j: number = 0, k: number = 0, i: number = 0;
		for (i = 0; i < verteiesLength; ++i) {
			normals[i] = 0.0;
		}
		for (i = 0; i < numTriangles; ++i) {
			calc.ClacTriNormalByIVS(verteies, i, indices, v3);

			j = i * 3;
			k = indices[j] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
			k = indices[j + 1] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
			k = indices[j + 2] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
		}
		for (i = 0; i < verteiesLength; i += 3) {
			calc.s_temp_va.setXYZ(normals[i], normals[i + 1], normals[i + 2]);
			calc.s_temp_va.normalize();
			normals[i] = calc.s_temp_va.x; normals[i + 1] = calc.s_temp_va.y; normals[i + 2] = calc.s_temp_va.z;
		}
	}
	static ClacTriTangent(verteies: Float32Array, uvs: Float32Array, nvs: Float32Array, triangleIndex: number, indices: Uint16Array | Uint32Array, tangent: Vector3, biTangent: Vector3): void {

		let calc = SurfaceNormalCalc;
		let j: number = triangleIndex * 3;
		// pos
		let i: number = indices[j] * 3;
		calc.s_temp_va.setXYZ(nvs[i], nvs[i + 1], nvs[i + 2]);
		calc.s_temp_va.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 1] * 3;
		calc.s_temp_vb.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 2] * 3;
		calc.s_temp_vc.setXYZ(verteies[i], verteies[i + 1], verteies[i + 2]);
		// uv
		i = indices[j] * 2;
		calc.s_temp_vd.setXYZ(uvs[i], uvs[i + 1], 0.0);
		i = indices[j + 1] * 2;
		calc.s_temp_ve.setXYZ(uvs[i], uvs[i + 1], 0.0);
		i = indices[j + 2] * 2;
		calc.s_temp_vf.setXYZ(uvs[i], uvs[i + 1], 0.0);
		// edges of pos
		calc.s_temp_vb.subtractBy(calc.s_temp_va);
		calc.s_temp_vc.subtractBy(calc.s_temp_va);
		calc.s_temp_ve.subtractBy(calc.s_temp_vd);
		calc.s_temp_vf.subtractBy(calc.s_temp_vd);
		let dt: number = 1.0 / (calc.s_temp_ve.x * calc.s_temp_vf.y - calc.s_temp_ve.y * calc.s_temp_vf.x);

		tangent.copyFrom(calc.s_temp_vb);
		tangent.scaleBy(calc.s_temp_vf.y);
		calc.s_temp_va.copyFrom(calc.s_temp_vc);
		calc.s_temp_va.scaleBy(calc.s_temp_ve.y);
		tangent.subtractBy(calc.s_temp_va);
		tangent.scaleBy(dt);
		tangent.normalize();
		biTangent.copyFrom(calc.s_temp_vc);
		biTangent.scaleBy(calc.s_temp_ve.x);
		calc.s_temp_va.copyFrom(calc.s_temp_vb);
		calc.s_temp_va.scaleBy(calc.s_temp_vf.x);
		biTangent.subtractBy(calc.s_temp_va);
		biTangent.scaleBy(dt);
		biTangent.normalize();
		//*/
	}
	static ClacTrisTangent(verteies: Float32Array, verteiesLength: number, uvs: Float32Array, nvs: Float32Array, numTriangles: number, indices: Uint16Array | Uint32Array, tangent: Float32Array, biTangent: Float32Array): void {

		let calc = SurfaceNormalCalc;
		let tv3: Vector3 = new Vector3(), btv3: Vector3 = new Vector3();
		let j: number = 0, k: number = 0, i: number = 0;
		for (i = 0; i < verteiesLength; ++i) {
			tangent[i] = 0.0;
			biTangent[i] = 0.0;
		}
		for (i = 0; i < numTriangles; ++i) {
			calc.ClacTriTangent(verteies, uvs, nvs, i, indices, tv3, btv3);
			j = i * 3;
			k = indices[j] * 3;
			tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
			biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
			k = indices[j + 1] * 3;
			tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
			biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
			k = indices[j + 2] * 3;
			tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
			biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
		}
		for (i = 0; i < verteiesLength; i += 3) {
			calc.s_temp_vd.setXYZ(tangent[i], tangent[i + 1], tangent[i + 2]);
			calc.s_temp_vd.normalize();
			calc.s_temp_vb.setXYZ(biTangent[i], biTangent[i + 1], biTangent[i + 2]);
			calc.s_temp_vb.normalize();
			calc.s_temp_vc.setXYZ(nvs[i], nvs[i + 1], nvs[i + 2]);
			calc.s_temp_va.copyFrom(calc.s_temp_vc);
			calc.s_temp_vc.scaleBy(calc.s_temp_vc.dot(calc.s_temp_vd));
			calc.s_temp_vd.subtractBy(calc.s_temp_vc);
			calc.s_temp_vd.normalize();
			//b = b - n * dot( b, n )
			calc.s_temp_vc.setXYZ(nvs[i], nvs[i + 1], nvs[i + 2]);
			calc.s_temp_vc.scaleBy(calc.s_temp_vb.dot(calc.s_temp_vc));
			calc.s_temp_vb.subtractBy(calc.s_temp_vc);
			calc.s_temp_vb.normalize();
			calc.s_temp_va.crossBy(calc.s_temp_vd);
			if (calc.s_temp_va.dot(calc.s_temp_vb) < 0.0) {
				calc.s_temp_vd.scaleBy(-1.0);
			}
			tangent[i] = calc.s_temp_vd.x; tangent[i + 1] = calc.s_temp_vd.y; tangent[i + 2] = calc.s_temp_vd.z;
			calc.s_temp_vb.setXYZ(nvs[i], nvs[i + 1], nvs[i + 2]);
			calc.s_temp_vb.crossBy(calc.s_temp_vd);
			calc.s_temp_vb.normalize();
			biTangent[i] = calc.s_temp_vb.x; biTangent[i + 1] = calc.s_temp_vb.y; biTangent[i + 2] = calc.s_temp_vb.z;
		}
	}
}

export default SurfaceNormalCalc;

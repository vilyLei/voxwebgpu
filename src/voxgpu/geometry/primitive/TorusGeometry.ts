/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import GeometryBase from "./GeometryBase";
import PipeGeometryData from "./PipeGeometryData";
import Vector3 from "../../math/Vector3";
import Matrix4 from "../../math/Matrix4";

export default class TorusGeometry extends GeometryBase {
    constructor() {
        super();
    }

    private mvs: Float32Array = null;
    private muvs: Float32Array = null;
    private mnvs: Float32Array = null;
    private m_cvs: Float32Array = null;
    private m_boundsChanged: boolean = false;

    readonly geometry = new PipeGeometryData();
    uScale = 1.0;
    vScale = 1.0;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;

    getCircleCenterAt(i: number, outV: Vector3): void {
        this.geometry.getCenterAt(i, outV);
        this.m_boundsChanged = true;
    }
    transformCircleAt(i: number, mat4: Matrix4): void {
        this.geometry.transformAt(i, mat4);
        this.m_boundsChanged = true;
    }
    getVS(): Float32Array { return this.mvs; }
    getUVS(): Float32Array { return this.muvs; }
    getNVS(): Float32Array { return this.mnvs; }
    getCVS(): Float32Array { return this.m_cvs; }
    getIVS(): Uint16Array | Uint32Array { return this.mivs; }

    initialize(ringRadius: number, axisRadius: number, longitudeNumSegments: number, latitudeNumSegments: number, uvType: number = 1, alignYRatio: number = -0.5): void {

        if (this.mvs == null) {

            let g = this.geometry;
            switch (this.axisType) {
                case 1:
                    g.axisType = 2;
                    break;
                case 2:
                    g.axisType = 0;
                    break;
                default:
                    g.axisType = 1;
                    break;
            }
            g.initialize(axisRadius, 0.0, longitudeNumSegments, latitudeNumSegments, uvType, alignYRatio);

            let nvFlag = true;
            let vs = g.getVS();
            let uvs = g.getUVS();
            let ivs = g.getIVS();

            if (nvFlag) {
                this.mnvs = new Float32Array(vs.length);
            }
            let nvs = this.mnvs;

            let pi2 = 2.0 * Math.PI;
            let rad = 0.0;
            let pv = new Vector3();
            let nv = new Vector3();
            let mat4 = new Matrix4();
            for (let i = 0; i <= latitudeNumSegments; ++i) {

                mat4.identity();
                rad = pi2 * i / latitudeNumSegments;
                switch (this.axisType) {
                    case 1:
                        pv.x = Math.cos(rad) * ringRadius;
                        pv.z = Math.sin(rad) * ringRadius;
                        mat4.rotationY(-rad);
                        break;
                    case 2:
                        pv.y = Math.cos(rad) * ringRadius;
                        pv.x = Math.sin(rad) * ringRadius;
                        mat4.rotationZ(-rad);
                        break;
                    default:
                        pv.z = Math.cos(rad) * ringRadius;
                        pv.y = Math.sin(rad) * ringRadius;
                        mat4.rotationX(-rad);
                        break;
                }

                mat4.setTranslation(pv);
                g.transformAt(i, mat4);
                if (nvFlag) {
                    let cv = pv;
                    let range = g.getRangeAt(i);
                    let pvs = vs.subarray(range[0], range[1]);
                    let pnvs = nvs.subarray(range[0], range[1]);
                    let tot = pvs.length / 3;
                    let k = 0;
                    for (let j = 0; j < tot; ++j) {
                        k = j * 3;
                        nv.setXYZ(pvs[k], pvs[k + 1], pvs[k + 2]);
                        nv.subtractBy(cv);
                        nv.normalize();
                        pnvs[k] = nv.x;
                        pnvs[k + 1] = nv.y;
                        pnvs[k + 2] = nv.z;
                    }
                }
            }
            this.mvs = vs;
            this.muvs = uvs;
            this.mivs = ivs;
            this.bounds = this.geometry.bounds;
            this.bounds.reset();
            this.bounds.addFloat32Arr(this.mvs);
            this.bounds.update();

            this.vtCount = this.geometry.vtCount;
            this.trisNumber = this.geometry.trisNumber;
            this.vtxTotal = this.mvs.length / 3;
        }
        this.initializeBuf(true);
    }

    reinitialize(): void {
        if (this.mvs != null) {
            this.initializeBuf(false);
        }
    }
    private initializeBuf(newBuild: boolean): void {
        if (this.mTransMatrix != null) {
            this.m_boundsChanged = true;
            this.mTransMatrix.transformVectorsSelf(this.mvs, this.mvs.length);
        }
        if (this.m_boundsChanged) {
            this.bounds.reset();
            this.bounds.addFloat32Arr(this.mvs);
            this.bounds.updateFast();
        }
        this.m_boundsChanged = false;


    }
    __$destroy(): void {
        if (this.mivs) {
            this.bounds = null;

            this.mvs = null;
            this.muvs = null;
            this.mnvs = null;
            this.m_cvs = null;
            super.__$destroy();
        }
    }
}

import { Entity3D } from "../../entity/Entity3D";
import { FixScreenPlaneEntity } from "../../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../../render/pass/WGRPassNodeGraph";
import { WGRPassColorAttachment } from "../../render/pipeline/WGRPassColorAttachment";
import { IRendererScene } from "../../rscene/IRendererScene";
import Camera from "../../view/Camera";
import { MaterialUniformMat44Data, WGRBufferData } from "../mdata/MaterialUniformData";
import { VSMUniformData } from "../mdata/VSMUniformData";
import { ShadowOccBlurMaterial } from "../ShadowOccBlurMaterial";
import { WGRShderSrcType, WGMaterial } from "../WGMaterial";
import { MtlPipeNodeImpl } from "./MtlPipeNodeImpl";
import { MtPlPipeNode } from "./MtPlPipeNode";

import shadowDepthWGSL from "../shader/shadow/shadowDepth.wgsl";
import Matrix4 from "../../math/Matrix4";
class ShadowPassGraph extends WGRPassNodeGraph {

    private entities: Entity3D[] = [];
    private mDepthMaterials: WGMaterial[];

    shadowDepthRTT = { uuid: "rtt-shadow-depth", rttTexture: {}, shdVarName: 'shadowData' };
    depAttachment: WGRPassColorAttachment = {
        texture: this.shadowDepthRTT,
        // background clear color
        clearValue: { r: 1, g: 1, b: 1, a: 1.0 },
        loadOp: "clear",
        storeOp: "store"
    };

    occVRTT = { uuid: "rtt-shadow-occV", rttTexture: {}, shdVarName: 'shadowData' };
    occHRTT = { uuid: "rtt-shadow-occH", rttTexture: {}, shdVarName: 'shadowData' };
    occVEntity: FixScreenPlaneEntity;
    occHEntity: FixScreenPlaneEntity;

    shadowBias = -0.0005;
    shadowRadius = 2.0;
    shadowMapW = 512;
    shadowMapH = 512;
    shadowViewW = 1300;
    shadowViewH = 1300;

    shadowCamera: Camera;
    private mMatrixData: MaterialUniformMat44Data;
    private mVSMData: VSMUniformData;
    constructor(vsmData: VSMUniformData, matrixData: MaterialUniformMat44Data) {
        super();
        this.mVSMData = vsmData;
        this.mMatrixData = matrixData;
    }
    private initMaterial(): void {
        const shadowDepthShdSrc = {
            shaderSrc: { code: shadowDepthWGSL, uuid: "shadowDepthShdSrc" }
        };
        this.mDepthMaterials = [this.createDepthMaterial(shadowDepthShdSrc)];
    }
    private createDepthMaterial(shaderSrc: WGRShderSrcType, faceCullMode = "none"): WGMaterial {

        let pipelineDefParam = {
            depthWriteEnabled: true,
            faceCullMode,
            blendModes: [] as string[]
        };

        const material = new WGMaterial({
            shadinguuid: "shadow-depth_material",
            shaderSrc,
            pipelineDefParam
        });

        return material;
    }
    private buildShadowCam(): void {
        const g = this;
        const cam = new Camera({
            eye: [600.0, 800.0, -600.0],
            near: 0.1,
            far: 1900,
            perspective: false,
            viewWidth: g.shadowViewW,
            viewHeight: g.shadowViewH
        });
        cam.update();
        g.shadowCamera = cam;

        let transMatrix = new Matrix4();
        transMatrix.setScaleXYZ(0.5, -0.5, 0.5);
        transMatrix.setTranslationXYZ(0.5, 0.5, 0.5);
        let shadowMat = new Matrix4();
        shadowMat.copyFrom(cam.viewProjMatrix);
        shadowMat.append(transMatrix);
        this.mMatrixData.shadowMatrix = transMatrix;
        this.mVSMData.direction = cam.nv;
    }
    addEntity(entity: Entity3D): ShadowPassGraph {

        let pass = this.passes[0];
        let et = new Entity3D({ transform: entity.transform });
        // et.materials = this.mDepthMaterials;
        et.geometry = entity.geometry;
        et.rstate.copyFrom(entity.rstate);
        this.entities.push(et);
        pass.addEntity(et, { materials: this.mDepthMaterials });

        return this;
    }
    addEntities(entities: Entity3D[]): ShadowPassGraph {
        let es = entities;
        for (let i = 0; i < es.length; ++i) {
            this.addEntity(es[i]);
        }
        return this;
    }
    initialize(rc: IRendererScene): ShadowPassGraph {

        let colorAttachments = [
            this.depAttachment
        ];
        // create a separate rtt rendering pass
        let multisampled = false;
        let pass = rc.createRTTPass({ colorAttachments, multisampled });
        this.passes = [pass];
        rc.setPassNodeGraph(this);

        this.buildShadowCam();
        pass.node.camera = this.shadowCamera;

        console.log('pass.node.viewport: ', pass.node.viewport);

        this.initMaterial();
        this.initocc();

        return this;
    }

    private initocc(): void {

        let pass = this.passes[0];

        let extent = [-1, -1, 2, 2];

        let material = new ShadowOccBlurMaterial();
        let ppt = material.property;
        ppt.setShadowRadius(this.shadowRadius);
        ppt.setViewSize(this.shadowMapW, this.shadowMapH);
        material.addTextures([this.shadowDepthRTT]);
        this.occVEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
        this.occVEntity.visible = false;
        pass.addEntity(this.occVEntity);

        material = new ShadowOccBlurMaterial();
        ppt = material.property;
        ppt.setShadowRadius(this.shadowRadius);
        ppt.setViewSize(this.shadowMapW, this.shadowMapH);
        ppt.toHorizonalBlur();
        material.addTextures([this.occVRTT]);
        this.occHEntity = new FixScreenPlaneEntity({ extent, materials: [material] });
        this.occHEntity.visible = false;
        pass.addEntity(this.occHEntity);
    }
    run(): void {

        let pass = this.passes[0];

        let attachment = this.depAttachment;
        attachment.texture = this.shadowDepthRTT;

        let es = this.entities;
        for (let i = 0; i < es.length; ++i) {
            es[i].visible = true;
        }
        pass.render();
        for (let i = 0; i < es.length; ++i) {
            es[i].visible = false;
        }

        attachment.texture = this.occVRTT;
        this.occVEntity.visible = true;
        pass.render();
        this.occVEntity.visible = false;

        attachment.texture = this.occHRTT;
        this.occHEntity.visible = true;
        pass.render();
        this.occHEntity.visible = false;
    }
}

class VSMPipeNode extends MtPlPipeNode implements MtlPipeNodeImpl {

    type = 'vsm_shadow';
    macro = 'USE_VSM_SHADOW';

    vsm = new VSMUniformData(null, "vsmParams", "frag");
    /**
     * shadow material
     */
    matrix = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");

    passGraph = new ShadowPassGraph(this.vsm, this.matrix);

    merge(ls: WGRBufferData[]): void {
        let end = ls.length - 1;
        this.addTo(ls, this.vsm, 0, end);
        this.addTo(ls, this.matrix, 0, end);
    }
    getDataList(): WGRBufferData[] {
        return [this.vsm, this.matrix];
    }
}
export { VSMPipeNode }
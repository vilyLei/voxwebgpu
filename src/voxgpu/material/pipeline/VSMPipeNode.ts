import { Entity3D } from "../../entity/Entity3D";
import { FixScreenPlaneEntity } from "../../entity/FixScreenPlaneEntity";
import { WGRPassNodeGraph } from "../../render/pass/WGRPassNodeGraph";
import { WGRPassColorAttachment } from "../../render/pipeline/WGRPassColorAttachment";
import { IRendererScene } from "../../rscene/IRendererScene";
import Camera from "../../view/Camera";
import { MaterialUniformMat44Data, WGRBufferData } from "../mdata/MaterialUniformData";
import { VSMUniformData } from "../mdata/VSMUniformData";
import { ShadowOccBlurMaterial } from "../ShadowOccBlurMaterial";
import { WGRShderSrcType, WGMaterial, WGTextureDataDescriptor } from "../WGMaterial";
import { MtPlNodeImpl } from "./MtPlNodeImpl";
import { MtPlNode } from "./MtPlNode";

import shadowDepthWGSL from "../shader/shadow/shadowDepth.wgsl";
import Matrix4 from "../../math/Matrix4";
import { WGTextureWrapper } from "../../texture/WGTextureWrapper";
import { updateMaterialData } from "../MtUtils";
class ShadowPassGraph extends WGRPassNodeGraph {

    private entities: Entity3D[] = [];
    private mDepthMaterials: WGMaterial[];
    material = new WGMaterial();
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
    shadowRadius = 4.0;
    shadowMapW = 512;
    shadowMapH = 512;
    shadowViewW = 1300;
    shadowViewH = 1300;

    shadowCamera: Camera;
    private mMatrixData: MaterialUniformMat44Data;
    private mVSMParam: VSMUniformData;
    constructor(vsmData: VSMUniformData, matrixData: MaterialUniformMat44Data) {
        super();
        this.mVSMParam = vsmData;
        this.mMatrixData = matrixData;
    }
    get texture(): WGTextureWrapper {
        let ls = this.material.textures;
        return ls.length > 0 ? ls[0] : null;
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
        this.mMatrixData.shadowMatrix = shadowMat;
        this.mVSMParam.direction = cam.nv;
    }
    addEntity(entity: Entity3D): ShadowPassGraph {
        if (this.passes && this.passes.length > 0) {
            let flag = false;
            let ms = entity.materials;
            if (ms) {
                for (let i = 0; i < ms.length; i++) {
                    let ppt = ms[i].property;
                    if (ppt && ppt.shadow === true) {
                        flag = true;
                        break;
                    }
                }
            }
            if (flag) {
                let pass = this.passes[0];
                let et = new Entity3D({ transform: entity.transform });
                et.geometry = entity.geometry;
                et.rstate.copyFrom(entity.rstate);
                this.entities.push(et);
                pass.addEntity(et, { materials: this.mDepthMaterials, phase: 'finish' });
            }

        }
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

        this.material.addTextures([this.occHRTT]);
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

        const mt = this.material;
        if (!mt.isREnabled()) {
            updateMaterialData(pass.getWGCtx(), mt);
        }
    }
}

class VSMPipeNode extends MtPlNode implements MtPlNodeImpl {

    type = 'vsmShadow';
    macros = ['USE_VSM_SHADOW'];

    param = new VSMUniformData("vsmParams", "frag");
    /**
     * shadow material
     */
    matrix = new MaterialUniformMat44Data(null, "shadowMatrix", "vert");

    passGraph = new ShadowPassGraph(this.param, this.matrix);

    initialize(rc: IRendererScene): void {
        this.passGraph.initialize(rc);
    }
    addEntity(entity: Entity3D): void {
        this.passGraph.addEntity(entity);
    }
    addEntities(entities: Entity3D[]): void {
        this.passGraph.addEntities(entities);
    }
    get texture(): WGTextureWrapper {
        return this.passGraph.texture;
    }
    merge(ls: WGRBufferData[]): void {
        let end = ls.length - 1;
        this.addTo(ls, this.param, 0, end);
        this.addTo(ls, this.matrix, 0, end);
    }
    getDataList(): WGRBufferData[] {
        return [this.param, this.matrix];
    }
    isEnabled(): boolean {
        let mt = this.passGraph.material;
        // console.log('occHRTT: ', this.passGraph.occHRTT);
        // console.log('tex: ', tex);
        return mt.isREnabled();
    }
}
export { VSMPipeNode }
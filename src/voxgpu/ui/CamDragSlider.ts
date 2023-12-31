/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IRenderCamera } from "../render/IRenderCamera";
import IRenderStage3D from "../render/IRenderStage3D";

class CamDragSlider {
    constructor() { }

    private m_stage3D: IRenderStage3D = null;
    private m_camera: IRenderCamera = null;
    private m_mouseX = 0.0;
    private m_mouseY = 0.0;
    private m_enabled = false;

    slideSpeed = 2.0;
    
    initialize(stage3D: IRenderStage3D, camera: IRenderCamera): void {
        if (this.m_stage3D == null) {
            this.m_stage3D = stage3D;
            this.m_camera = camera;
        }
    }

    attach(): void {
        this.m_mouseX = this.m_stage3D.mouseX;
        this.m_mouseY = this.m_stage3D.mouseY;
        this.m_enabled = true;
    }
    detach(): void {
        this.m_enabled = false;
    }
    run(): void {
        if (this.m_enabled) {
            let dx = (this.m_mouseX - this.m_stage3D.mouseX) * this.slideSpeed;
            let dy = (this.m_mouseY - this.m_stage3D.mouseY) * this.slideSpeed;
            (this.m_camera as any).slideViewOffsetXY(dx, dy);
            this.m_mouseX = this.m_stage3D.mouseX;
            this.m_mouseY = this.m_stage3D.mouseY;
        }
    }
}

export { CamDragSlider };
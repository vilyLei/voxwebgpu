/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";

export default class EvtNode {
    type = 0;
    private m_listeners: ((evt: any) => void)[] = [];
    private m_phases: number[] = [];
    createEvent(target: any = null, currentTarget: any = null): EventBase {
        let evt = new EventBase();
        evt.type = this.type;
        evt.target = target;
        evt.currentTarget = currentTarget;
        return evt;
    }
    addListener(func: (evt: any) => void, phase: number = 0): void {
        let i = this.m_listeners.length - 1;
        for (; i >= 0; --i) {
            if (func === this.m_listeners[i]) {
                break;
            }
        }
        if (i < 0) {
            this.m_listeners.push(func);
            this.m_phases.push(phase);
        }
    }
    removeListener(func: (evt: any) => void): void {
        let i = this.m_listeners.length - 1;
        for (; i >= 0; --i) {
            if (func === this.m_listeners[i]) {
                this.m_listeners.splice(i, 1);
                this.m_phases.splice(i, 1);
                break;
            }
        }
    }

    // @return      1 is send evt yes,0 is send evt no
    dispatch(evt: EventBase): number {
        let flag = 0;
        let len = this.m_listeners.length;
        for (let i = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
                this.m_listeners[i](evt);
                flag = 1;
            }
        }
        return flag;
    }
    //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: EventBase): number {
        let len = this.m_listeners.length;
        for (let i = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
                return 1;
                break;
            }
        }
        return 0;
    }
    passTestPhase(phase: number): number {
        let len = this.m_listeners.length;
        for (let i = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || phase == this.m_phases[i]) {
                return 1;
                break;
            }
        }
        return 0;
    }
    destroy(): void {
        this.m_listeners = [];
        this.m_phases = [];
    }
}

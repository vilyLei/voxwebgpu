/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EvtNode from "./EvtNode";
import IEvtDispatcher from "./IEvtDispatcher";
import EventBase from "./EventBase";

export default class EventBaseDispatcher implements IEvtDispatcher {

    private m_evtNodeMap: Map<number, EvtNode> = new Map();
    uuid = "";
    data: any = null;
    currentTarget: any = null;
    enabled = true;

    constructor() {
    }
    getClassType(): number {
        return EventBase.EventClassType;
    }
    destroy(): void {
        this.m_evtNodeMap.forEach((k) => {
            k.destroy();
        });

        this.data = null;
        this.currentTarget = null;
    }
    // @return      1 is send evt yes,0 is send evt no
    dispatchEvt(evt: any): number {
        if (this.enabled && evt != null) {
            if (this.uuid != "") evt.uuid = this.uuid;
            if (this.data != null) evt.data = this.data;
            if (this.currentTarget != null) evt.currentTarget = this.currentTarget;
            let t = evt.type;
            if (t > 1 && this.m_evtNodeMap.has(t)) {
                return this.m_evtNodeMap.get(t).dispatch(evt);
            }
            // else {
            //     console.log("EventBaseDispatcher::dispatchEvt(), Warn: undefined Event type.");
            // }
        }
        return 0;
    }

    //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: EventBase): number {
        if (evt != null) {
            let t: number = evt.type;
            if (t > 1 && this.m_evtNodeMap.has(t)) {
                return this.m_evtNodeMap.get(t).passTestEvt(evt);
            }
        }
        return 0;
    }
    //@return if the evt phase is in this node,it returns 1,otherwise it returns 0
    passTestPhase(phase: number): number {

        this.m_evtNodeMap.forEach((k) => {
            if (k.passTestPhase(phase) == 1) {
                return 1;
            }
        });
        return 0;
    }
    addEventListener(type: number, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        if (func) {
            let t = type;// - EventBase.GetMouseEvtTypeValueBase();
            if (t > 1) {
                //(capture phase),2(bubble phase)
                let phase: number = 0;
                if (captureEnabled != bubbleEnabled) {
                    if (captureEnabled) {
                        phase = 1;
                    }
                    else {
                        phase = 2;
                    }
                }
                if (this.m_evtNodeMap.has(type)) {
                    this.m_evtNodeMap.get(t).addListener(func, phase);
                }
                else {
                    let node = new EvtNode();
                    node.type = 33;
                    node.addListener(func, phase);
                    this.m_evtNodeMap.set(t, node);
                }
            }
            else {
                console.log("EventBaseDispatcher::addEventListener(), Warn: undefined Event type.");
            }
        }
    }
    removeEventListener(type: number, func: (evt: any) => void): void {
        if (func) {
            if (type > 1) {
                if (this.m_evtNodeMap.has(type)) {
                    this.m_evtNodeMap.get(type).removeListener(func);
                }
            }
            //  else
            //  {
            //      console.log("EventBaseDispatcher::removeEventListener(), Warn: undefined Event type.");
            //  }
        }
    }
}

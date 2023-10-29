/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import EventBase from "./EventBase";
import IProgressDataEvent from "./IProgressDataEvent";
export default class ProgressDataEvent extends EventBase implements IProgressDataEvent {
    static PROGRESS = 3101;
    status = 0;
    progress = 0.0;
    minValue = 0.0;
    maxValue = 1.0;
    value = 0.0;
    constructor() {
        super();
        this.type = ProgressDataEvent.PROGRESS;
    }
}

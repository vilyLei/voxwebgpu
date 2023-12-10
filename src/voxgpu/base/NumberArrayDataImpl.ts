/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export interface NumberArrayDataImpl {
    fromArray4(arr: NumberArrayType, offset?: number): unknown;
    toArray4(arr?: NumberArrayType, offset?: number): unknown;
    fromArray3(arr: NumberArrayType, offset?: number): unknown;
    toArray3(arr?: NumberArrayType, offset?: number): unknown;
}

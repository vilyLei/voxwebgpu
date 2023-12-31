/**
 * material property
 */
export interface MaterialProperty {
    uuid?: string;
    shadow?: boolean;
    shadowReceived?: boolean;
	lighting?: boolean;
	fogging?: boolean;
    getUniqueKey?(): string;
    getPreDef?(): string;
}
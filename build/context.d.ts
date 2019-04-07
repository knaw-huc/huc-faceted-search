import * as React from 'react';
import FacetsManager from './facets-manager';
export interface ContextState {
    cycle: number;
    facetsManager: FacetsManager;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

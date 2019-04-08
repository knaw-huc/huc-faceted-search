import * as React from 'react';
import FacetManager from './facets-manager';
export interface ContextState {
    cycle: number;
    facetsManager: FacetManager;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

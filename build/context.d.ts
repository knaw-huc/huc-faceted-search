import * as React from 'react';
import FacetsManager from './facets-manager';
export interface ContextState {
    facetsManager: FacetsManager;
    response: any;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

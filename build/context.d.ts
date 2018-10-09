import * as React from 'react';
import FacetsManager from './facets-manager';
import { Facets } from './models/facet';
export interface ContextState {
    facets: Facets;
    facetsManager: FacetsManager;
    response: any;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

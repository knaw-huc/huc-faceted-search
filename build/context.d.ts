import * as React from 'react';
import FacetsManager from './facets-manager';
import { Facets } from './models/facet';
import { ElasticSearchResponse } from './models/elastic-search-response-parser';
export interface ContextState {
    facets: Facets;
    facetsManager: FacetsManager;
    response: ElasticSearchResponse;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

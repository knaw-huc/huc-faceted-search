import * as React from 'react';
import IOManager from './io-manager';
import { Facets } from './models/facet';
import { ElasticSearchResponse } from './models/elastic-search-response-parser';
export interface ContextState {
    facets: Facets;
    ioManager: IOManager;
    response: ElasticSearchResponse;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

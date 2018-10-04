import * as React from 'react';
import IOManager, { Response, IFacets } from './io-manager';
export interface ContextState {
    facets: IFacets;
    ioManager: IOManager;
    response: Response;
}
export declare const defaultState: ContextState;
declare const _default: React.Context<ContextState>;
export default _default;

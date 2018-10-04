import * as React from 'react'
import IOManager, { Response, IFacets } from './io-manager';

export interface ContextState {
	facets: IFacets,
	ioManager: IOManager,
	response: Response
}
export const defaultState: ContextState = {
	facets: null,
	ioManager: null,
	response: null
}

export default React.createContext(defaultState)
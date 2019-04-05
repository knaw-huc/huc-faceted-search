import * as React from 'react'
import FacetsManager from './facets-manager'
import { Facets } from './models/facet'

export interface ContextState {
	facets: Facets,
	facetsManager: FacetsManager,
	response: any
}
export const defaultState: ContextState = {
	facets: new Map(),
	facetsManager: null,
	response: null
}

export default React.createContext(defaultState)
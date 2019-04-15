import * as React from 'react'
import FacetManager from './facets-manager'

export interface ContextState {
	facetsManager: FacetManager,
	searchResult: SearchResults
}
export const defaultState: ContextState = {
	facetsManager: null,
	searchResult: {
		hits: [],
		total: 0
	}
}

export default React.createContext(defaultState)

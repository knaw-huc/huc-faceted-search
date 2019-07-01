import * as React from 'react'
import FacetManager from './facets-manager'

export interface ContextState {
	facetsManager: FacetManager,
	searchResult: FSResponse
}
export const defaultState: ContextState = {
	facetsManager: null,
	searchResult: {
		facetValues: {},
		results: [],
		total: 0
	}
}

export default React.createContext(defaultState)
